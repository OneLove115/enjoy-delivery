'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

interface Invoice {
  id: string;
  period: string;
  amount: number;
  status: string;
  date: string;
  downloadUrl?: string;
}

function InvoiceTableSkeleton() {
  return (
    <div style={{ padding: 0 }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {/* Header row */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 24 }}>
        {[60, 70, 80, 60, 50, 50, 70].map((w, j) => (
          <div key={j} style={{ height: 12, width: w, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
        ))}
      </div>
      {[0,1,2,3].map(i => (
        <div key={i} style={{ padding: '18px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 24, alignItems: 'center' }}>
          {[60, 80, 80, 70, 60].map((w, j) => (
            <div key={j} style={{ height: 14, width: w, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          ))}
          <div style={{ height: 28, width: 50, borderRadius: 8, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          <div style={{ height: 32, width: 80, borderRadius: 10, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
        </div>
      ))}
    </div>
  );
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState<string | null>(null);
  const [paid, setPaid] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('enjoy-business-token');
    if (!token) {
      router.replace('/business-portal');
      return;
    }

    fetch(`${API_URL}/api/business-portal/invoices`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 401) {
          localStorage.removeItem('enjoy-business-token');
          router.replace('/business-portal');
          return;
        }
        if (!res.ok) throw new Error('Fout bij ophalen facturen');
        return res.json();
      })
      .then(json => {
        if (json) setInvoices(json.invoices ?? []);
      })
      .catch(err => setError(err.message || 'Netwerkfout'))
      .finally(() => setLoading(false));
  }, [router]);

  const handlePay = async (id: string) => {
    setPaying(id);
    await new Promise(r => setTimeout(r, 900));
    setPaid(prev => [...prev, id]);
    setPaying(null);
  };

  const totalPaid = invoices
    .filter(inv => inv.status === 'Betaald' || paid.includes(inv.id))
    .reduce((s, inv) => s + Number(inv.amount), 0);

  const openAmount = invoices
    .filter(inv => inv.status !== 'Betaald' && !paid.includes(inv.id))
    .reduce((s, inv) => s + Number(inv.amount), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 900, margin: '0 auto' }}
    >

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 950, letterSpacing: -0.5, margin: '0 0 6px' }}>
          Facturen
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          Beheer en download je maandelijkse facturen
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
        <div style={{
          background: openAmount > 0 ? `rgba(255,107,0,0.08)` : 'var(--bg-card)',
          border: `1px solid ${openAmount > 0 ? ORANGE + '40' : 'var(--border)'}`,
          borderRadius: 16, padding: '20px 22px',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Openstaand</p>
          <p style={{ fontSize: 28, fontWeight: 950, margin: 0, color: openAmount > 0 ? ORANGE : '#22c55e' }}>
            €{openAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Betaald dit jaar</p>
          <p style={{ fontSize: 28, fontWeight: 950, margin: 0, color: '#22c55e' }}>
            €{totalPaid.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Aantal facturen</p>
          <p style={{ fontSize: 28, fontWeight: 950, margin: 0, color: PURPLE }}>{invoices.length}</p>
        </div>
      </div>

      {/* Invoice list */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Factuuroverzicht</h2>
        </div>

        {loading ? (
          <InvoiceTableSkeleton />
        ) : error ? (
          <div style={{ padding: '24px', color: '#ef4444', fontWeight: 600 }}>{error}</div>
        ) : invoices.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Nog geen facturen</p>
            <p style={{ fontSize: 14 }}>Facturen worden automatisch aangemaakt op de eerste van de maand.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Factuurnr', 'Periode', 'Datum', 'Bedrag', 'Status', 'Download', 'Actie'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, i) => {
                    const isPaid = inv.status === 'Betaald' || paid.includes(inv.id);
                    const isPayingNow = paying === inv.id;
                    return (
                      <tr key={inv.id} style={{ borderBottom: i < invoices.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <td style={{ padding: '18px 16px', fontWeight: 700, color: PURPLE }}>{inv.id}</td>
                        <td style={{ padding: '18px 16px', fontWeight: 600 }}>{inv.period}</td>
                        <td style={{ padding: '18px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{inv.date}</td>
                        <td style={{ padding: '18px 16px', fontWeight: 800, fontSize: 15 }}>
                          €{Number(inv.amount).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '18px 16px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                            background: isPaid ? 'rgba(34,197,94,0.12)' : 'rgba(255,107,0,0.12)',
                            color: isPaid ? '#22c55e' : ORANGE,
                          }}>
                            {isPaid ? 'Betaald' : 'Open'}
                          </span>
                        </td>
                        <td style={{ padding: '18px 16px' }}>
                          <button
                            style={{
                              background: 'transparent', border: `1px solid ${PURPLE}40`,
                              color: PURPLE, borderRadius: 8, padding: '6px 12px',
                              cursor: 'pointer', fontSize: 12, fontWeight: 700,
                              fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 6,
                            }}
                            onClick={() => {
                              if (inv.downloadUrl) window.open(inv.downloadUrl, '_blank');
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                              <polyline points="7,10 12,15 17,10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            PDF
                          </button>
                        </td>
                        <td style={{ padding: '18px 16px' }}>
                          {!isPaid ? (
                            <button
                              onClick={() => handlePay(inv.id)}
                              disabled={isPayingNow}
                              style={{
                                background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                                color: 'white', border: 'none', borderRadius: 10,
                                padding: '8px 16px', cursor: isPayingNow ? 'not-allowed' : 'pointer',
                                fontSize: 13, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                                opacity: isPayingNow ? 0.7 : 1,
                                boxShadow: `0 4px 14px ${PURPLE}35`,
                              }}
                            >
                              {isPayingNow ? 'Bezig…' : 'Betaal nu'}
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px', borderTop: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex', justifyContent: 'flex-end',
            }}>
              <span style={{ fontWeight: 900, fontSize: 15 }}>
                Totaal betaald YTD:&nbsp;
                <span style={{ color: '#22c55e' }}>
                  €{totalPaid.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                </span>
              </span>
            </div>
          </>
        )}
      </div>

      {/* Info box */}
      <div style={{
        marginTop: 20, padding: '16px 20px',
        background: 'rgba(90,49,244,0.06)', border: `1px solid ${PURPLE}25`,
        borderRadius: 14, display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
          Facturen worden automatisch aangemaakt op de eerste van de maand. Betalingstermijn is 14 dagen.
          Bij vragen over je factuur, neem contact op via <strong>billing@enjoy.nl</strong>.
        </p>
      </div>
    </motion.div>
  );
}
