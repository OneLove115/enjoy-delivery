"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B00';

/* ─── Language detection ─── */
type Lang = 'nl' | 'en' | 'de' | 'ar';

function detectLang(text: string): Lang {
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  const t = text.toLowerCase();
  const deWords = ['ich', 'möchte', 'bitte', 'was', 'haben', 'essen', 'bestellen', 'hallo', 'guten'];
  const enWords = ['i want', 'please', 'order', 'what', 'can i', 'hello', 'hi', 'food', 'deliver'];
  if (deWords.some(w => t.includes(w))) return 'de';
  if (enWords.some(w => t.includes(w))) return 'en';
  return 'nl';
}

/* ─── Time-aware data ─── */
function getTimeContext(): { hour: number; greeting: Record<Lang, string>; suggestion: Record<Lang, string>; chips: string[] } {
  const h = new Date().getHours();
  if (h >= 6 && h < 11) return {
    hour: h,
    greeting: { nl: 'Goedemorgen', en: 'Good morning', de: 'Guten Morgen', ar: 'صباح الخير' },
    suggestion: { nl: 'Tijd voor een heerlijk ontbijt of lunch! 🥐', en: 'Time for a great breakfast or brunch! 🥐', de: 'Zeit für ein leckeres Frühstück! 🥐', ar: 'حان وقت الإفطار الشهي! 🥐' },
    chips: ['🥐 Ontbijt', '☕ Koffie & gebak', '🥗 Gezond', '🍳 Brunch'],
  };
  if (h >= 11 && h < 15) return {
    hour: h,
    greeting: { nl: 'Hoi', en: 'Hey', de: 'Hallo', ar: 'مرحبا' },
    suggestion: { nl: 'Lunchhonger? Ik heb de beste lunchopties voor je! 🥙', en: "Hungry for lunch? I've got the best options! 🥙", de: 'Lust auf Mittagessen? Ich habe die besten Optionen! 🥙', ar: 'هل أنت جائع للغداء؟ لدي أفضل الخيارات! 🥙' },
    chips: ['🥙 Snelle lunch', '🍕 Pizza', '🍣 Sushi', '🥗 Salade'],
  };
  if (h >= 15 && h < 18) return {
    hour: h,
    greeting: { nl: 'Hoi', en: 'Hey', de: 'Hallo', ar: 'مرحبا' },
    suggestion: { nl: 'Zin in een snack tussendoor? 🍟', en: 'Craving an afternoon snack? 🍟', de: 'Lust auf einen Nachmittagssnack? 🍟', ar: 'هل تريد وجبة خفيفة بعد الظهر؟ 🍟' },
    chips: ['🍟 Snacks', '🍔 Burger', '🥤 Drankje erbij', '🎲 Verras me'],
  };
  if (h >= 18 && h < 23) return {
    hour: h,
    greeting: { nl: 'Goedenavond', en: 'Good evening', de: 'Guten Abend', ar: 'مساء الخير' },
    suggestion: { nl: 'Tijd voor het avondeten! Wat klinkt lekker? 🍽️', en: 'Dinner time! What sounds good tonight? 🍽️', de: 'Abendessenszeit! Was klingt heute Abend gut? 🍽️', ar: 'وقت العشاء! ماذا تريد الليلة؟ 🍽️' },
    chips: ['🍛 Royal Kitchen', '🍕 Pizza', '🍣 Sushi', '🎲 Verras me', '⚡ Zo snel mogelijk'],
  };
  return {
    hour: h,
    greeting: { nl: 'Hoi nachtbraker', en: 'Hey night owl', de: 'Hey Nachteule', ar: 'مرحبا' },
    suggestion: { nl: 'Laat op de avond honger? Geen probleem! 🌙', en: 'Late night cravings? No problem! 🌙', de: 'Spätabends Hunger? Kein Problem! 🌙', ar: 'جوع في وقت متأخر؟ لا مشكلة! 🌙' },
    chips: ['🍔 Burger', '🍕 Pizza', '🍟 Snacks', '⚡ Zo snel mogelijk'],
  };
}

