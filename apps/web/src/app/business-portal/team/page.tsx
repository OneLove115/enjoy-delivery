'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

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

const DEPT_COLORS: Record<string, string> = {
  Engineering: PURPLE,
  Marketing: PINK,
  Design: '#a855f7',
  Sales: ORANGE,
  HR: '#22c55e',
  Finance: '#3b82f6',
  Operations: '#f59e0b',
  Legal: '#64748b',
};

function getDeptColor(dept: string): string {
  return DEPT_COLORS[dept] ?? PURPLE;
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function MemberCardsSkeleton() {
  return (
    <div style={{ padding: '24px' }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {[0,1,2,3].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          <div style={{ flex: 1, display: 'flex', gap: 24 }}>
            {[100, 140, 70, 60, 80].map((w, j) => (
              <div key={j} style={{ height: 13, width: w, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
            ))}
          </div>
          <div style={{ width: 44, height: 24, borderRadius: 12, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
        </div>
      ))}
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

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function TeamPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

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
        setMembers(prev => prev.map(x => String(x.id) === String(m.id)
          ? { ...x, isActive: !newActive, active: !newActive }
          : x
        ));
      }
    } catch {
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

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${focusedField === field ? PURPLE + '55' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)',
    fontSize: 15, fontFamily: 'Outfit, sans-serif', outline: 'none',
    boxSizing: 'border-box',
    boxShadow: focusedField === field ? `0 0 0 3px ${PURPLE}18` : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  });

  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
    display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8,
  };

  const MemberRow = ({ m, index }: { m: Member; index: number }) => {
    const isActive = isMemberActive(m);
    const dept = getMemberDept(m);
    const budget = getMemberBudget(m);
    const deptColor = getDeptColor(dept);
    const initials = getInitials(m.name);
    const rowId = String(m.id);
    const isHovered = hoveredRow === rowId;

    return (
      <motion.tr
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        onMouseEnter={() => setHoveredRow(rowId)}
        onMouseLeave={() => setHoveredRow(null)}
        style={{
          borderBottom: '1px solid var(--border)',
          opacity: isActive ? 1 : 0.55,
          background: isHovered ? 'rgba(255,255,255,0.025)' : 'transparent',
          transition: 'background 0.15s, opacity 0.2s',
        }}
      >
        <td style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: isActive
                ? `linear-gradient(135deg,${PURPLE},${PINK})`
                : 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 900, color: 'white',
              boxShadow: isActive ? `0 4px 12px ${PURPLE}35` : 'none',
            }}>
              {initials}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{m.name}</p>
              {!isActive && (
                <span style={{ fontSize: 11, color: ORANGE, fontWeight: 600 }}>
                  ● Inactief
                </span>
              )}
            </div>
          </div>
        </td>
        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>{m.email}</td>
        <td style={{ padding: '14px 16px' }}>
          <span style={{
            background: `${deptColor}14`, color: deptColor,
            padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
            border: `1px solid ${deptColor}25`,
          }}>
            {dept}
          </span>
        </td>
        <td style={{ padding: '14px 16px', fontWeight: 700 }}>€{budget}/mnd</td>
        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>
          {m.lastOrder ?? '—'}
        </td>
        <td style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <motion.button
              onClick={() => toggleActive(m)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              title={isActive ? 'Deactiveren' : 'Activeren'}
              style={{
                width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                background: isActive ? `linear-gradient(90deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.12)',
                position: 'relative', transition: 'background 0.25s', flexShrink: 0,
                boxShadow: isActive ? `0 2px 8px ${PURPLE}35` : 'none',
              }}
            >
              <motion.span
                animate={{ left: isActive ? 22 : 4 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: 4, width: 16, height: 16, borderRadius: '50%',
                  background: 'white', display: 'block',
                }}
              />
            </motion.button>
          </div>
        </td>
      </motion.tr>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 1050, margin: '0 auto' }}
    >

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}
      >
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700,
            color: PINK, background: `${PINK}15`, padding: '4px 12px', borderRadius: 20,
            marginBottom: 12, border: `1px solid ${PINK}25`,
          }}>
            👥 Team
          </div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 950, letterSpacing: -1, margin: '0 0 6px' }}>
            Team
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            {active.length} actieve medewerkers
            <span style={{ color: 'var(--border)', margin: '0 6px' }}>·</span>
            {members.length} totaal
          </p>
        </div>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: showForm ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg,${PURPLE},${PINK})`,
            color: showForm ? 'var(--text-secondary)' : 'white',
            border: showForm ? '1px solid var(--border)' : 'none',
            borderRadius: 12, padding: '12px 20px', cursor: 'pointer',
            fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
            boxShadow: showForm ? 'none' : `0 4px 16px ${PURPLE}35`,
            transition: 'all 0.2s',
          }}
        >
          {showForm ? '✕ Sluiten' : '+ Medewerker toevoegen'}
        </motion.button>
      </motion.div>

      {/* Department overview chips */}
      {!loading && members.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}
        >
          {Array.from(new Set(members.map(getMemberDept))).map(dept => {
            const count = members.filter(m => getMemberDept(m) === dept).length;
            const color = getDeptColor(dept);
            return (
              <span
                key={dept}
                style={{
                  fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 20,
                  background: `${color}14`, color, border: `1px solid ${color}25`,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {dept}
                <span style={{
                  width: 18, height: 18, borderRadius: '50%', background: `${color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900,
                }}>
                  {count}
                </span>
              </span>
            );
          })}
        </motion.div>
      )}

      {/* Add member form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            style={{
              background: 'var(--bg-card)', border: `1px solid ${PURPLE}28`,
              borderRadius: 20, padding: 'clamp(20px,3vw,28px)', marginBottom: 24,
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: `${PURPLE}15`, border: `1px solid ${PURPLE}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>
                  👤
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Nieuwe medewerker</h2>
              </div>
              <motion.button
                onClick={() => setShowForm(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 20, lineHeight: 1, padding: 4 }}
              >
                ✕
              </motion.button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
              <div>
                <label style={labelStyle}>Naam *</label>
                <input
                  value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Volledige naam"
                  style={inputStyle('name')}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              <div>
                <label style={labelStyle}>E-mail *</label>
                <input
                  type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="naam@bedrijf.nl"
                  style={inputStyle('email')}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              <div>
                <label style={labelStyle}>Afdeling *</label>
                <select
                  value={form.dept} onChange={e => set('dept', e.target.value)}
                  style={{ ...inputStyle('dept'), appearance: 'none' as any }}
                  onFocus={() => setFocusedField('dept')}
                  onBlur={() => setFocusedField(null)}
                >
                  <option value="">Selecteer afdeling</option>
                  {DEPTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Maandbudget (€)</label>
                <input
                  type="number" value={form.budget} onChange={e => set('budget', e.target.value)}
                  placeholder="500"
                  style={inputStyle('budget')}
                  onFocus={() => setFocusedField('budget')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>
            <AnimatePresence>
              {formError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  style={{ color: '#ef4444', fontSize: 13, fontWeight: 600, marginTop: 12 }}
                >
                  {formError}
                </motion.p>
              )}
            </AnimatePresence>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <motion.button
                onClick={addMember}
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.04 }}
                whileTap={{ scale: submitting ? 1 : 0.97 }}
                style={{
                  background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                  color: 'white', border: 'none', borderRadius: 12,
                  padding: '12px 24px', cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                  opacity: submitting ? 0.7 : 1,
                  boxShadow: `0 4px 14px ${PURPLE}35`,
                  transition: 'opacity 0.2s',
                }}
              >
                {submitting ? 'Toevoegen…' : '+ Toevoegen'}
              </motion.button>
              <motion.button
                onClick={() => { setForm(EMPTY_FORM); setShowForm(false); setFormError(''); }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', borderRadius: 12,
                  padding: '12px 18px', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
                }}
              >
                Annuleren
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Members table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
        {loading ? (
          <MemberCardsSkeleton />
        ) : error ? (
          <div style={{ padding: '24px', color: '#ef4444', fontWeight: 600 }}>{error}</div>
        ) : members.length === 0 ? (
          <div style={{ padding: '56px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>👤</div>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Nog geen teamleden</p>
            <p style={{ fontSize: 14 }}>Voeg je eerste medewerker toe via de knop hierboven.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  {['Naam', 'E-mail', 'Afdeling', 'Budget', 'Laatste bestelling', 'Actie'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {active.map((m, i) => <MemberRow key={String(m.id)} m={m} index={i} />)}
                {inactive.length > 0 && (
                  <>
                    <tr>
                      <td colSpan={6} style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.015)' }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.2 }}>
                          Inactief ({inactive.length})
                        </span>
                      </td>
                    </tr>
                    {inactive.map((m, i) => <MemberRow key={String(m.id)} m={m} index={active.length + i + 1} />)}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
