'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

interface Member {
  id: string | number;
  name: string;
  email: string;
  dept?: string;
  department?: string;
  budget?: number;
  monthlyBudget?: number;
  lastOrder?: string;
  isActive?: boolean;
  active?: boolean;
}

const EMPTY_FORM = { name: '', email: '', dept: '', budget: '' };
const DEPTS = ['Engineering', 'Marketing', 'Design', 'Sales', 'HR', 'Finance', 'Operations', 'Legal'];

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        border: `3px solid rgba(90,49,244,0.15)`,
        borderTopColor: PURPLE,
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function isMemberActive(m: Member): boolean {
  if (typeof m.isActive === 'boolean') return m.isActive;
  if (typeof m.active === 'boolean') return m.active;
  return true;
}

function getMemberBudget(m: Member): number {
  return Number(m.monthlyBudget ?? m.budget ?? 0);
}

function getMemberDept(m: Member): string {
  return m.dept ?? m.department ?? '—';
}

export default function TeamPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const fetchMembers = useCallback(() => {
    const token = localStorage.getItem('enjoy-business-token');
    if (!token) {
      router.replace('/business-portal');
      return;
    }

    fetch(`${API_URL}/api/business-portal/team`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 401) {
          localStorage.removeItem('enjoy-business-token');
          router.replace('/business-portal');
          return;
        }
        if (!res.ok) throw new Error('Fout bij ophalen teamleden');
        return res.json();
      })
      .then(json => {
        if (json) setMembers(json.members ?? []);
      })
      .catch(err => setError(err.message || 'Netwerkfout'))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const toggleActive = async (m: Member) => {
    const token = localStorage.getItem('enjoy-business-token');
    const newActive = !isMemberActive(m);
    // Optimistic update
    setMembers(prev => prev.map(x => String(x.id) === String(m.id)
      ? { ...x, isActive: newActive, active: newActive }
      : x
    ));
    try {
      const res = await fetch(`${API_URL}/api/business-portal/team`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: m.id, isActive: newActive }),
      });
      if (!res.ok) {
        // Revert on failure
        setMembers(prev => prev.map(x => String(x.id) === String(m.id)
          ? { ...x, isActive: !newActive, active: !newActive }
          : x
        ));
      }
    } catch {
      // Revert on network error
      setMembers(prev => prev.map(x => String(x.id) === String(m.id)
        ? { ...x, isActive: !newActive, active: !newActive }
        : x
      ));
    }
  };

  const addMember = async () => {
    setFormError('');
    if (!form.name || !form.email || !form.dept) {
      setFormError('Vul naam, e-mail en afdeling in.');
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem('enjoy-business-token');
    try {
      const res = await fetch(`${API_URL}/api/business-portal/team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          department: form.dept,
          monthlyBudget: Number(form.budget) || 500,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || 'Toevoegen mislukt');
      }
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchMembers();
    } catch (err: any) {
      setFormError(err.message || 'Medewerker toevoegen mislukt');
    } finally {
      setSubmitting(false);
    }
  };

  const active = members.filter(isMemberActive);
  const inactive = members.filter(m => !isMemberActive(m));

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

  const MemberRow = ({ m }: { m: Member }) => {
    const isActive = isMemberActive(m);
    return (
      <tr style={{ borderBottom: '1px solid var(--border)', opacity: isActive ? 1 : 0.5 }}>
        <td style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: isActive ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 900, color: 'white',
            }}>
              {m.name[0]}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{m.name}</p>
              {!isActive && <span style={{ fontSize: 11, color: ORANGE, fontWeight: 600 }}>Inactief</span>}
            </div>
          </div>
        </td>
        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>{m.email}</td>
        <td style={{ padding: '14px 16px' }}>
          <span style={{
            background: 'rgba(90,49,244,0.1)', color: PURPLE,
            padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
          }}>
            {getMemberDept(m)}
          </span>
        </td>
        <td style={{ padding: '14px 16px', fontWeight: 700 }}>€{getMemberBudget(m)}/mnd</td>
        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>
          {m.lastOrder ?? '—'}
        </td>
        <td style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Active toggle */}
            <button
              onClick={() => toggleActive(m)}
              title={isActive ? 'Deactiveren' : 'Activeren'}
              style={{
                width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                background: isActive ? `linear-gradient(90deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.1)',
                position: 'relative', transition: 'background 0.2s', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%',
                background: 'white', transition: 'left 0.2s',
                left: isActive ? 21 : 3,
              }} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

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
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="naam@bedrijf.nl" style={inputStyle} />
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
              disabled={submitting}
              style={{
                background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                color: 'white', border: 'none', borderRadius: 10,
                padding: '12px 22px', cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Toevoegen…' : 'Toevoegen'}
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
        {loading ? (
          <Spinner />
        ) : error ? (
          <div style={{ padding: '24px', color: '#ef4444', fontWeight: 600 }}>{error}</div>
        ) : members.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Nog geen teamleden</p>
            <p style={{ fontSize: 14 }}>Voeg je eerste medewerker toe via de knop hierboven.</p>
          </div>
        ) : (
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
                {active.map(m => <MemberRow key={String(m.id)} m={m} />)}
                {inactive.length > 0 && (
                  <>
                    <tr>
                      <td colSpan={6} style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.02)' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                          Inactief ({inactive.length})
                        </span>
                      </td>
                    </tr>
                    {inactive.map(m => <MemberRow key={String(m.id)} m={m} />)}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
