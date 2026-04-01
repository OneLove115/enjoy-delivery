'use client';
import { useState } from 'react';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

interface Member {
  id: number;
  name: string;
  email: string;
  dept: string;
  budget: number;
  lastOrder: string;
  active: boolean;
}

const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: 'Jan de Vries',     email: 'jan@techcorp.nl',    dept: 'Engineering', budget: 500, lastOrder: '31 mrt', active: true },
  { id: 2, name: 'Lisa Bakker',      email: 'lisa@techcorp.nl',   dept: 'Marketing',   budget: 500, lastOrder: '30 mrt', active: true },
  { id: 3, name: 'Ahmed Hassan',     email: 'ahmed@techcorp.nl',  dept: 'Engineering', budget: 500, lastOrder: '28 mrt', active: true },
  { id: 4, name: 'Sophie Mulder',    email: 'sophie@techcorp.nl', dept: 'Design',      budget: 500, lastOrder: '27 mrt', active: true },
  { id: 5, name: 'Tim van den Berg', email: 'tim@techcorp.nl',    dept: 'Sales',       budget: 500, lastOrder: '25 mrt', active: true },
  { id: 6, name: 'Emma Visser',      email: 'emma@techcorp.nl',   dept: 'HR',          budget: 400, lastOrder: '21 mrt', active: true },
  { id: 7, name: 'Daan Smit',        email: 'daan@techcorp.nl',   dept: 'Finance',     budget: 400, lastOrder: '18 mrt', active: false },
  { id: 8, name: 'Noor Jansen',      email: 'noor@techcorp.nl',   dept: 'Engineering', budget: 500, lastOrder: '14 mrt', active: true },
];

const EMPTY_FORM = { name: '', email: '', dept: '', budget: '' };

const DEPTS = ['Engineering', 'Marketing', 'Design', 'Sales', 'HR', 'Finance', 'Operations', 'Legal'];

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleActive = (id: number) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const removeMember = (id: number) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const addMember = () => {
    setFormError('');
    if (!form.name || !form.email || !form.dept) {
      setFormError('Vul naam, e-mail en afdeling in.');
      return;
    }
    const newMember: Member = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      dept: form.dept,
      budget: Number(form.budget) || 500,
      lastOrder: '—',
      active: true,
    };
    setMembers(prev => [...prev, newMember]);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const active = members.filter(m => m.active);
  const inactive = members.filter(m => !m.active);

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
    padding: '12px 16px', color: 'var(--text-primary)',
    fontSize: 15, fontFamily: 'Outfit, sans-serif', outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
    display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5,
  };

  const MemberRow = ({ m }: { m: Member }) => (
    <tr style={{ borderBottom: '1px solid var(--border)', opacity: m.active ? 1 : 0.5 }}>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: m.active ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 900, color: 'white',
          }}>
            {m.name[0]}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{m.name}</p>
            {!m.active && <span style={{ fontSize: 11, color: ORANGE, fontWeight: 600 }}>Inactief</span>}
          </div>
        </div>
      </td>
      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>{m.email}</td>
      <td style={{ padding: '14px 16px' }}>
        <span style={{
          background: 'rgba(90,49,244,0.1)', color: PURPLE,
          padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
        }}>
          {m.dept}
        </span>
      </td>
      <td style={{ padding: '14px 16px', fontWeight: 700 }}>€{m.budget}/mnd</td>
      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>{m.lastOrder}</td>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Active toggle */}
          <button
            onClick={() => toggleActive(m.id)}
            title={m.active ? 'Deactiveren' : 'Activeren'}
            style={{
              width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
              background: m.active ? `linear-gradient(90deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.1)',
              position: 'relative', transition: 'background 0.2s', flexShrink: 0,
            }}
          >
            <span style={{
              position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%',
              background: 'white', transition: 'left 0.2s',
              left: m.active ? 21 : 3,
            }} />
          </button>
          {/* Remove */}
          <button
            onClick={() => removeMember(m.id)}
            title="Verwijderen"
            style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#ef4444', borderRadius: 8, padding: '5px 10px',
              cursor: 'pointer', fontSize: 12, fontWeight: 700,
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 1050, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 950, letterSpacing: -0.5, margin: '0 0 6px' }}>
            Team
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            {active.length} actieve medewerkers · {members.length} totaal
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: `linear-gradient(135deg,${PURPLE},${PINK})`,
            color: 'white', border: 'none', borderRadius: 12,
            padding: '12px 20px', cursor: 'pointer',
            fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
            boxShadow: `0 4px 14px ${PURPLE}35`,
          }}
        >
          + Medewerker toevoegen
        </button>
      </div>

      {/* Add member form */}
      {showForm && (
        <div style={{
          background: 'var(--bg-card)', border: `1px solid ${PURPLE}30`,
          borderRadius: 20, padding: 'clamp(20px,3vw,28px)', marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Nieuwe medewerker</h2>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 22 }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
            <div>
              <label style={labelStyle}>Naam *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Volledige naam" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>E-mail *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="naam@techcorp.nl" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Afdeling *</label>
              <select value={form.dept} onChange={e => set('dept', e.target.value)} style={{ ...inputStyle, appearance: 'none' as any }}>
                <option value="">Selecteer afdeling</option>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Maandbudget (€)</label>
              <input type="number" value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="500" style={inputStyle} />
            </div>
          </div>
          {formError && <p style={{ color: '#ef4444', fontSize: 13, fontWeight: 600, marginTop: 10 }}>{formError}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button
              onClick={addMember}
              style={{
                background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                color: 'white', border: 'none', borderRadius: 10,
                padding: '12px 22px', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
              }}
            >
              Toevoegen
            </button>
            <button
              onClick={() => { setForm(EMPTY_FORM); setShowForm(false); setFormError(''); }}
              style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', borderRadius: 10,
                padding: '12px 16px', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
              }}
            >
              Annuleren
            </button>
          </div>
        </div>
      )}

      {/* Members table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Naam', 'E-mail', 'Afdeling', 'Budget', 'Laatste bestelling', 'Actie'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {active.map(m => <MemberRow key={m.id} m={m} />)}
              {inactive.length > 0 && (
                <>
                  <tr>
                    <td colSpan={6} style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.02)' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        Inactief ({inactive.length})
                      </span>
                    </td>
                  </tr>
                  {inactive.map(m => <MemberRow key={m.id} m={m} />)}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
