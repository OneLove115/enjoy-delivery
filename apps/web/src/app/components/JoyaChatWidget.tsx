"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface Message { role: "user" | "assistant"; text: string; }

export function JoyaChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "👑 Welcome to EnJoy! I'm Joya, your royal food concierge. How can I help?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const rec = new SR(); rec.continuous = false; rec.interimResults = false; rec.lang = navigator.language || "en-US";
      rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
      rec.onerror = () => setListening(false); rec.onend = () => setListening(false);
      recRef.current = rec;
    }
  }, []);

  const toggleVoice = () => {
    if (!recRef.current) return;
    if (listening) { recRef.current.stop(); setListening(false); }
    else { recRef.current.start(); setListening(true); }
  };

  const send = useCallback(async () => {
    if (!input.trim() || loading) return;
    const text = input.trim(); setInput(""); setMessages(p => [...p, { role: "user", text }]); setLoading(true);
    setTimeout(() => {
      const r = ["I'd recommend our Royal Kitchen — legendary Chicken Tikka! 🍛","Great choice! Delivery or pickup? 🚲","Your order is being prepared with royal care! ~25 min 👑","20% off your first order! 🎉","I can search 1000+ partner restaurants for you! 🔍"];
      setMessages(p => [...p, { role: "assistant", text: r[Math.floor(Math.random() * r.length)] }]); setLoading(false);
    }, 800);
  }, [input, loading]);

  const kd = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const S = sty;

  return (
    <>
      {open && (
        <div style={S.panel}>
          <div style={S.header}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={S.avatar}>👑</div>
              <div><div style={{ color: "#fff", fontWeight: 800, fontSize: "16px" }}>Joya</div><div style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>Your Royal Concierge</div></div>
            </div>
            <button onClick={() => setOpen(false)} style={S.closeBtn}>✕</button>
          </div>
          <div style={S.msgs}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "12px" }}>
                <div style={m.role === "user" ? S.uBub : S.aBub}>{m.text}</div>
              </div>
            ))}
            {loading && <div style={{ display: "flex", marginBottom: "12px" }}><div style={S.aBub}>
              <span style={{ color: "#5A31F4" }}>● ● ●</span>
            </div></div>}
            <div ref={endRef} />
          </div>
          <div style={S.inputArea}>
            <button onClick={toggleVoice} style={{ ...S.voiceBtn, ...(listening ? { background: "#5A31F4", boxShadow: "0 0 16px rgba(90,49,244,0.5)" } : {}) }}>🎤</button>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={kd} placeholder={listening ? "Listening…" : "Ask Joya anything…"} style={S.input} disabled={loading} />
            <button onClick={send} disabled={loading || !input.trim()} style={S.sendBtn}>➤</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} style={S.fab}>{open ? "✕" : "👑"}</button>
      <style>{`@keyframes jp{0%,100%{box-shadow:0 0 0 0 rgba(90,49,244,.5)}50%{box-shadow:0 0 0 12px rgba(90,49,244,0)}}`}</style>
    </>
  );
}

const sty: Record<string, React.CSSProperties> = {
  panel: { position: "fixed", bottom: 90, right: 20, zIndex: 9999, width: 380, height: 540, borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", background: "#0A0A0F", border: "1px solid rgba(90,49,244,0.3)", boxShadow: "0 20px 60px rgba(0,0,0,.6), 0 0 40px rgba(90,49,244,.15)" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "linear-gradient(135deg,#5A31F4,#3a1fa0)", borderBottom: "1px solid rgba(255,255,255,.1)" },
  avatar: { width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 },
  closeBtn: { background: "rgba(255,255,255,.15)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 10, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" },
  msgs: { flex: 1, overflowY: "auto" as const, padding: "16px 16px 8px" },
  uBub: { maxWidth: "75%", padding: "12px 16px", borderRadius: "16px 16px 4px 16px", background: "linear-gradient(135deg,#5A31F4,#FF0080)", color: "#fff", fontSize: 14, lineHeight: "1.5" },
  aBub: { maxWidth: "75%", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "#1a1a2e", color: "rgba(255,255,255,.85)", fontSize: 14, lineHeight: "1.5", border: "1px solid rgba(90,49,244,.15)" },
  inputArea: { display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,.06)", background: "#0e0e1a" },
  voiceBtn: { width: 36, height: 36, borderRadius: 12, background: "#1a1a2e", border: "1px solid rgba(90,49,244,.2)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" },
  input: { flex: 1, background: "#1a1a2e", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "10px 16px", color: "#fff", fontSize: 14, outline: "none" },
  sendBtn: { width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg,#5A31F4,#FF0080)", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" },
  fab: { position: "fixed", bottom: 20, right: 20, zIndex: 9999, width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#5A31F4,#FF0080,#FF6B35)", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", boxShadow: "0 8px 24px rgba(90,49,244,.4)", animation: "jp 2s infinite", display: "flex", alignItems: "center", justifyContent: "center" },
};