/* ─── Response data ─── */
interface Message {
  role: "user" | "assistant";
  text: string;
  chips?: string[];
  restaurants?: { name: string; emoji: string; time: string; tag: string; slug: string }[];
}

const R = {
  pizza:    { nl: 'Uitstekende keuze! 🍕 De beste pizza spots:', en: 'Great choice! 🍕 Best pizza spots:', de: 'Ausgezeichnete Wahl! 🍕 Die besten Pizza-Stellen:', ar: 'خيار ممتاز! 🍕 أفضل مطاعم البيتزا:' },
  burger:   { nl: 'Burger time! 🍔 Beste keuze:', en: 'Burger time! 🍔 Best pick:', de: 'Burger-Zeit! 🍔 Beste Wahl:', ar: 'وقت البرغر! 🍔 أفضل اختيار:' },
  sushi:    { nl: 'Sushi — de koninklijke keuze! 🍣', en: 'Sushi — the royal choice! 🍣', de: 'Sushi — die königliche Wahl! 🍣', ar: 'السوشي — الاختيار الملكي! 🍣' },
  fast:     { nl: '⚡ Snelste bezorging nu beschikbaar:', en: '⚡ Fastest delivery available now:', de: '⚡ Schnellste Lieferung jetzt verfügbar:', ar: '⚡ أسرع توصيل متاح الآن:' },
  veg:      { nl: '🥗 Vegetarische & veganistische opties:', en: '🥗 Vegetarian & vegan options:', de: '🥗 Vegetarische & vegane Optionen:', ar: '🥗 خيارات نباتية:' },
  surprise: { nl: "🎲 Joya's aanbeveling van vandaag:", en: "🎲 Joya's pick of the day:", de: '🎲 Joyas Empfehlung des Tages:', ar: '🎲 اختيار جويا اليوم:' },
  chicken:  { nl: '🍗 Beste kip gerechten:', en: '🍗 Best chicken dishes:', de: '🍗 Beste Hühnchengerichte:', ar: '🍗 أفضل أطباق الدجاج:' },
  asian:    { nl: '🥡 Aziatische smaakexplosie:', en: '🥡 Asian flavor explosion:', de: '🥡 Asiatische Geschmacksexplosion:', ar: '🥡 انفجار نكهات آسيوية:' },
  cheap:    { nl: '💸 Beste deals — gratis bezorging:', en: '💸 Best deals — free delivery:', de: '💸 Beste Deals — kostenlose Lieferung:', ar: '💸 أفضل العروض — توصيل مجاني:' },
  drinks:   { nl: '🍷 Drank bestellen — kies je favoriet:', en: '🍷 Order drinks — pick your favourite:', de: '🍷 Getränke bestellen — wähle deinen Favoriten:', ar: '🍷 اطلب المشروبات — اختر المفضلة لديك:' },
  fallback: { nl: 'Ik help je graag snel bestellen! Wat wil je eten? 😊', en: 'Happy to help you order fast! What do you feel like eating? 😊', de: 'Ich helfe dir gerne schnell zu bestellen! Was möchtest du essen? 😊', ar: 'يسعدني مساعدتك في الطلب بسرعة! ماذا تريد أن تأكل؟ 😊' },
  offer:    { nl: '🔥 Aanbiedingen van vandaag — mis ze niet!', en: "🔥 Today's deals — don't miss out!", de: '🔥 Angebote von heute — nicht verpassen!', ar: '🔥 عروض اليوم — لا تفوتها!' },
};

