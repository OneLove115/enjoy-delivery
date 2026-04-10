/**
 * POST /api/translate
 * Server-side translation proxy for EnJoy.
 * Uses DeepLX free API for real-time translation.
 */
import { NextRequest, NextResponse } from 'next/server';

const DEEPLX_URL = process.env.DEEP_LX_URL || 'https://api.deeplx.org';

const cache = new Map<string, string>();
const MAX_CACHE = 5000;

export async function POST(req: NextRequest) {
  try {
    const { texts, targetLang, sourceLang = 'auto' } = await req.json() as {
      texts: string[];
      targetLang: string;
      sourceLang?: string;
    };

    if (!texts || !Array.isArray(texts) || !targetLang) {
      return NextResponse.json({ error: 'texts[] and targetLang required' }, { status: 400 });
    }

    if (texts.length > 100) {
      return NextResponse.json({ error: 'Max 100 texts per request' }, { status: 400 });
    }

    if (targetLang.toUpperCase() === 'EN') {
      return NextResponse.json({ translations: texts });
    }

    const results: string[] = new Array(texts.length);
    const uncached: string[] = [];
    const uncachedIdx: number[] = [];

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i]?.trim();
      if (!text || text.length < 2 || /^[\d\s\-.,;:!?€$@#%&*()+=/\\]+$/.test(text)) {
        results[i] = texts[i];
        continue;
      }
      const key = `${text}::${targetLang}`;
      if (cache.has(key)) {
        results[i] = cache.get(key)!;
      } else {
        uncached.push(text);
        uncachedIdx.push(i);
      }
    }

    if (uncached.length > 0) {
      const batchSize = 25;
      for (let b = 0; b < uncached.length; b += batchSize) {
        const batch = uncached.slice(b, b + batchSize);

        const promises = batch.map(async (text) => {
          try {
            const res = await fetch(`${DEEPLX_URL}/translate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text,
                source_lang: sourceLang === 'auto' ? '' : sourceLang,
                target_lang: targetLang.toUpperCase(),
              }),
            });
            if (res.ok) {
              const data = await res.json();
              return data.data || data.alternatives?.[0] || text;
            }
            return text;
          } catch {
            return text;
          }
        });

        const translated = await Promise.all(promises);

        for (let j = 0; j < translated.length; j++) {
          const idx = uncachedIdx[b + j];
          results[idx] = translated[j];
          const key = `${uncached[b + j]}::${targetLang}`;
          cache.set(key, translated[j]);
          if (cache.size > MAX_CACHE) {
            const first = cache.keys().next().value;
            if (first) cache.delete(first);
          }
        }
      }
    }

    return NextResponse.json({ translations: results });
  } catch (err) {
    console.error('[translate] Error:', err);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
