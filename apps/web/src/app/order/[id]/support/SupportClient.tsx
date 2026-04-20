'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

const ORANGE = '#FF6B35';
const TRANSCRIPT_KEY = (id: string) => `enjoy-support-${id}`;

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

export default function SupportClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [stage, setStage] = useState<'intro' | 'answered' | 'done'>('intro');
  const listRef = useRef<HTMLDivElement>(null);

  // Load order
  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then((d: Order | null) => setOrder(d))
      .catch(() => {});
  }, [id]);

  // Intro + pre-filled WIMB (once)
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
            {order.restaurantPhone && <><br /><br />Bel <a href={`tel:${order.restaurantPhone}`} style={{ color: ORANGE, textDecoration: 'underline', fontWeight: 700 }}>{order.restaurantPhone}</a> of</>}
          </>
        ) : (
          <>Je bestelling bij <strong>{order.restaurantName}</strong> wordt zo snel mogelijk bezorgd.</>
        )
      },
    ];
    setMessages(intro);
    setStage('answered');
  }, [order, messages.length]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length, stage]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', raw: text, content: text, timestamp: Date.now() }]);
    setInput('');
    // Auto-reply: point user to restaurant phone if they keep asking
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant', timestamp: Date.now(),
        content: order?.restaurantPhone
          ? <>Neem a.u.b. contact op met het restaurant op <a href={`tel:${order.restaurantPhone}`} style={{ color: ORANGE, fontWeight: 700 }}>{order.restaurantPhone}</a> voor directe hulp.</>
          : <>Bedankt voor je bericht. We kunnen je helaas niet meer informatie geven over de exacte locatie van je bezorger.</>,
      }]);
    }, 600);
  };

  const completeFlow = () => {
    setMessages(prev => [
      ...prev,
      { role: 'user', content: 'Ja, alles is nu in orde', timestamp: Date.now() },
      { role: 'assistant', content: 'Hoe was je ervaring met onze ondersteuning vandaag?', timestamp: Date.now() + 1 },
    ]);
    setStage('done');
  };

  return (
    <div style={{ background: 'var(--bg-page, #0A0A0F)', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--text-primary, #fff)', fontFamily: "'Outfit', system-ui, sans-serif" }}>
      {/* Orange header */}
      <div style={{ background: ORANGE, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => router.back()} aria-label="Terug" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.15)', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>‹</button>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{order?.restaurantName || 'Support'}</h1>
        <div style={{ width: 40 }} />
      </div>

      {/* Chat list */}
      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, idx) => (
          <ChatBubble key={idx} msg={m} />
        ))}

        {/* Inline CTA shown when assistant has answered, before feedback */}
        {stage === 'answered' && !feedbackGiven && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: 40, gap: 10, flexWrap: 'wrap' }}>
            {order?.restaurantPhone && (
              <a href={`tel:${order.restaurantPhone}`} style={{ display: 'inline-block', background: ORANGE, color: '#fff', padding: '12px 28px', borderRadius: 999, fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
                Bel nu
              </a>
            )}
          </div>
        )}

        {stage === 'answered' && (
          <div style={{ padding: '4px 40px 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <ChoiceButton onClick={completeFlow}>Ja, alles is nu in orde</ChoiceButton>
            <ChoiceButton onClick={() => sendMessage('Nee, ik heb nog hulp nodig')}>Nee, terug</ChoiceButton>
          </div>
        )}

        {/* Feedback emojis */}
        {stage === 'done' && !feedbackGiven && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '16px 0' }}>
            {['😀', '🙂', '😐', '🙁', '😞'].map(e => (
              <button
                key={e}
                onClick={() => {
                  setMessages(prev => [...prev, { role: 'user', content: e, timestamp: Date.now() }]);
                  setFeedbackGiven(true);
                  setTimeout(() => {
                    setMessages(prev => [...prev, { role: 'assistant', content: 'Bedankt voor je feedback!', timestamp: Date.now() }]);
                  }, 400);
                }}
                style={{
                  width: 48, height: 48, borderRadius: '50%',
                  border: `1.5px solid ${ORANGE}`, background: 'transparent',
                  fontSize: 22, cursor: 'pointer', color: '#FFC107',
                }}
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderTop: '1px solid var(--border, rgba(255,255,255,0.08))' }}
      >
        <button type="button" aria-label="Bijlage" style={{ width: 36, height: 36, borderRadius: '50%', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 18, cursor: 'pointer' }}>📎</button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Typ een bericht"
          style={{ flex: 1, background: 'transparent', border: '1px solid var(--border, rgba(255,255,255,0.15))', borderRadius: 999, padding: '12px 18px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
        />
      </form>
    </div>
  );
}

function ChatBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
      {!isUser && (
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#fff', flexShrink: 0 }}>💬</div>
      )}
      <div style={{
        maxWidth: '78%',
        padding: '10px 14px',
        borderRadius: 16,
        background: isUser ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)',
        color: '#fff', fontSize: 14, lineHeight: 1.5,
      }}>
        {!isUser && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Assistent</div>}
        {msg.content}
      </div>
    </div>
  );
}

function ChoiceButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px', borderRadius: 999,
        background: 'transparent', border: `1.5px solid ${ORANGE}`,
        color: ORANGE, fontSize: 13, fontWeight: 800,
        cursor: 'pointer', fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}
