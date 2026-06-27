import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import EngineResults from './components/EngineResults';
import LandingPage from './components/LandingPage';

const LCA_URL  = 'https://www.legislation.govt.nz/regulation/public/2008/0183/latest/whole.html';
const NZLS_URL = 'https://www.lawsociety.org.nz/assets/Professional-practice-docs/Rules-and-Guidelines/Trust-Accounting-Guidelines-2024.pdf';

type Tab = 'findings' | 'how' | 'workflows' | 'fees' | 'market';

const NAV_DEFS: { id: Tab; label: string }[] = [
  { id: 'findings',  label: 'Compliance Findings' },
  { id: 'how',       label: 'How It Works' },
  { id: 'workflows', label: 'Practice Workflows' },
  { id: 'fees',      label: 'Fee Estimate' },
  { id: 'market',    label: 'Market Context' },
];

const FEES = [
  { name: 'Monthly review',  scope: 'One trust account — ledger ingestion, 7-rule evaluation, PDF exception report, Statement of Diligence pack', fee: '$199 / month' },
  { name: 'Multi-principal', scope: 'Up to 5 trust accounts — consolidated exception report across all accounts, each evaluated separately',      fee: '$349 / month' },
  { name: 'Inspection pack', scope: 'Statement of Diligence evidence pack formatted for the NZLS Inspectorate, includes 12-month findings history', fee: '$499 (one-off)' },
];

function HowItWorksTab() {
  const steps = [
    { no: '01', title: 'Export', body: 'Export your trust ledger, client ledger, and reconciliation as CSV or Excel from LEAP, Actionstep, or Infinitylaw.' },
    { no: '02', title: 'Ingest', body: 'The engine reads the export on your own machine and normalises it to a common ledger model. Nothing is uploaded.' },
    { no: '03', title: 'Evaluate', body: 'Seven regulation rules run deterministically in Python. Each transaction is tested against the relevant clause of the 2008 Regulations.' },
    { no: '04', title: 'Report', body: 'A PDF exception report and a Statement of Diligence evidence pack are written to disk, ready for your monthly certification and the NZLS Inspectorate.' },
  ];
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8A8576', marginBottom: 10 }}>Process</div>
      <h1 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 500, fontSize: 34, margin: '0 0 14px', color: '#1B2A4A' }}>How It Works</h1>
      <p style={{ margin: '0 0 34px', fontSize: 16, color: '#4A4A5A', maxWidth: '62ch' }}>Four steps, run on your own machine. No upload, no account, no data leaving your office.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((s, i) => (
          <div key={s.no} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 24, padding: '24px 0', borderBottom: i < steps.length - 1 ? '1px solid #D4CFC8' : 'none' }}>
            <div style={{ fontFamily: "'IBM Plex Serif', serif", fontSize: 30, color: '#C8A84B', fontWeight: 500 }}>{s.no}</div>
            <div>
              <h3 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 17, margin: '0 0 8px', color: '#1B2A4A' }}>{s.title}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: '#3A3A4A', maxWidth: '68ch' }}>{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PracticeWorkflowsTab() {
  const workflows = [
    { title: 'Monthly certification', body: 'Run before signing your monthly trust account certificate to surface breaches while they can still be corrected.' },
    { title: 'Inspectorate preparation', body: 'Generate the Statement of Diligence evidence pack ahead of an NZLS Trust Account inspection.' },
    { title: 'New supervisor handover', body: "Establish a documented baseline when taking over responsibility for a firm's trust account." },
    { title: 'Remediation tracking', body: 'Re-run after corrections to confirm a flagged breach has cleared and record the date it did.' },
  ];
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8A8576', marginBottom: 10 }}>Practice</div>
      <h1 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 500, fontSize: 34, margin: '0 0 14px', color: '#1B2A4A' }}>Practice Workflows</h1>
      <p style={{ margin: '0 0 34px', fontSize: 16, color: '#4A4A5A', maxWidth: '62ch' }}>Where the engine fits into the obligations a Trust Account Supervisor already carries.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {workflows.map(w => (
          <div key={w.title} style={{ background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, padding: 24 }}>
            <h3 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 16, margin: '0 0 10px', color: '#1B2A4A' }}>{w.title}</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#3A3A4A' }}>{w.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeeEstimateTab() {
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8A8576', marginBottom: 10 }}>Costing</div>
      <h1 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 500, fontSize: 34, margin: '0 0 14px', color: '#1B2A4A' }}>Fee Estimate</h1>

      {/* Above pricing — Correction 4 */}
      <p style={{ margin: '0 0 28px', fontSize: 15, color: '#4A4A5A', maxWidth: '62ch', lineHeight: 1.6 }}>
        Runs locally — your data never leaves your office. No cloud storage, no external processing.
      </p>

      {/* Pricing table — Correction 4 */}
      <div style={{ background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, overflow: 'hidden', marginBottom: 18 }}>
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

      {/* Below pricing — Correction 4 */}
      <p style={{ margin: 0, fontSize: 13, color: '#6B6B7A', lineHeight: 1.6 }}>
        All figures NZD, exclusive of GST (+15%). Invoiced monthly or annually. Cancel by email with 30 days notice. No setup fee. No automatic renewal.
      </p>
    </div>
  );
}

