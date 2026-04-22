'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  SupportAvatar,
  MessageBubble,
  TypingDots,
  ChatInputBar,
  AMBER,
  ORANGE,
} from '@/components/chat';

/* ─── Types ─── */
type Msg = { role: 'assistant' | 'user'; content: React.ReactNode; raw?: string; timestamp: number };

type Order = {
  id: string;
  restaurantName: string;
  restaurantPhone?: string;
  customerName?: string;
  estimatedMinutes?: number;
  status?: string;
  items?: Array<{ name: string; quantity: number }>;
};

function formatEtaTime(minutesFromNow?: number): string | null {
  if (!minutesFromNow || minutesFromNow <= 0) return null;
  const d = new Date(Date.now() + minutesFromNow * 60 * 1000);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/* ─── Animated choice button ─── */
function ChoiceButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      onClick={onClick}
      whileHover={reduced ? {} : { y: -2, scale: 1.02 }}
      whileTap={reduced ? {} : { scale: 0.96 }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      style={{
        padding: '8px 16px',
        borderRadius: 999,
        background: 'transparent',
        border: `1.5px solid ${AMBER}`,
        color: AMBER,
        fontSize: 13,
        fontWeight: 800,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </motion.button>
  );
}

/* ─── Feedback emoji button ─── */
function FeedbackBtn({ emoji, onClick }: { emoji: string; onClick: () => void }) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      onClick={onClick}
      whileHover={reduced ? {} : { scale: 1.18, y: -3 }}
      whileTap={reduced ? {} : { scale: 0.9 }}
      style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: `1.5px solid ${AMBER}`,
        background: 'transparent',
        fontSize: 22,
        cursor: 'pointer',
        color: '#FFC107',
      }}
      aria-label={`Geef ${emoji} feedback`}
    >
      {emoji}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SupportClient
   Order-support chat with EnJoy Support persona (amber, headset).
   Same motion language as Joya; distinct but related.