const RESTAURANTS = {
  pizza:    [{ name: 'Pizza Throne', emoji: '🍕', time: '20-30 min', tag: '€0,99 bezorging', slug: 'pizza-throne' }, { name: 'Mama Mia', emoji: '🍝', time: '30-45 min', tag: 'Gratis bezorging', slug: 'mama-mia' }],
  burger:   [{ name: 'Burger Empire', emoji: '🍔', time: '15-25 min', tag: '⚡ Snelste!', slug: 'burger-empire' }],
  sushi:    [{ name: 'Sushi Palace', emoji: '🍱', time: '30-40 min', tag: 'Gratis · ⭐ 4.9', slug: 'sushi-palace' }],
  fast:     [{ name: 'Burger Empire', emoji: '🍔', time: '15-25 min', tag: '⚡ #1 snelste', slug: 'burger-empire' }, { name: 'Pizza Throne', emoji: '🍕', time: '20-30 min', tag: 'Op de voet', slug: 'pizza-throne' }],
  veg:      [{ name: 'Sushi Palace', emoji: '🌿', time: '30-40 min', tag: 'Veel veggie keuzes', slug: 'sushi-palace' }, { name: 'Dragon Wok', emoji: '🥡', time: '25-40 min', tag: 'Tofu & groente', slug: 'dragon-wok' }],
  surprise: [{ name: 'Royal Kitchen', emoji: '🍛', time: '25-35 min', tag: "⭐ 4.8 · Gratis · Chef's keuze", slug: 'royal-kitchen' }, { name: 'Pho Dynasty', emoji: '🍜', time: '25-35 min', tag: '⭐ 4.8 · Verborgen parel', slug: 'pho-dynasty' }],
  chicken:  [{ name: 'Royal Kitchen', emoji: '🍛', time: '25-35 min', tag: 'Legendary Tikka ⭐ 4.8', slug: 'royal-kitchen' }],
  asian:    [{ name: 'Dragon Wok', emoji: '🥡', time: '25-40 min', tag: '€2,00 bezorging', slug: 'dragon-wok' }, { name: 'Pho Dynasty', emoji: '🍜', time: '25-35 min', tag: '⭐ 4.8 · €1,50', slug: 'pho-dynasty' }],
  cheap:    [{ name: 'Royal Kitchen', emoji: '🍛', time: '25-35 min', tag: '✓ Gratis', slug: 'royal-kitchen' }, { name: 'Sushi Palace', emoji: '🍱', time: '30-40 min', tag: '✓ Gratis · ⭐ 4.9', slug: 'sushi-palace' }, { name: 'Mama Mia', emoji: '🍝', time: '30-45 min', tag: '✓ Gratis', slug: 'mama-mia' }],
};

function getResponse(msg: string, lang: Lang): Message {
  const m = msg.toLowerCase();
  if (m.includes('pizza') || m.includes('italiaan') || m.includes('italian') || m.includes('italiano'))
    return { role: 'assistant', text: R.pizza[lang], restaurants: RESTAURANTS.pizza };
  if (m.includes('burger') || m.includes('hamburger'))
    return { role: 'assistant', text: R.burger[lang], restaurants: RESTAURANTS.burger };
  if (m.includes('sushi') || m.includes('japans') || m.includes('japanese') || m.includes('japanisch'))
    return { role: 'assistant', text: R.sushi[lang], restaurants: RESTAURANTS.sushi };
  if (m.includes('snel') || m.includes('haast') || m.includes('quick') || m.includes('fast') || m.includes('schnell') || m.includes('سريع'))
    return { role: 'assistant', text: R.fast[lang], restaurants: RESTAURANTS.fast };
  if (m.includes('vegetar') || m.includes('vegan') || m.includes('groen') || m.includes('plant') || m.includes('نباتي'))
    return { role: 'assistant', text: R.veg[lang], restaurants: RESTAURANTS.veg };
  if (m.includes('verras') || m.includes('weet niet') || m.includes('surprise') || m.includes('random') || m.includes('überrasch') || m.includes('مفاجأة'))
    return { role: 'assistant', text: R.surprise[lang], restaurants: RESTAURANTS.surprise };
  if (m.includes('kip') || m.includes('chicken') || m.includes('hähnchen') || m.includes('دجاج'))
    return { role: 'assistant', text: R.chicken[lang], restaurants: RESTAURANTS.chicken };
  if (m.includes('aziatisch') || m.includes('chinees') || m.includes('wok') || m.includes('asian') || m.includes('asiatisch') || m.includes('آسيوي'))
    return { role: 'assistant', text: R.asian[lang], restaurants: RESTAURANTS.asian };
  if (m.includes('goedkoop') || m.includes('budget') || m.includes('gratis bezorg') || m.includes('cheap') || m.includes('günstig') || m.includes('رخيص'))
    return { role: 'assistant', text: R.cheap[lang], restaurants: RESTAURANTS.cheap };
  if (m.includes('drank') || m.includes('drink') || m.includes('bier') || m.includes('wijn') || m.includes('alcohol') || m.includes('beer') || m.includes('wine') || m.includes('مشروب'))
    return { role: 'assistant', text: R.drinks[lang], chips: ['🍷 Wijn', '🍺 Bier', '🥂 Prosecco', '🥤 Frisdrank'] };
  if (m.includes('aanbieding') || m.includes('offer') || m.includes('deal') || m.includes('korting') || m.includes('angebot') || m.includes('عرض'))
    return { role: 'assistant', text: R.offer[lang], restaurants: RESTAURANTS.cheap, chips: ['30% korting 🏷️', 'Gratis bezorging ✓', '2+1 gratis 🎁'] };
  return { role: 'assistant', text: R.fallback[lang], chips: ['🍕 Pizza', '🍔 Burger', '⚡ Zo snel mogelijk', '🎲 Verras me'] };
}

