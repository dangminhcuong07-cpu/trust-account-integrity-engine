import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Props {
  onEnterDemo: () => void;
}

const LCA_URL  = 'https://www.legislation.govt.nz/regulation/public/2008/0183/latest/whole.html';
const NZLS_URL = 'https://www.lawsociety.org.nz/assets/Professional-practice-docs/Rules-and-Guidelines/Trust-Accounting-Guidelines-2024.pdf';

function isNzls(citation: string): boolean {
  return citation.startsWith('NZLS') || citation.includes('PS-2') || citation.includes('Guidelines');
}

const RULES = [
  { id: 'R01', code: 'LCA Reg 12(6)(a)',           rule: 'Client ledger must not be overdrawn',                  severity: 'CRITICAL' },
  { id: 'R02', code: 'NZLS Guidelines s4.3',        rule: 'Dormant balance — no activity beyond 365 days',        severity: 'HIGH'     },
  { id: 'R03', code: 'LCA Reg 12(1)',               rule: 'Monthly reconciliation break — ledger ≠ bank',         severity: 'CRITICAL' },
  { id: 'R04', code: 'LCA Reg 11',                  rule: 'Bank statement line with no matching ledger entry',     severity: 'HIGH'     },
  { id: 'R05', code: 'LCA Reg 12(1)',               rule: 'Unreconciled ledger entry exceeds 30 days',            severity: 'HIGH'     },
  { id: 'R06', code: 'NZLS PS-2 (eff. 1 Jan 2026)', rule: 'FIT balance held beyond 14-day transfer deadline',     severity: 'HIGH'     },
  { id: 'R07', code: 'LCA Reg 9',                   rule: 'Fee or disbursement entry lacks invoice reference',     severity: 'HIGH'     },
];

const FEES = [
  { name: 'Monthly review',    scope: 'One trust account — ledger ingestion, 7-rule evaluation, PDF exception report, Statement of Diligence pack', fee: '$199 / month' },
  { name: 'Multi-principal',   scope: 'Up to 5 trust accounts — consolidated exception report across all accounts, each evaluated separately',      fee: '$349 / month' },
  { name: 'Inspection pack',   scope: 'Statement of Diligence evidence pack formatted for the NZLS Inspectorate, includes 12-month findings history', fee: '$499 (one-off)' },
];