══════════════════════════════════════════════════════════════════ */
export default function SupportClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const reduced = useReducedMotion();

  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [stage, setStage] = useState<'intro' | 'answered' | 'done'>('intro');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* Load order */
  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then((d: Order | null) => setOrder(d))
      .catch(() => {});
  }, [id]);

  /* Intro + pre-filled WIMB (once) */
  useEffect(() => {
    if (!order || messages.length) return;
    const name = order.customerName ? `Hallo ${order.customerName}` : 'Hallo';
    const etaTime = formatEtaTime(order.estimatedMinutes);

    const intro: Msg[] = [
      { role: 'assistant', timestamp: Date.now(),
        content: <>Dit gesprek wordt opgenomen en versleuteld voor veiligheidsdoeleinden</> },
      { role: 'assistant', timestamp: Date.now() + 1,
        content: <>{name}, ik ben de virtuele assistent van {order.restaurantName}. Ik kan je helpen met je bestelling of met vragen die je hebt over bestelling bij {order.restaurantName}.</> },
      { role: 'assistant', timestamp: Date.now() + 2, content: <>Waarmee kan ik je helpen?</> },
      { role: 'user', timestamp: Date.now() + 3, raw: 'Waar is mijn bestelling?',
        content: <>Waar is mijn bestelling?</> },
      { role: 'assistant', timestamp: Date.now() + 4,
        content: etaTime ? (
          <>
            Je bestelling bij <strong>{order.restaurantName}</strong> wordt om <strong>{etaTime}</strong> bezorgd.
            <br /><br />
            Als je meer informatie wilt, raden we je aan om {order.restaurantName} te bellen. Zij bezorgen je bestelling.
            {order.restaurantPhone && (
              <><br /><br />Bel <a href={`tel:${order.restaurantPhone}`} style={{ color: AMBER, textDecoration: 'underline', fontWeight: 700 }}>{order.restaurantPhone}</a> of</>
            )}
          </>
        ) : (
          <>Je bestelling bij <strong>{order.restaurantName}</strong> wordt zo snel mogelijk bezorgd.</>
        )
      },
    ];
    setMessages(intro);
    setStage('answered');
  }, [order, messages.length]);

  /* Scroll to bottom on new messages */
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length, stage, isTyping]);

  /* Focus input on mount */
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  /* Escape → go back */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') router.back(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [router]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', raw: text, content: text, timestamp: Date.now() }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant', timestamp: Date.now(),
        content: order?.restaurantPhone
          ? <>Neem a.u.b. contact op met het restaurant op <a href={`tel:${order.restaurantPhone}`} style={{ color: AMBER, fontWeight: 700 }}>{order.restaurantPhone}</a> voor directe hulp.</>
          : <>Bedankt voor je bericht. We kunnen je helaas niet meer informatie geven over de exacte locatie van je bezorger.</>,
      }]);
    }, 900);
  };

  const completeFlow = () => {
    setMessages(prev => [
      ...prev,
      { role: 'user', content: 'Ja, alles is nu in orde', timestamp: Date.now() },
      { role: 'assistant', content: 'Hoe was je ervaring met onze ondersteuning vandaag?', timestamp: Date.now() + 1 },
    ]);
    setStage('done');
  };

  /* ── Amber accent gradient for user bubbles ── */
  const amberGradient = `linear-gradient(135deg, ${AMBER}, ${ORANGE})`;

  return (
    <div
      style={{
        background: 'var(--bg-page, #0A0A0F)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--text-primary, #fff)',
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}
    >
      {/* Amber header */}
      <motion.div
        initial={reduced ? {} : { y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        style={{
          background: `linear-gradient(135deg, ${AMBER}, #d97706)`,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: `0 4px 20px rgba(245,158,11,0.3)`,
          flexShrink: 0,
        }}
      >
        <motion.button
          onClick={() => router.back()}
          aria-label="Terug"
          whileHover={reduced ? {} : { scale: 1.06 }}
          whileTap={reduced ? {} : { scale: 0.92 }}
          style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.15)', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ‹
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SupportAvatar size={34} />
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>
              {order?.restaurantName || 'Support'}
            </h1>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
              EnJoy Support
            </div>
          </div>
        </div>

        <div style={{ width: 40 }} aria-hidden="true" />
      </motion.div>

      {/* Chat list */}
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label="Gesprek met EnJoy Support"
        style={{ flex: 1, overflowY: 'auto', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            const isLast = idx === messages.length - 1;
            return (
              <motion.div
                key={idx}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 340, damping: 28, delay: isUser ? 0 : 0.04 }}
                style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}
              >
                {!isUser && <SupportAvatar size={32} />}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
                  {!isUser && (
                    <div style={{ fontSize: 11, color: `${AMBER}aa`, marginBottom: 4, fontWeight: 600 }}>EnJoy Support</div>
                  )}
                  <MessageBubble
                    role={m.role}
                    isLast={isLast && !isUser}
                    accentGradient={amberGradient}
                    onCopy={m.raw ? () => navigator.clipboard.writeText(m.raw!).catch(() => {}) : undefined}
                  >
                    {m.content}
                  </MessageBubble>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence mode="wait">
          {isTyping && (
            <motion.div
              key="support-typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}
            >
              <SupportAvatar size={32} />
              <TypingDots accent={AMBER} label="EnJoy Support is aan het typen" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA buttons — call + resolution choice */}
        <AnimatePresence>
          {stage === 'answered' && !feedbackGiven && (
            <motion.div
              key="cta-row"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: 40, gap: 10, flexWrap: 'wrap' }}
            >
              {order?.restaurantPhone && (
                <motion.a
                  href={`tel:${order.restaurantPhone}`}
                  whileHover={reduced ? {} : { scale: 1.03, y: -1 }}
                  whileTap={reduced ? {} : { scale: 0.97 }}
                  style={{ display: 'inline-block', background: `linear-gradient(135deg,${AMBER},${ORANGE})`, color: '#fff', padding: '12px 28px', borderRadius: 999, fontSize: 14, fontWeight: 800, textDecoration: 'none', boxShadow: `0 4px 14px rgba(245,158,11,0.4)` }}
                >
                  Bel nu
                </motion.a>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage === 'answered' && (
            <motion.div
              key="choice-buttons"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ padding: '4px 40px 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}
            >
              <ChoiceButton onClick={completeFlow}>Ja, alles is nu in orde</ChoiceButton>
              <ChoiceButton onClick={() => sendMessage('Nee, ik heb nog hulp nodig')}>Nee, terug</ChoiceButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback emojis */}
        <AnimatePresence>
          {stage === 'done' && !feedbackGiven && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '16px 0' }}
              role="group"
              aria-label="Beoordeel je ervaring"
            >
              {(['😀', '🙂', '😐', '🙁', '😞'] as const).map(e => (
                <FeedbackBtn
                  key={e}
                  emoji={e}
                  onClick={() => {
                    setMessages(prev => [...prev, { role: 'user', content: e, timestamp: Date.now() }]);
                    setFeedbackGiven(true);
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      setMessages(prev => [...prev, { role: 'assistant', content: 'Bedankt voor je feedback!', timestamp: Date.now() }]);
                    }, 600);
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <ChatInputBar
        value={input}
        onChange={setInput}
        onSend={() => sendMessage(input)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
        placeholder="Typ een bericht"
        disabled={isTyping}
        isLoading={isTyping}
        accentColor={AMBER}
        accentGradient={amberGradient}
        inputRef={inputRef}
        leadingSlot={
          <button
            type="button"
            aria-label="Bijlage"
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 18, cursor: 'pointer' }}
          >
            📎
          </button>
        }
      />
    </div>
  );
}