/* ─── Joya Avatar (call center girl with headset) ─── */
function JoyaAvatar({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="jg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5A31F4"/>
          <stop offset="100%" stopColor="#FF0080"/>
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="20" cy="20" r="20" fill="url(#jg1)"/>
      {/* Hair */}
      <ellipse cx="20" cy="12" rx="8" ry="5.5" fill="#3D2314"/>
      <rect x="12" y="12" width="16" height="6" fill="#3D2314"/>
      {/* Face */}
      <ellipse cx="20" cy="17" rx="6.5" ry="7" fill="#FDDBB4"/>
      {/* Eyes */}
      <circle cx="17.5" cy="16" r="1" fill="#2C1810"/>
      <circle cx="22.5" cy="16" r="1" fill="#2C1810"/>
      {/* Smile */}
      <path d="M17.5 19.5 Q20 21.5 22.5 19.5" stroke="#C47B5A" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Body / uniform */}
      <ellipse cx="20" cy="33" rx="10" ry="8" fill="#4A2DA0"/>
      <rect x="18" y="24" width="4" height="4" fill="#FDDBB4"/>
      {/* Headset arc */}
      <path d="M13 15 Q13 7 20 7 Q27 7 27 15" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      {/* Ear cups */}
      <rect x="10.5" y="13.5" width="4" height="6" rx="2" fill="rgba(255,255,255,0.9)"/>
      <rect x="25.5" y="13.5" width="4" height="6" rx="2" fill="rgba(255,255,255,0.9)"/>
      {/* Mic boom */}
      <path d="M29.5 16.5 Q31 20 28 22" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="27.5" cy="22.5" r="1.2" fill="rgba(255,255,255,0.9)"/>
    </svg>
  );
}

/* ─── Animated waveform ─── */
function WaveformBars({ active }: { active: boolean }) {
  const [heights, setHeights] = useState([4, 4, 4, 4, 4, 4, 4]);
  useEffect(() => {
    if (!active) { setHeights([4, 4, 4, 4, 4, 4, 4]); return; }
    const iv = setInterval(() => {
      setHeights([...Array(7)].map(() => Math.round(4 + Math.random() * 20)));
    }, 130);
    return () => clearInterval(iv);
  }, [active]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2.5, height: 28, padding: '0 4px' }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 3,
          background: active ? `linear-gradient(to top, ${PURPLE}, ${PINK})` : 'rgba(255,255,255,0.25)',
          height: `${h}px`,
          transition: 'height 0.1s ease, background 0.3s',
        }} />
      ))}
    </div>
  );
}

/* ─── Mic icon ─── */
function MicIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : 'rgba(255,255,255,0.7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3"/>
      <path d="M5 10a7 7 0 0 0 14 0"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="8" y1="22" x2="16" y2="22"/>
    </svg>
  );
}