export default function LandingPage({ onEnterDemo }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F0', fontFamily: "'IBM Plex Sans', sans-serif", color: '#1A1A2E', fontSize: 15, lineHeight: 1.55, WebkitFontSmoothing: 'antialiased' }}>

      {/* ── Nav ────────────────────────────────────────────────────────────── */}
      <div style={{ background: '#1B2A4A', color: '#FFFFFF' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '30px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ fontFamily: "'IBM Plex Serif', serif", fontSize: 19, fontWeight: 500, letterSpacing: 0.2 }}>Trust Account Integrity Engine</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#AEB8CC' }}>New Zealand · Trust Account Compliance</div>
        </div>

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '72px 48px 80px' }}>

          {/* Eyebrow — Correction 1 */}
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 1.5, color: '#C8A84B', textTransform: 'uppercase', marginBottom: 26 }}>
            Lawyers and Conveyancers Act (Trust Account) Regulations 2008
          </div>

          {/* Headline — Correction 1 */}
          <h1 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 500, fontSize: 'clamp(28px, 4vw, 38px)', lineHeight: 1.15, letterSpacing: -0.3, margin: '0 0 22px', maxWidth: '22ch', color: '#FFFFFF' }}>
            Trust-account compliance for NZ law firms — before you sign the monthly certificate.
          </h1>

          {/* Subhead — Correction 1 */}
          <p style={{ fontSize: 17, lineHeight: 1.55, color: '#BEC8DA', maxWidth: '58ch', margin: '0 0 32px', fontWeight: 400 }}>
            Reads your ledger export, runs seven deterministic rules against the relevant LCA clauses, and produces a dated exception report you can put in front of an inspector.
          </p>

          {/* Privacy statement — Correction 1 */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(247,245,240,0.06)', border: '1px solid rgba(200,168,75,0.45)', borderRadius: 4, padding: '14px 20px', marginBottom: 32 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3F9A5C', boxShadow: '0 0 0 3px rgba(63,154,92,0.25)', flexShrink: 0 }}></span>
            <span style={{ fontSize: 14, color: '#6E7B96' }}>
              <span style={{ fontWeight: 600, color: '#F7F5F0' }}>Runs entirely on your machine.</span> No data leaves your office.
            </span>
          </div>

          {/* CTA — Correction 1 */}
          <div style={{ marginBottom: 36 }}>
            <button
              onClick={onEnterDemo}
              style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, fontWeight: 600, background: '#C8A84B', color: '#1B2A4A', border: 'none', borderRadius: 4, padding: '14px 28px', cursor: 'pointer', letterSpacing: 0.2 }}
            >
              Run it on a sample ledger →
            </button>
          </div>

          {/* Trust strip — Correction 8 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 28px' }}>
            {[
              { icon: '🔒', text: 'NZ data — processed locally, never uploaded' },
              { icon: '⚖', text: 'Built against LCA (Trust Account) Regulations 2008' },
              { icon: '👤', text: 'Solo practice — direct contact, no ticket system' },
            ].map((item, i, arr) => (
              <React.Fragment key={item.icon}>
                <span style={{ fontSize: 13, color: '#6E7B96', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{item.icon}</span> {item.text}
                </span>
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 16 }}>·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trust bar — Correction 2 (3 columns) ─────────────────────────── */}
      <div style={{ background: '#F2EFE8', borderBottom: '1px solid #D4CFC8' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>

          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8A8576', marginBottom: 12 }}>
              Regulations checked
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#1B2A4A', lineHeight: 2, marginBottom: 10 }}>
              <div>LCA Reg 12(6)(a) · Reg 12(1)</div>
              <div>LCA Reg 11 · Reg 9 · NZLS s4.3</div>
              <div>NZLS PS-2 (eff. 1 Jan 2026)</div>
            </div>
            <div style={{ fontSize: 13, color: '#6B6B7A', lineHeight: 1.6 }}>
              Seven clauses evaluated against every transaction in the export.
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8A8576', marginBottom: 12 }}>
              Where your data goes
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#1B2A4A', lineHeight: 2, marginBottom: 10 }}>
              <div>Processed on your local machine.</div>
              <div>Nothing is uploaded to any server.</div>
              <div>No account required.</div>
            </div>
            <div style={{ fontSize: 13, color: '#6B6B7A', lineHeight: 1.6 }}>
              Your ledger export never leaves your local environment.
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8A8576', marginBottom: 12 }}>
              How figures are produced
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#1B2A4A', lineHeight: 2, marginBottom: 10 }}>
              <div>Seven deterministic Python functions.</div>
              <div>Each rule maps to a specific LCA clause.</div>
              <div>Same input → same output, always.</div>
            </div>
            <div style={{ fontSize: 13, color: '#6B6B7A', lineHeight: 1.6 }}>
              No statistical inference. No machine learning.
            </div>
          </div>

        </div>
      </div>

      {/* ── Features — 3 cards (Mockup 2) ────────────────────────────────── */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '72px 48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { no: '01', title: 'Deterministic rule engine', body: 'Seven trust-account rules evaluated in Python. No AI in the arithmetic path; the same input always produces the same result.' },
            { no: '02', title: 'Inspectorate-ready output', body: 'A PDF exception report and a Statement of Diligence evidence pack, formatted for the NZLS Inspectorate.' },
            { no: '03', title: 'Direct from your system', body: 'Ingests CSV and Excel exports from LEAP, Actionstep, and Infinitylaw. No migration, no re-keying.' },
          ].map(f => (
            <div key={f.no} style={{ background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, padding: '28px 26px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#C8A84B', letterSpacing: 1, marginBottom: 18 }}>{f.no}</div>
              <h3 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 17, margin: '0 0 12px', color: '#1B2A4A' }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#4A4A5A' }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Regulations table — Correction 3 + Correction 6 Placement 1 ─── */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 48px 24px' }}>
        <h2 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 500, fontSize: 28, margin: '0 0 8px', color: '#1B2A4A' }}>The seven rules</h2>
        <p style={{ margin: '0 0 28px', fontSize: 15, color: '#4A4A5A', maxWidth: '64ch' }}>
          Each rule maps to a specific clause of the 2008 Regulations. The engine evaluates every transaction against the relevant clause and records the outcome.
        </p>
        <div style={{ background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 110px 80px', padding: '14px 24px', borderBottom: '1px solid #D4CFC8', background: '#F2EFE8', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#6B6B7A' }}>
            <div>Regulation</div>
            <div>Rule</div>
            <div style={{ textAlign: 'right' }}>Severity</div>
            <div style={{ textAlign: 'right' }}>Source</div>
          </div>
          {RULES.map((r, i) => {
            const isCrit = r.severity === 'CRITICAL';
            const href = isNzls(r.code) ? NZLS_URL : LCA_URL;
            const label = isNzls(r.code) ? 'NZLS' : 'LCA';
            return (
              <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 110px 80px', alignItems: 'center', padding: '16px 24px', borderBottom: i < RULES.length - 1 ? '1px solid #E8E3DB' : 'none' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#1B2A4A' }}>{r.code}</div>
                <div style={{ fontSize: 14, color: '#1A1A2E' }}>{r.rule}</div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: 0.5, color: isCrit ? '#C8284B' : '#C87028', border: `1px solid ${isCrit ? '#C8284B' : '#C87028'}`, borderRadius: 3, padding: '3px 8px' }}>
                    {r.severity}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#1B2A4A', textDecoration: 'none', borderBottom: '1px solid #C8A84B', paddingBottom: 1 }}>
                    {label} <ExternalLink style={{ width: 10, height: 10, flexShrink: 0 }} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24 }}>
          <button
            onClick={onEnterDemo}
            style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 600, background: 'none', border: 'none', color: '#1B2A4A', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #C8A84B', paddingBottom: 2 }}
          >
            View the live results against synthetic data →
          </button>
        </div>
      </div>

      {/* ── Fees section — Correction 4 (landing page location) ──────────── */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 48px 24px' }}>
        <h2 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 500, fontSize: 28, margin: '0 0 8px', color: '#1B2A4A' }}>Fee estimate</h2>
        <p style={{ margin: '0 0 6px', fontSize: 15, color: '#4A4A5A', maxWidth: '64ch' }}>
          Runs locally — your data never leaves your office. No cloud storage, no external processing.
        </p>
        <div style={{ margin: '24px 0', background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 150px', padding: '13px 24px', borderBottom: '1px solid #D4CFC8', background: '#F2EFE8', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#6B6B7A' }}>
            <div>Engagement</div>
            <div>Scope</div>
            <div style={{ textAlign: 'right' }}>Fee</div>
          </div>
          {FEES.map((x, i) => (
            <div key={x.name} style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 150px', alignItems: 'center', padding: '18px 24px', borderBottom: i < FEES.length - 1 ? '1px solid #E8E3DB' : 'none' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{x.name}</div>
              <div style={{ fontSize: 14, color: '#3A3A4A' }}>{x.scope}</div>
              <div style={{ textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: '#1B2A4A' }}>{x.fee}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#6B6B7A', lineHeight: 1.6 }}>
          All figures NZD, exclusive of GST (+15%). Invoiced monthly or annually. Cancel by email with 30 days notice. No setup fee. No automatic renewal.
        </p>
      </div>

      {/* ── Footer — Correction 8 ─────────────────────────────────────────── */}
      <footer style={{ marginTop: 48, background: '#1B2A4A', color: '#AEB8CC' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '44px 48px', display: 'flex', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>

          <div style={{ maxWidth: '48ch' }}>
            <div style={{ fontFamily: "'IBM Plex Serif', serif", color: '#FFFFFF', fontSize: 16, marginBottom: 12 }}>Trust Account Integrity Engine</div>
            <p style={{ margin: '0 0 20px', fontSize: 13, lineHeight: 1.6, color: '#9AA5BC' }}>
              All figures shown in this engine are derived from synthetic NZ trust ledger data created for demonstration. They do not represent any real firm, client, matter, or trust account.
            </p>
            {/* Contact — Correction 8 */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)', paddingTop: 20 }}>
              <a
                href="https://www.linkedin.com/in/michael-dang-964622193/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#C8A84B', color: '#1B2A4A', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600, textDecoration: 'none', borderRadius: 4, padding: '10px 18px', marginBottom: 10 }}
              >
                Request a walkthrough <ExternalLink style={{ width: 13, height: 13 }} />
              </a>
              <p style={{ margin: '8px 0 4px', fontSize: 13, color: '#9AA5BC' }}>
                Direct message on LinkedIn. Solo practice — no support ticket system.
              </p>
              <p style={{ margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#6E7B96', letterSpacing: 0.5 }}>
                Sole developer, Auckland, New Zealand.
              </p>
            </div>
          </div>

          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, lineHeight: 1.9, color: '#9AA5BC', letterSpacing: 0.5 }}>
            <div>Jurisdiction · New Zealand</div>
            <div>Authority · NZLS Inspectorate</div>
            <div>Processing · Local, deterministic</div>
          </div>

        </div>
      </footer>

    </div>
  );
}
