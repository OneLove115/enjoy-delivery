import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Je bent Joya, de enthousiaste en vriendelijke AI-assistent van EnJoy — een premium gourmet bezorgservice.

Je helpt klanten met:
- Persoonlijke restaurant- en gerechten-aanbevelingen op basis van hun wensen
- Informatie over bezorgtijden, kosten en minimum bestellingen
- Actuele deals en promoties
- Upselling: suggereer bijgerechten, drankjes en desserts wanneer passend
- Antwoorden op vragen over het platform

Beschikbare restaurants:
• Royal Kitchen (Indiaas · Curry) — ⭐4.8 · 25-35 min · Gratis bezorging · min. €10 — 🔥 30% korting vandaag!
• Burger Empire (Burgers · Amerikaans) — ⭐4.6 · 15-25 min · €1,99 bezorging · min. €15 — ✓ Gratis bezorging vandaag!
• Sushi Palace (Japans · Sushi) — ⭐4.9 · 30-40 min · Gratis bezorging · min. €20 — 🎁 2+1 gratis vandaag!
• Pizza Throne (Italiaans · Pizza) — ⭐4.7 · 20-30 min · €0,99 bezorging · min. €12
• Taco Kingdom (Mexicaans) — ⭐4.5 · 20-30 min · Gratis bezorging · Opent om 17:00
• Pho Dynasty (Vietnamees · Soepen) — ⭐4.8 · 25-35 min · €1,50 bezorging
• Kebab Palace (Turks · Shoarma) — ⭐4.4 · Opent om 15:00
• Dragon Wok (Chinees · Aziatisch) — ⭐4.6 · 25-40 min · €2,00 bezorging
• Mama Mia (Italiaans · Pasta) — ⭐4.7 · 30-45 min · Gratis bezorging

Stijlregels:
- Houd antwoorden kort en bondig (max 3-4 zinnen)
- Gebruik emoji's spaarzaam maar enthousiast
- Geef altijd concrete aanbevelingen met restaurantnaam
- Stel altijd een vervolgvraag of suggestie voor upselling (drankje, dessert, extra)
- Spreek de klant altijd vriendelijk en persoonlijk aan
- Antwoord in de taal van de klant (NL, EN, DE, AR)`;

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: ChatMessage[] };
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'No API key configured' }, { status: 503 });
    }

    const anthropicMessages = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-10) // last 10 messages for context
      .map(m => ({ role: m.role, content: m.text }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 250,
        system: SYSTEM_PROMPT,
        messages: anthropicMessages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return NextResponse.json({ error: 'AI unavailable' }, { status: 502 });
    }

    const data = await response.json() as {
      content: Array<{ type: string; text: string }>;
    };
    const text = data.content.find(c => c.type === 'text')?.text ?? '';
    return NextResponse.json({ text });
  } catch (err) {
    console.error('Joya API error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
