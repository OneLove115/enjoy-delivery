'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, type DeliveryTime } from '@/store/cart';

const ORANGE = '#FF6B35';

/** Generate 5-minute slots from now + 20m (prep buffer) up to end-of-day. */
function generateSlots(): Array<{ iso: string; label: string }> {
  const slots: Array<{ iso: string; label: string }> = [];
  const now = new Date();
  // Start from next 5-minute mark + 20m prep buffer
  const start = new Date(now);
  start.setMinutes(start.getMinutes() + 20);
  start.setMinutes(Math.ceil(start.getMinutes() / 5) * 5, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 55, 0, 0);

  for (let t = new Date(start); t <= endOfDay; t = new Date(t.getTime() + 5 * 60 * 1000)) {
    const hh = String(t.getHours()).padStart(2, '0');
    const mm = String(t.getMinutes()).padStart(2, '0');
    slots.push({ iso: t.toISOString(), label: `${hh}:${mm}` });
  }
  return slots;
}

export default function DeliveryTimeClient() {
  const router = useRouter();
  const { deliveryTime, setDeliveryTime } = useCartStore();

  const [mode, setMode] = useState<'asap' | 'scheduled'>(deliveryTime.kind);
  const [selectedIso, setSelectedIso] = useState<string | null>(
    deliveryTime.kind === 'scheduled' ? deliveryTime.isoTime : null
  );

  const slots = useMemo(() => generateSlots(), []);

  const onDone = () => {
    const next: DeliveryTime =
      mode === 'scheduled' && selectedIso
        ? { kind: 'scheduled', isoTime: selectedIso }
        : { kind: 'asap' };
    setDeliveryTime(next);
    router.back();
  };

  const canConfirm = mode === 'asap' || (mode === 'scheduled' && !!selectedIso);

  return (
    <div style={{ background: 'var(--bg-page, #0A0A0F)', minHeight: '100vh', color: 'var(--text-primary, #fff)', fontFamily: "'Outfit', system-ui, sans-serif", paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px' }}>
        <button onClick={() => router.back()} aria-label="Terug" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}>‹</button>
        <div style={{ width: 38 }} />
        <div style={{ width: 38 }} />
      </div>

      <h1 style={{ padding: '4px 20px 20px', fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em' }}>Wanneer?</h1>

      {/* Nu / Plan radios */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        <RadioRow
          label="Nu"
          checked={mode === 'asap'}
          onClick={() => { setMode('asap'); setSelectedIso(null); }}
        />
        <RadioRow
          label="Plan een ander moment"
          checked={mode === 'scheduled'}
          onClick={() => setMode('scheduled')}
        />
      </div>

      {/* Time slots (only visible when scheduled) */}
      {mode === 'scheduled' && (
        <div style={{ padding: '12px 20px' }}>
          {/* Vandaag chip */}
          <div style={{ marginBottom: 14 }}>
            <span style={{ display: 'inline-block', padding: '8px 18px', borderRadius: 999, background: '#fff', color: '#0A0A0F', fontSize: 14, fontWeight: 800 }}>
              Vandaag
            </span>
          </div>

          {slots.length === 0 ? (
            <p style={{ color: 'var(--text-muted, rgba(255,255,255,0.5))', fontSize: 14 }}>
              Geen beschikbare tijdsloten meer vandaag.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {slots.map(s => (
                <SlotRow
                  key={s.iso}
                  label={s.label}
                  selected={selectedIso === s.iso}
                  onClick={() => setSelectedIso(s.iso)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gedaan CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--bg-page, #0A0A0F)', borderTop: '1px solid var(--border, rgba(255,255,255,0.06))', padding: '14px 20px 22px' }}>
        <button
          onClick={onDone}
          disabled={!canConfirm}
          style={{
            width: '100%', padding: '16px 20px',
            background: canConfirm ? ORANGE : 'rgba(255,255,255,0.12)',
            color: '#fff', border: 'none', borderRadius: 999,
            fontSize: 16, fontWeight: 800,
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            boxShadow: canConfirm ? '0 6px 18px rgba(255,107,53,0.28)' : 'none',
          }}
        >
          Gedaan
        </button>
      </div>
    </div>
  );
}

function RadioRow({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 4px',
        background: 'transparent', border: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        color: '#fff', fontSize: 16, fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        width: '100%', textAlign: 'left',
      }}
    >
      <span>{label}</span>
      <span style={{
        width: 22, height: 22, borderRadius: '50%',
        border: checked ? 'none' : '2px solid rgba(255,255,255,0.3)',
        background: checked ? ORANGE : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {checked && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
      </span>
    </button>
  );
}

function SlotRow({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 18px',
        background: 'transparent',
        border: `${selected ? 1.5 : 1}px solid ${selected ? '#fff' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 16,
        color: '#fff', fontSize: 15, fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        width: '100%', textAlign: 'left',
      }}
    >
      <span>{label}</span>
      <span style={{
        width: 22, height: 22, borderRadius: '50%',
        border: selected ? 'none' : '2px solid rgba(255,255,255,0.3)',
        background: selected ? ORANGE : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {selected && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
      </span>
    </button>
  );
}