function MarketContextTab() {
  const regRefs = [
    { label: 'Lawyers and Conveyancers Act 2006, ss 110–116', url: 'https://www.legislation.govt.nz/act/public/2006/0001/latest/whole.html' },
    { label: 'Lawyers and Conveyancers Act (Trust Account) Regulations 2008', url: LCA_URL },
    { label: "NZLS Lawyers' Trust Accounting Guidelines (June 2024)", url: NZLS_URL },
    { label: 'NZLS Inspectorate — Trust Account Reviews', url: 'https://www.lawsociety.org.nz/professional-practice/legal-practice/trust-account-management/' },
  ];
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8A8576', marginBottom: 10 }}>Context</div>
      <h1 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 500, fontSize: 34, margin: '0 0 22px', color: '#1B2A4A' }}>Market Context</h1>

      {/* Mockup 2 three paragraphs — kept exactly */}
      <div style={{ background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, padding: '32px 36px', maxWidth: '72ch', marginBottom: 36 }}>
        <p style={{ margin: '0 0 18px', fontSize: 15, lineHeight: 1.7, color: '#3A3A4A' }}>
          Every New Zealand law firm that holds client money must appoint a Trust Account Supervisor. That person certifies, each month, that the firm's trust account complies with the 2008 Regulations — and carries personal responsibility for the certification.
        </p>
        <p style={{ margin: '0 0 18px', fontSize: 15, lineHeight: 1.7, color: '#3A3A4A' }}>
          The review behind that certificate is still largely manual: exporting ledgers, reconciling by hand, and reading for exceptions. The work is exacting, repetitive, and unforgiving of a missed entry.
        </p>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: '#3A3A4A' }}>
          The Trust Account Integrity Engine does the mechanical part of that review consistently and on the record — so the supervisor's judgement is spent on the findings, not on finding them.
        </p>
      </div>

      {/* Regulatory References — Correction 7 */}
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8A8576', marginBottom: 14 }}>
          Regulatory References
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {regRefs.map(r => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#1B2A4A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, borderBottom: '1px solid transparent' }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
            >
              {r.label} <ExternalLink style={{ width: 12, height: 12, flexShrink: 0, color: '#C8A84B' }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('findings');
  const [showLanding, setShowLanding] = useState(true);

  if (showLanding) {
    return <LandingPage onEnterDemo={() => setShowLanding(false)} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F0', fontFamily: "'IBM Plex Sans', sans-serif", color: '#1A1A2E', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{ background: '#1B2A4A', color: '#FFFFFF', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontFamily: "'IBM Plex Serif', serif", fontSize: 18, fontWeight: 500 }}>Trust Account Integrity Engine</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, borderLeft: '1px solid rgba(255,255,255,0.18)', paddingLeft: 18 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3F9A5C', boxShadow: '0 0 0 3px rgba(63,154,92,0.22)' }}></span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 0.5, color: '#C7D0E0' }}>Read-Only Mode</span>
          </span>
        </div>
        <button
          onClick={() => setShowLanding(true)}
          style={{ background: 'none', border: 'none', color: '#C7D0E0', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, cursor: 'pointer', padding: '6px 0' }}
        >
          ← Back to Overview
        </button>
      </header>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* ── Sidebar — Correction 9 (5 tabs, no LedgerSandbox) ───────────── */}
        <aside style={{ width: 264, flexShrink: 0, background: '#1B2A4A', color: '#FFFFFF', display: 'flex', flexDirection: 'column', padding: '26px 0' }}>
          <div style={{ padding: '0 24px 18px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#6E7B96' }}>Review</div>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {NAV_DEFS.map(n => {
              const active = n.id === tab;
              return (
                <button
                  key={n.id}
                  onClick={() => setTab(n.id)}
                  style={{
                    textAlign: 'left',
                    background: active ? '#243C66' : 'transparent',
                    border: 'none',
                    borderLeft: `3px solid ${active ? '#C8A84B' : 'transparent'}`,
                    color: active ? '#FFFFFF' : '#AEB8CC',
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    padding: '11px 24px',
                    cursor: 'pointer',
                  }}
                >
                  {n.label}
                </button>
              );
            })}
          </nav>

          {/* Regulation Scope card — Correction 6 Placement 3 */}
          <div style={{ marginTop: 'auto', padding: 24 }}>
            <div style={{ border: '1px solid rgba(255,255,255,0.14)', borderRadius: 4, padding: 16 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#6E7B96', marginBottom: 10 }}>Regulation Scope</div>
              <div style={{ fontFamily: "'IBM Plex Serif', serif", fontSize: 14, lineHeight: 1.4, color: '#FFFFFF', marginBottom: 10 }}>
                Lawyers and Conveyancers Act (Trust Account) Regulations 2008
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#9AA5BC', letterSpacing: 0.5, marginBottom: 14 }}>7 rules · New Zealand</div>
              {/* Source links — Correction 6 Placement 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a
                  href={LCA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#C8A84B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  ↗ LCA (Trust Account) Regulations 2008
                </a>
                <a
                  href={NZLS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#C8A84B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  ↗ NZLS Trust Accounting Guidelines 2024
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0, background: '#F7F5F0', overflowY: 'auto' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 44px 80px' }}>
            {tab === 'findings'  && <EngineResults />}
            {tab === 'how'       && <HowItWorksTab />}
            {tab === 'workflows' && <PracticeWorkflowsTab />}
            {tab === 'fees'      && <FeeEstimateTab />}
            {tab === 'market'    && <MarketContextTab />}
          </div>
        </main>

      </div>
    </div>
  );
}
