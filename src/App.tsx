import React, { useState } from 'react';
import WorkflowDesigner from './components/WorkflowDesigner';
import StrategicBrief from './components/StrategicBrief';
import EngineResults from './components/EngineResults';
import LandingPage from './components/LandingPage';
import { Scale, Activity, Info, Calendar, CreditCard, TrendingUp, ChevronLeft, ExternalLink, FileCheck } from 'lucide-react';

const NAVY    = '#1B2A4A';
const GOLD    = '#C8A84B';
const OFFWHITE = '#F7F5F0';
const LCA_URL  = 'https://www.legislation.govt.nz/regulation/public/2008/0183/latest/whole.html';
const NZLS_URL = 'https://www.lawsociety.org.nz/assets/Professional-practice-docs/Rules-and-Guidelines/Trust-Accounting-Guidelines-2024.pdf';

type Tab = 'findings' | 'how' | 'workflows' | 'fees' | 'market';

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'findings',  label: 'Compliance Findings', icon: <Activity className="w-4 h-4 shrink-0" /> },
  { id: 'how',       label: 'How It Works',         icon: <Info className="w-4 h-4 shrink-0" /> },
  { id: 'workflows', label: 'Practice Workflows',   icon: <Calendar className="w-4 h-4 shrink-0" /> },
  { id: 'fees',      label: 'Fee Estimate',         icon: <CreditCard className="w-4 h-4 shrink-0" /> },
  { id: 'market',    label: 'Market Context',       icon: <TrendingUp className="w-4 h-4 shrink-0" /> },
];

function HowItWorksTab() {
  const steps = [
    { n: '01', title: 'Load your data', body: 'Point the engine at your CSV or Excel trust ledger export. The column mapper normalises non-standard headers automatically — no manual reformatting required.' },
    { n: '02', title: 'Run 7 deterministic rules', body: 'Each rule is a pure Python function with no AI in the arithmetic path. Rules check for overdrawn ledgers, reconciliation breaks, dormant balances, unmatched bank lines, unreconciled item ageing, FIT overholding, and fee reference gaps.' },
    { n: '03', title: 'Review the exception report', body: 'Violations are ranked CRITICAL → WARNING → NOTICE. Each finding cites the specific LCA Regulation or NZLS Guideline, the record ID, and the exact dollar or date value that triggered the flag.' },
    { n: '04', title: 'Export the evidence pack', body: 'One command produces a PDF exception report and a Statement of Diligence — both formatted for the NZLS Inspectorate and your TAS monthly certification under Regulation 17.' },
  ];
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <h2 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 700, fontSize: 20, color: NAVY, marginBottom: 8 }}>How It Works</h2>
      <p style={{ fontSize: 13, color: '#5a5a5a', lineHeight: 1.7, maxWidth: 580, marginBottom: 32 }}>
        A four-step process from raw ledger data to inspector-ready evidence pack.
      </p>
      <div className="space-y-6">
        {steps.map(s => (
          <div key={s.n} className="flex gap-5">
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${NAVY}10`, border: `1px solid ${NAVY}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700, color: NAVY }}>
              {s.n}
            </div>
            <div style={{ paddingTop: 4 }}>
              <h3 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 600, fontSize: 15, color: NAVY, marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: '#5a5a5a', lineHeight: 1.7 }}>{s.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 36, padding: '16px 20px', background: OFFWHITE, borderRadius: 10, border: '1px solid #e0ddd6', fontSize: 13, color: '#5a5a5a', lineHeight: 1.7 }}>
        <strong style={{ color: NAVY }}>Deterministic by design.</strong> Every result can be reproduced by re-running the engine against the same input file. There are no probabilistic model calls in the core compliance path.
      </div>
    </div>
  );
}

