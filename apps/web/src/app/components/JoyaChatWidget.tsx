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

/* ─── Joya Avatar ─── */
function JoyaAvatar({ size = 40 }: { size?: number }) {
  return (
    <img
      src="/joya.jpg"
      alt="Joya"
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', flexShrink: 0 }}
    />
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

/* ─── Browser speechSynthesis fallback ─── */
function speakBrowser(text: string, onStart: () => void, onEnd: () => void) {
  const synth = window.speechSynthesis;
  if (!synth) { onEnd(); return; }
  synth.cancel();
  const clean = text.replace(/[\u{1F000}-\u{1FFFF}]/gu, '').replace(/[·•\n]/g, ' ').trim().slice(0, 450);
  const utt = new SpeechSynthesisUtterance(clean);
  utt.lang = 'nl-NL';
  utt.rate = 1.05;
  utt.pitch = 1.05;
  // Pick a female voice if available
  const voices = synth.getVoices();
  const female = voices.find(v => v.lang.startsWith('nl') && /female|woman|vrouw/i.test(v.name))
    ?? voices.find(v => v.lang.startsWith('nl'))
    ?? voices.find(v => v.lang.startsWith('en'));
  if (female) utt.voice = female;
  utt.onstart = onStart;
  utt.onend = onEnd;
  utt.onerror = onEnd;
  synth.speak(utt);
}

/* ─── ElevenLabs TTS (with browser fallback) ─── */
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
    if (!res.ok) { speakBrowser(clean, onStart, onEnd); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    if (audioRef.current) { audioRef.current.pause(); URL.revokeObjectURL(audioRef.current.src || ''); }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onplay  = onStart;
    audio.onended = () => { onEnd(); URL.revokeObjectURL(url); };
    audio.onerror = () => { speakBrowser(clean, onStart, onEnd); };
    audio.play().catch(() => speakBrowser(clean, onStart, onEnd));
  } catch { speakBrowser(clean, onStart, onEnd); }
}

/* ─── Main component ─── */
export function JoyaChatWidget({ triggerOpen = 0 }: { triggerOpen?: number }) {
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
  const [barHidden, setBarHidden] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const endRef             = useRef<HTMLDivElement>(null);
  const recRef             = useRef<any>(null);
  const audioRef           = useRef<HTMLAudioElement | null>(null);
  const inputRef           = useRef<HTMLInputElement>(null);
  const hasSpokenWelcome   = useRef(false);
  const voiceModeRef       = useRef(false);

  /* Keep voiceModeRef in sync */
  useEffect(() => { voiceModeRef.current = voiceMode; }, [voiceMode]);

  /* Detect mobile */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* External trigger — orange button opens Joya */
  useEffect(() => {
    if (triggerOpen > 0) {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerOpen]);

  /* After Joya finishes speaking in voice mode → restart mic */
  const onSpeakEnd = useCallback(() => {
    setSpeaking(false);
    if (voiceModeRef.current && recRef.current) {
      setTimeout(() => {
        try { recRef.current.start(); setListening(true); } catch { /* already running */ }
      }, 600);
    }
  }, []);

  /* Auto-speak welcome message when chat opens for the first time */
  useEffect(() => {
    if (!open) return;
    if (hasSpokenWelcome.current) return;
    hasSpokenWelcome.current = true;
    const t = setTimeout(() => {
      setMessages(current => {
        const welcome = current[0];
        if (welcome && ttsOn) {
          speakElevenLabs(welcome.text, audioRef, () => setSpeaking(true), onSpeakEnd);
        }
        return current;
      });
    }, 600);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* Welcome message + auto-open on first visit */
  useEffect(() => {
    const greeting = tc.greeting[lang];
    setMessages([{
      role: 'assistant',
      text: `${greeting}! Ik ben Joya — jouw persoonlijke eet-concierge. ${tc.suggestion[lang]}`,
      chips: tc.chips,
    }]);
    // Auto-open on first visit (mobile only)
    const hasOpened = localStorage.getItem('joyaOpened');
    if (!hasOpened && window.innerWidth <= 768) {
      const t = setTimeout(() => {
        setOpen(true);
        localStorage.setItem('joyaOpened', '1');
      }, 1800);
      return () => clearTimeout(t);
    }
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

  const handleSend = useCallback(async (override?: string) => {
    const msg = (override ?? input).trim();
    if (!msg || loading) return;
    const detected = detectLang(msg);
    if (detected !== lang) setLang(detected);
    setInput('');
    const userMsg: Message = { role: 'user', text: msg };
    setMessages(p => {
      const next = [...p, userMsg];
      sendToAI(next, detected);
      return next;
    });
    setLoading(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, loading, lang, ttsOn]);

  const sendToAI = useCallback(async (history: Message[], detected: Lang) => {
    try {
      const res = await fetch('/api/joya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (res.ok) {
        const data = await res.json() as { text: string };
        if (data.text) {
          const lastUserMsg = history.filter(m => m.role === 'user').pop()?.text ?? '';
          const fallback = getResponse(lastUserMsg, detected);
          const resp: Message = {
            role: 'assistant',
            text: data.text,
            chips: fallback.chips,
            restaurants: fallback.restaurants,
          };
          setMessages(p => [...p, resp]);
          if (ttsOn) {
            speakElevenLabs(resp.text, audioRef, () => setSpeaking(true), onSpeakEnd);
          }
          setLoading(false);
          return;
        }
      }
    } catch { /* fall through to rule-based */ }
    // Fallback: rule-based response
    const lastMsg = history.filter(m => m.role === 'user').pop()?.text ?? '';
    const resp = getResponse(lastMsg, detected);
    setMessages(p => [...p, resp]);
    if (ttsOn) {
      speakElevenLabs(resp.text, audioRef, () => setSpeaking(true), onSpeakEnd);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ttsOn, onSpeakEnd]);

  useEffect(() => { handleSendRef.current = handleSend; }, [handleSend]);

  const toggleVoice = () => {
    if (!recRef.current) return;
    if (listening) { recRef.current.stop(); setListening(false); }
    else { recRef.current.start(); setListening(true); }
  };

  const enterVoiceMode = () => {
    setVoiceMode(true);
    setOpen(true);
    // Start listening after a short delay so voice mode UI is painted first
    setTimeout(() => {
      if (recRef.current && !listening) {
        try { recRef.current.start(); setListening(true); } catch {}
      }
    }, 700);
  };

  const exitVoiceMode = () => {
    setVoiceMode(false);
    if (audioRef.current) { audioRef.current.pause(); }
    if (recRef.current && listening) { try { recRef.current.stop(); } catch {} }
    setListening(false);
    setSpeaking(false);
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

  /* ─── Voice Mode Panel (speech-to-speech full screen) ─── */
  const lastJoyaMsg = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.text ?? '';
  const lastUserMsg = messages.filter(m => m.role === 'user').slice(-1)[0]?.text ?? '';

  const voicePanel = (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'linear-gradient(180deg, #08081A 0%, #14082E 60%, #0A0A18 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Outfit, sans-serif',
    }}>
      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>
          by En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
        </div>
        <button onClick={exitVoiceMode}
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 700, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
          💬 Chat
        </button>
      </div>

      {/* Avatar with speaking ring */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        {speaking && (
          <>
            <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: `2px solid rgba(90,49,244,0.4)`, animation: 'vring 1.4s ease-out infinite' }} />
            <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: `2px solid rgba(255,0,128,0.3)`, animation: 'vring 1.4s ease-out infinite 0.4s' }} />
          </>
        )}
        {listening && (
          <div style={{ position: 'absolute', inset: -12, borderRadius: '50%', border: `2px solid rgba(255,107,0,0.5)`, animation: 'vring 1s ease-out infinite' }} />
        )}
        <img src="/joya.jpg" alt="Joya"
          style={{ width: 128, height: 128, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', position: 'relative', zIndex: 1, border: `3px solid ${speaking ? PINK : listening ? ORANGE : 'rgba(255,255,255,0.15)'}`, transition: 'border-color 0.3s', boxShadow: speaking ? `0 0 40px rgba(255,0,128,0.4)` : listening ? `0 0 40px rgba(255,107,0,0.4)` : 'none' }} />
      </div>

      {/* Name + status */}
      <div style={{ fontSize: 24, fontWeight: 900, color: 'white', marginBottom: 6 }}>Joya</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 36, letterSpacing: '0.3px',
        color: loading ? 'rgba(255,255,255,0.5)' : speaking ? PINK : listening ? ORANGE : 'rgba(255,255,255,0.35)',
        transition: 'color 0.3s',
      }}>
        {loading ? 'Nadenken…' : speaking ? 'Joya spreekt…' : listening ? 'Luisteren…' : 'Tik om te spreken'}
      </div>

      {/* Waveform */}
      <div style={{ marginBottom: 36 }}>
        <WaveformBars active={isActive} />
      </div>

      {/* Transcript area */}
      <div style={{ minHeight: 72, maxWidth: 320, padding: '0 24px', marginBottom: 48, textAlign: 'center' }}>
        {lastUserMsg && (
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 10, fontStyle: 'italic' }}>
            &ldquo;{lastUserMsg.slice(0, 80)}{lastUserMsg.length > 80 ? '…' : ''}&rdquo;
          </div>
        )}
        {lastJoyaMsg && (
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
            {lastJoyaMsg.slice(0, 140)}{lastJoyaMsg.length > 140 ? '…' : ''}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {/* Mute/unmute mic */}
        <button onClick={toggleVoice} title={listening ? 'Stop' : 'Spreken'}
          style={{
            width: 72, height: 72, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: listening ? `linear-gradient(135deg,${ORANGE},${PINK})` : 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: listening ? `0 0 28px rgba(255,107,0,0.5)` : 'none',
            transition: 'all 0.25s',
          }}>
          <MicIcon active={listening} />
        </button>
        {/* End call */}
        <button onClick={exitVoiceMode} title="Gesprek beëindigen"
          style={{
            width: 64, height: 64, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: '#EF4444',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            boxShadow: '0 6px 20px rgba(239,68,68,0.5)',
          }}>
          📵
        </button>
      </div>

      <style>{`
        @keyframes vring { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(1.6);opacity:0} }
      `}</style>
    </div>
  );

  /* ─── Chat panel content (shared mobile/desktop) ─── */
  const chatPanel = (
    <div style={isMobile ? S.panelMobile : S.panel}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <JoyaAvatar size={38} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Joya</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.5px' }}>
                by En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
              </span>
            </div>
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
          <button onClick={enterVoiceMode} title="Spraak-naar-spraak modus"
            style={{ ...S.iconBtn, background: 'rgba(255,107,0,0.25)', border: `1px solid rgba(255,107,0,0.4)`, fontSize: 15 }}>
            📞
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
      {/* ── Mobile voice bar (bottom, visible on mobile when closed and not dismissed) ── */}
      {isMobile && !open && !barHidden && (
        <div style={{
          position: 'fixed', bottom: 66, left: 0, right: 0, zIndex: 9990,
          background: 'rgba(8,8,16,0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: `1px solid rgba(90,49,244,0.35)`,
          padding: '12px 20px 24px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          {/* Clickable area opens chat */}
          <div
            onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 300); }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0, cursor: 'pointer' }}
          >
            <JoyaAvatar size={46} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 15, marginBottom: 2 }}>Joya AI</div>
              <div style={{ color: 'rgba(255,255,255,0.48)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {listening ? 'Luisteren...' : speaking ? 'Joya spreekt...' : 'Zeg: "Hé Joya, ik wil..."'}
              </div>
            </div>
            <WaveformBars active={isActive} />
          </div>
          {/* Mic button — enters voice mode on mobile */}
          <button
            onClick={e => { e.stopPropagation(); enterVoiceMode(); }}
            style={{
              width: 50, height: 50, borderRadius: '50%', flexShrink: 0,
              background: listening ? `linear-gradient(135deg, ${ORANGE}, ${PINK})` : `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: `0 0 20px rgba(90,49,244,0.5)`,
              transition: 'all 0.2s',
            }}
          >
            <MicIcon active={listening} />
          </button>
          {/* X dismiss button */}
          <button
            onClick={e => { e.stopPropagation(); setBarHidden(true); }}
            style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.5)', fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
          >✕</button>
        </div>
      )}

      {/* ── Voice mode full-screen ── */}
      {voiceMode && voicePanel}

      {/* ── Chat panel (hidden when voice mode active) ── */}
      {open && !voiceMode && chatPanel}

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
    position: 'fixed', left: 0, right: 0, bottom: 0, top: '8%',
    zIndex: 9999, borderRadius: '24px 24px 0 0', overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    background: 'rgba(8, 8, 20, 0.82)',
    backdropFilter: 'blur(32px)',
    WebkitBackdropFilter: 'blur(32px)',
    border: '1px solid rgba(90,49,244,0.35)',
    boxShadow: '0 -16px 60px rgba(0,0,0,.6)',
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
