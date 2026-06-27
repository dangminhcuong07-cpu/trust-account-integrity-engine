import React from 'react';
import { Scale, ShieldCheck, FileText, Lock, ArrowRight, ChevronRight, ExternalLink } from 'lucide-react';

interface Props {
  onEnterDemo: () => void;
}

const NAVY   = '#1B2A4A';
const GOLD   = '#C8A84B';
const OFFWHITE = '#F7F5F0';
const LCA_URL  = 'https://www.legislation.govt.nz/regulation/public/2008/0183/latest/whole.html';
const NZLS_URL = 'https://www.lawsociety.org.nz/assets/Professional-practice-docs/Rules-and-Guidelines/Trust-Accounting-Guidelines-2024.pdf';

const RULES = [
  { id: 'R01', reg: 'LCA Reg 12(6)(a)',           check: 'Overdrawn client ledger',          url: LCA_URL  },
  { id: 'R02', reg: 'NZLS Guidelines s4.3',        check: 'Dormant balance (>365 days)',       url: NZLS_URL },
  { id: 'R03', reg: 'LCA Reg 12(1)',               check: 'Reconciliation break',              url: LCA_URL  },
  { id: 'R04', reg: 'LCA Reg 11',                  check: 'Unmatched bank statement line',     url: LCA_URL  },
  { id: 'R05', reg: 'LCA Reg 12(1)',               check: 'Unreconciled item ageing',          url: LCA_URL  },
  { id: 'R06', reg: 'NZLS PS-2 (eff. 1 Jan 2026)', check: 'FIT balance overheld',             url: NZLS_URL },
  { id: 'R07', reg: 'LCA Reg 9',                   check: 'Fee without invoice reference',     url: LCA_URL  },
];

const FEATURES = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: '7 Compliance Rules',
    body: 'Checks your trust ledger against the LCA Regulations and NZLS Guidelines — reconciliation, overdrawn accounts, dormant balances, unmatched bank lines, and more.',
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Inspector-Ready Output',
    body: 'Produces a PDF exception report and Statement of Diligence evidence pack — formatted for the NZLS Inspectorate and your TAS monthly certification.',
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'Your Data Stays Local',
    body: 'Runs entirely on your machine. No data is sent to any external service. Evidence strings contain only the record references needed to identify each exception.',
  },
];

export default function LandingPage({ onEnterDemo }: Props) {
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: OFFWHITE, minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#1a1a1a' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section style={{ background: NAVY, color: '#fff' }}>
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">

          {/* Brand mark */}
          <div className="flex items-center gap-3 mb-10">
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 8px', display: 'flex', alignItems: 'center' }}>
              <Scale className="w-5 h-5" style={{ color: GOLD }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: GOLD, letterSpacing: '0.06em', fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Trust Account Integrity Engine
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "'IBM Plex Serif', serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.15, color: '#fff', marginBottom: 20, maxWidth: 700 }}>
            Trust Account Integrity Engine
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.80)', lineHeight: 1.7, maxWidth: 560, marginBottom: 36 }}>
            Automated compliance review for NZ law firms and accounting practices —
            built around the Lawyers and Conveyancers Act (Trust Account) Regulations 2008.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onEnterDemo}
              style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 14, padding: '12px 22px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              View Live Demo <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="/exception_report.pdf"
              style={{ background: 'transparent', color: '#fff', fontWeight: 600, fontSize: 14, padding: '12px 22px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.30)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
            >
              <FileText className="w-4 h-4" /> Download Sample Report (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* ── Feature cards ─────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e8e6e1' }}>
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: OFFWHITE, borderRadius: 12, padding: '24px', border: '1px solid #e8e6e1' }}>
                <div style={{ width: 36, height: 36, background: `${NAVY}18`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: NAVY }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 600, fontSize: 15, color: NAVY, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#5a5a5a', lineHeight: 1.6 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ──────────────────────────────────────────────────── */}
      <section style={{ background: OFFWHITE, borderBottom: '1px solid #e8e6e1' }}>
        <div className="max-w-5xl mx-auto px-6 py-14">
          <h2 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 700, fontSize: 20, color: NAVY, marginBottom: 12 }}>Who it's for</h2>
          <p style={{ fontSize: 14, color: '#5a5a5a', lineHeight: 1.7, maxWidth: 680 }}>
            Designed for Trust Account Supervisors at NZ law firms and accounting practices
            who need a systematic, documented integrity review before filing their monthly and
            quarterly certifications under Regulation 17.
          </p>
        </div>
      </section>

      {/* ── Regulations table ─────────────────────────────────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e8e6e1' }}>
        <div className="max-w-5xl mx-auto px-6 py-14">
          <h2 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 700, fontSize: 20, color: NAVY, marginBottom: 24 }}>The regulations it covers</h2>
          <div style={{ borderRadius: 12, border: '1px solid #e0ddd6', overflow: 'hidden', background: OFFWHITE }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: NAVY }}>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: 11, width: 52 }}>Rule</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: 11 }}>Regulation</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: 11 }}>What it checks</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: 11, width: 80 }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {RULES.map((r, i) => (
                  <tr key={r.id} style={{ borderTop: i > 0 ? '1px solid #e8e6e1' : 'none', background: i % 2 === 0 ? OFFWHITE : '#fff' }}>
                    <td style={{ padding: '10px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600, color: NAVY }}>{r.id}</td>
                    <td style={{ padding: '10px 16px', color: '#5a5a5a' }}>{r.reg}</td>
                    <td style={{ padding: '10px 16px', color: '#2a2a2a' }}>{r.check}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: NAVY, fontWeight: 600, fontSize: 11, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3, borderBottom: `1px solid ${GOLD}` }}
                      >
                        {r.url === NZLS_URL ? 'NZLS' : 'LCA'} <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 28 }}>
            <button
              onClick={onEnterDemo}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: NAVY, fontWeight: 600, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              View the live results against synthetic data <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ background: NAVY, marginTop: 'auto', padding: '32px 0' }}>
        <div className="max-w-5xl mx-auto px-6 space-y-1">
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 560 }}>
            This demo runs against synthetic NZ trust ledger data containing 7 deliberately
            seeded compliance breaches. No real client data is used in this demonstration.
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)' }}>Built for NZ — not generic compliance software.</p>
        </div>
      </footer>

    </div>
  );
}