function FeeEstimateTab() {
  const plans = [
    { label: 'Solo', price: '$199', period: '/month', desc: 'Single practitioner or sole principal. Unlimited monthly runs.' },
    { label: 'Multi-principal', price: '$349', period: '/month', desc: 'Up to 5 principals. Covers multi-partner firms filing a combined certification.', highlight: true },
    { label: 'Annual evidence pack', price: '$499', period: '/year', desc: 'Unlimited runs plus archival PDF output formatted for NZLS inspections.' },
  ];
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <h2 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 700, fontSize: 20, color: NAVY, marginBottom: 8 }}>Fee Estimate</h2>
      <p style={{ fontSize: 13, color: '#5a5a5a', lineHeight: 1.7, maxWidth: 580, marginBottom: 8 }}>
        Runs locally — your data never leaves your office. No subscription to a cloud platform, no data transfer risk.
      </p>
      <div className="grid sm:grid-cols-3 gap-5" style={{ marginBottom: 20, marginTop: 28 }}>
        {plans.map(p => (
          <div
            key={p.label}
            style={{
              borderRadius: 12,
              padding: '24px 22px',
              border: p.highlight ? `2px solid ${GOLD}` : '1px solid #e0ddd6',
              background: p.highlight ? `${GOLD}0a` : OFFWHITE,
              position: 'relative',
            }}
          >
            {p.highlight && (
              <div style={{ position: 'absolute', top: -11, left: 20, background: GOLD, color: NAVY, fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Most popular
              </div>
            )}
            <p style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>{p.label}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 12 }}>
              <span style={{ fontFamily: "'IBM Plex Serif', serif", fontSize: 32, fontWeight: 700, color: NAVY }}>{p.price}</span>
              <span style={{ fontSize: 13, color: '#888' }}>{p.period}</span>
            </div>
            <p style={{ fontSize: 13, color: '#5a5a5a', lineHeight: 1.6 }}>{p.desc}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>
        Billed annually. GST not included. Cancel anytime.
      </p>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('findings');
  const [showLanding, setShowLanding] = useState(true);

  if (showLanding) {
    return <LandingPage onEnterDemo={() => setShowLanding(false)} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: OFFWHITE, fontFamily: "'IBM Plex Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* ── Header (60px navy) ─────────────────────────────────────────────── */}
      <header style={{ background: NAVY, height: 60, display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex justify-between items-center">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px', display: 'flex', alignItems: 'center' }}>
              <Scale className="w-4 h-4" style={{ color: GOLD }} />
            </div>
            <div>
              <p style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 700, fontSize: 14, color: '#fff', lineHeight: 1.2 }}>
                Trust Account Integrity Engine
              </p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1 }}>NZ-aware compliance review</p>
            </div>
          </div>

          {/* Right: back link + status */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setShowLanding(true)}
              className="hidden sm:inline-flex items-center gap-1"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.50)', fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              <ChevronLeft className="w-3 h-3" /> Back to Overview
            </button>
            <div className="hidden md:flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full" style={{ background: GOLD, opacity: 0.6 }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: GOLD }}></span>
              </span>
              <span style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                System Active (Read-Only)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body: sidebar + content ────────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row" style={{ padding: '32px 16px', gap: 24 }}>

        {/* ── Sidebar (264px navy) ──────────────────────────────────────────── */}
        <aside style={{ width: 264, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Nav */}
          <nav style={{ background: NAVY, borderRadius: 12, overflow: 'hidden', padding: '8px 0' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.09em', padding: '8px 18px 4px' }}>
              Engine Controls
            </p>
            {NAV_ITEMS.map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 18px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                    background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
                    borderLeft: active ? `3px solid ${GOLD}` : '3px solid transparent',
                    transition: 'all 0.15s',
                    fontFamily: "'IBM Plex Sans', sans-serif",
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.id === 'findings' && (
                    <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, background: GOLD, color: NAVY, padding: '2px 6px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      LIVE
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Regulation Scope card */}
          <div style={{ background: NAVY, borderRadius: 12, padding: '18px' }}>
            <h4 style={{ fontSize: 11, fontWeight: 600, color: GOLD, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <FileCheck className="w-3.5 h-3.5" /> Regulation Scope
            </h4>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.60)', lineHeight: 1.7, marginBottom: 12 }}>
              Rules configured in accordance with the <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Lawyers and Conveyancers Act (Trust Account) Regulations 2008</strong> and <strong style={{ color: 'rgba(255,255,255,0.85)' }}>NZLS Guidelines</strong>.
            </p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>7 rules · New Zealand</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <a
                href={LCA_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 11, color: GOLD, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontWeight: 500 }}
              >
                LCA (Trust Account) Regulations 2008 <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href={NZLS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 11, color: GOLD, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontWeight: 500 }}
              >
                NZLS Trust Accounting Guidelines 2024 <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </aside>

        {/* ── Content area ─────────────────────────────────────────────────── */}
        <section style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 28, border: '1px solid #e0ddd6', minWidth: 0 }}>
          {activeTab === 'findings'  && <EngineResults />}
          {activeTab === 'how'       && <HowItWorksTab />}
          {activeTab === 'workflows' && <WorkflowDesigner />}
          {activeTab === 'fees'      && <FeeEstimateTab />}
          {activeTab === 'market'    && <StrategicBrief />}
        </section>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ background: NAVY, padding: '14px 0', marginTop: 'auto' }}>
        <div className="max-w-7xl mx-auto px-4 text-center" style={{ fontSize: 11, color: 'rgba(255,255,255,0.30)', fontFamily: "'IBM Plex Mono', monospace" }}>
          NZ Trust Account Integrity Engine · Grounded Deterministic Verification System · Localized Law &amp; Accountancy SME Proposition
        </div>
      </footer>
    </div>
  );
}