/* ─── ElevenLabs TTS ─── */
async function speakElevenLabs(
  text: string,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  onStart: () => void,
  onEnd: () => void,
) {
  const clean = text.replace(/[\u{1F000}-\u{1FFFF}]/gu, '').replace(/[·•\n]/g, ' ').trim().slice(0, 450);
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: clean }),
    });
    if (!res.ok) { onEnd(); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    if (audioRef.current) { audioRef.current.pause(); URL.revokeObjectURL(audioRef.current.src || ''); }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onplay  = onStart;
    audio.onended = () => { onEnd(); URL.revokeObjectURL(url); };
    audio.onerror = onEnd;
    audio.play().catch(onEnd);
  } catch { onEnd(); }
}

/* ─── Main component ─── */
export function JoyaChatWidget() {
  const tc = getTimeContext();
  const [open, setOpen]           = useState(false);
  const [lang, setLang]           = useState<Lang>('nl');
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking]   = useState(false);
  const [ttsOn, setTtsOn]         = useState(true);
  const [isMobile, setIsMobile]   = useState(false);
  const endRef   = useRef<HTMLDivElement>(null);
  const recRef   = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Detect mobile */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Welcome message */
  useEffect(() => {
    const greeting = tc.greeting[lang];
    setMessages([{
      role: 'assistant',
      text: `${greeting}! Ik ben Joya — jouw persoonlijke eet-concierge. ${tc.suggestion[lang]}`,
      chips: tc.chips,
    }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  /* Speech recognition setup */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = false; rec.interimResults = false;
      rec.lang = lang === 'ar' ? 'ar-SA' : lang === 'de' ? 'de-DE' : lang === 'en' ? 'en-GB' : 'nl-NL';
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
        // Auto-send voice input
        setTimeout(() => handleSendRef.current(transcript), 50);
      };
      rec.onerror = () => setListening(false);
      rec.onend   = () => setListening(false);
      recRef.current = rec;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const handleSendRef = useRef<(override?: string) => void>(() => {});

  const handleSend = useCallback((override?: string) => {
    const msg = (override ?? input).trim();
    if (!msg || loading) return;
    const detected = detectLang(msg);
    if (detected !== lang) setLang(detected);
    setInput('');
    setMessages(p => [...p, { role: 'user', text: msg }]);
    setLoading(true);
    setTimeout(() => {
      const resp = getResponse(msg, detected);
      setMessages(p => [...p, resp]);
      if (ttsOn) {
        speakElevenLabs(resp.text, audioRef, () => setSpeaking(true), () => setSpeaking(false));
      }
      setLoading(false);
    }, 350 + Math.random() * 250);
  }, [input, loading, lang, ttsOn]);

  useEffect(() => { handleSendRef.current = handleSend; }, [handleSend]);

  const toggleVoice = () => {
    if (!recRef.current) return;
    if (listening) { recRef.current.stop(); setListening(false); }
    else { recRef.current.start(); setListening(true); }
  };

  const kd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const placeholder: Record<Lang, string> = {
    nl: 'Wat wil je eten?',
    en: 'What do you want to eat?',
    de: 'Was möchtest du essen?',
    ar: 'ماذا تريد أن تأكل؟',
  };

  const isActive = listening || speaking;

  /* ─── Chat panel content (shared mobile/desktop) ─── */
  const chatPanel = (
    <div style={isMobile ? S.panelMobile : S.panel}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <JoyaAvatar size={38} />
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Joya</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
              AI concierge · {lang.toUpperCase()}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <select value={lang} onChange={e => setLang(e.target.value as Lang)}
            style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, color: 'white', fontSize: 11, padding: '4px 6px', cursor: 'pointer', fontWeight: 700 }}>
            <option value="nl">🇳🇱 NL</option>
            <option value="en">🇬🇧 EN</option>
            <option value="de">🇩🇪 DE</option>
            <option value="ar">🇸🇦 AR</option>
          </select>
          <button onClick={() => setTtsOn(t => !t)} title={ttsOn ? 'Spraak uit' : 'Spraak aan'}
            style={{ ...S.iconBtn, background: ttsOn ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.25)', fontSize: 15 }}>
            {ttsOn ? '🔊' : '🔇'}
          </button>
          <button onClick={() => setOpen(false)} style={S.closeBtn}>✕</button>
        </div>
      </div>

      {/* Messages */}
      <div style={S.msgs} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
              {m.role === 'assistant' && (
                <div style={{ flexShrink: 0 }}><JoyaAvatar size={28} /></div>
              )}
              <div style={m.role === 'user' ? S.uBub : S.aBub}>{m.text}</div>
            </div>

            {m.restaurants && (
              <div style={{ marginTop: 8, marginLeft: lang === 'ar' ? 0 : 36, marginRight: lang === 'ar' ? 36 : 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {m.restaurants.map((r, ri) => (
                  <a key={ri} href={`/menu/${r.slug}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#141428', borderRadius: 12, padding: '9px 12px', border: '1px solid rgba(90,49,244,0.2)', textDecoration: 'none', transition: 'border-color 0.2s, background 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(90,49,244,0.55)'; (e.currentTarget as HTMLAnchorElement).style.background = '#1a1a36'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(90,49,244,0.2)'; (e.currentTarget as HTMLAnchorElement).style.background = '#141428'; }}>
                    <span style={{ fontSize: 26, flexShrink: 0 }}>{r.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: 'white', fontSize: 13 }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🕐 {r.time} · {r.tag}</div>
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: 8, background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>
                      {lang === 'ar' ? 'اطلب' : lang === 'de' ? 'Bestell' : lang === 'en' ? 'Order' : 'Bestel'} →
                    </div>
                  </a>
                ))}
              </div>
            )}

            {m.chips && (
              <div style={{ marginTop: 9, marginLeft: lang === 'ar' ? 0 : 36, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {m.chips.map((c, ci) => (
                  <button key={ci} onClick={() => handleSend(c)}
                    style={{ padding: '6px 13px', borderRadius: 18, border: `1px solid rgba(90,49,244,0.4)`, background: 'rgba(90,49,244,0.1)', color: 'rgba(255,255,255,0.88)', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s', fontFamily: 'inherit' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(90,49,244,0.28)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(90,49,244,0.1)'; }}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 12 }}>
            <div style={{ flexShrink: 0 }}><JoyaAvatar size={28} /></div>
            <div style={{ ...S.aBub, padding: '14px 18px' }}>
              <span style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: PURPLE, display: 'inline-block', animation: `jdot 1.2s ${i * 0.22}s infinite` }} />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input area */}
      <div style={S.inputArea} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <button onClick={toggleVoice} title="Spraak invoer"
          style={{ ...S.iconBtn, ...(listening ? { background: PURPLE, boxShadow: `0 0 14px rgba(90,49,244,0.6)`, border: 'none' } : {}) }}>
          <MicIcon active={listening} />
        </button>
        <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={kd}
          placeholder={listening ? 'Luisteren...' : placeholder[lang]}
          style={{ ...S.input, textAlign: lang === 'ar' ? 'right' : 'left' }}
          disabled={loading} autoComplete="off" />
        <button onClick={() => handleSend()} disabled={loading || !input.trim()}
          style={{ ...S.iconBtn, background: (input.trim() && !loading) ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.06)', border: 'none', opacity: (input.trim() && !loading) ? 1 : 0.5 }}>
          {lang === 'ar' ? '◀' : '➤'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile voice bar (bottom, always visible on mobile when closed) ── */}
      {isMobile && !open && (
        <div
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 300); }}
          style={{
            position: 'fixed', bottom: 66, left: 0, right: 0, zIndex: 9990,
            background: 'rgba(8,8,16,0.97)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: `1px solid rgba(90,49,244,0.35)`,
            padding: '12px 20px 24px',
            display: 'flex', alignItems: 'center', gap: 14,
            cursor: 'pointer',
          }}
        >
          <JoyaAvatar size={46} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 15, marginBottom: 2 }}>Joya AI</div>
            <div style={{ color: 'rgba(255,255,255,0.48)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {listening ? 'Luisteren...' : speaking ? 'Joya spreekt...' : 'Zeg: "Hé Joya, ik wil..."'}
            </div>
          </div>
          <WaveformBars active={isActive} />
          <button
            onClick={e => { e.stopPropagation(); toggleVoice(); }}
            style={{
              width: 50, height: 50, borderRadius: '50%', flexShrink: 0,
              background: listening
                ? `linear-gradient(135deg, ${PURPLE}, ${PINK})`
                : 'rgba(255,255,255,0.08)',
              border: listening ? 'none' : '1px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: listening ? `0 0 20px rgba(90,49,244,0.5)` : 'none',
              transition: 'all 0.2s',
            }}
          >
            <MicIcon active={listening} />
          </button>
        </div>
      )}

      {/* ── Chat panel ── */}
      {open && chatPanel}

      {/* ── Desktop FAB (only on desktop) ── */}
      {!isMobile && !open && (
        <button
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 300); }}
          title="Joya — AI concierge"
          style={S.fab}
        >
          <JoyaAvatar size={32} />
        </button>
      )}

      {!isMobile && open && (
        <button onClick={() => setOpen(false)} style={{ ...S.fab, background: 'rgba(20,20,40,0.95)', border: '1px solid rgba(90,49,244,0.4)', fontSize: 20, color: 'white' }}>
          ✕
        </button>
      )}

      <style>{`
        @keyframes jp   { 0%,100%{box-shadow:0 0 0 0 rgba(90,49,244,.55)} 50%{box-shadow:0 0 0 14px rgba(90,49,244,0)} }
        @keyframes jdot { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      `}</style>
    </>
  );
}

const S: Record<string, React.CSSProperties> = {
  panel: {
    position: 'fixed', bottom: 90, right: 20, zIndex: 9999,
    width: 395, maxHeight: 590, borderRadius: 22, overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    background: '#0A0A12',
    border: '1px solid rgba(90,49,244,0.35)',
    boxShadow: '0 24px 70px rgba(0,0,0,.7), 0 0 60px rgba(90,49,244,.15)',
  },
  panelMobile: {
    position: 'fixed', left: 0, right: 0, bottom: 0, top: '10%',
    zIndex: 9999, borderRadius: '24px 24px 0 0', overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    background: '#0A0A12',
    border: '1px solid rgba(90,49,244,0.35)',
    boxShadow: '0 -16px 60px rgba(0,0,0,.8)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 16px',
    background: `linear-gradient(135deg, ${PURPLE}, #3a1fa0)`,
    borderBottom: '1px solid rgba(255,255,255,.08)', flexShrink: 0,
  },
  closeBtn: {
    background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff',
    width: 30, height: 30, borderRadius: 9, cursor: 'pointer', fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  iconBtn: {
    width: 32, height: 32, borderRadius: 9,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all .2s', color: 'white', fontSize: 14,
  },
  msgs: {
    flex: 1, overflowY: 'auto' as const,
    padding: '16px 14px 8px', display: 'flex', flexDirection: 'column',
  },
  uBub: {
    maxWidth: '76%', padding: '11px 15px',
    borderRadius: '18px 18px 4px 18px',
    background: `linear-gradient(135deg,${PURPLE},${PINK})`,
    color: '#fff', fontSize: 13, lineHeight: '1.55', fontWeight: 500,
  },
  aBub: {
    maxWidth: '76%', padding: '11px 15px',
    borderRadius: '18px 18px 18px 4px',
    background: '#141428', color: 'rgba(255,255,255,.88)',
    fontSize: 13, lineHeight: '1.55',
    border: '1px solid rgba(90,49,244,.18)',
  },
  inputArea: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
    borderTop: '1px solid rgba(255,255,255,.07)',
    background: '#0e0e1e', flexShrink: 0,
  },
  input: {
    flex: 1, background: '#1a1a2e',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 12, padding: '10px 14px',
    color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  },
  fab: {
    position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
    width: 58, height: 58, borderRadius: '50%',
    background: `linear-gradient(135deg,${PURPLE},${PINK},${ORANGE})`,
    border: 'none', cursor: 'pointer',
    boxShadow: '0 8px 28px rgba(90,49,244,.45)',
    animation: 'jp 2.5s infinite',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
};
