import React from 'react';
import { ExternalLink } from 'lucide-react';
import { violations, complianceChecks, reportSummary } from '../data';

const RED   = '#C8284B';
const AMBER = '#C87028';
const GREEN = '#2A6B3C';
const LCA_URL  = 'https://www.legislation.govt.nz/regulation/public/2008/0183/latest/whole.html';
const NZLS_URL = 'https://www.lawsociety.org.nz/assets/Professional-practice-docs/Rules-and-Guidelines/Trust-Accounting-Guidelines-2024.pdf';

function regUrl(citation: string): string {
  if (citation.startsWith('NZLS') || citation.includes('LTAG') || citation.includes('(guidance)')) return NZLS_URL;
  return LCA_URL;
}

const sorted = [...violations].sort((a, b) => {
  if (a.severity === b.severity) return a.ruleId.localeCompare(b.ruleId);
  return a.severity === 'CRITICAL' ? -1 : 1;
});

export default function EngineResults() {
  const criticalCount = reportSummary.criticalCount;
  const highCount     = reportSummary.highCount;

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>

      {/* ── Eyebrow + heading ──────────────────────────────────────────────── */}
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8A8576', marginBottom: 10 }}>Exception Report</div>
      <h1 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 500, fontSize: 34, margin: '0 0 22px', color: '#1B2A4A' }}>Compliance Findings</h1>

      {/* ── Summary cards — Correction 5 (real engine data) ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 30 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, padding: '18px 20px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#8A8576', marginBottom: 9 }}>Firm</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A', lineHeight: 1.35 }}>{reportSummary.firmName}</div>
          <div style={{ fontSize: 12, color: '#6B6B7A' }}>Trust Account</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, padding: '18px 20px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#8A8576', marginBottom: 9 }}>Reporting period</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A' }}>{reportSummary.period}</div>
          <div style={{ fontSize: 12, color: '#6B6B7A' }}>Monthly certification</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, padding: '18px 20px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#8A8576', marginBottom: 9 }}>Generated</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A' }}>{reportSummary.generatedAt}</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#6B6B7A' }}>NZST</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, padding: '18px 20px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#8A8576', marginBottom: 9 }}>Findings</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontFamily: "'IBM Plex Serif', serif", fontSize: 22, color: RED, fontWeight: 500 }}>{criticalCount}</span>
            <span style={{ fontSize: 12, color: '#6B6B7A' }}>Critical</span>
            <span style={{ fontFamily: "'IBM Plex Serif', serif", fontSize: 22, color: AMBER, fontWeight: 500 }}>{highCount}</span>
            <span style={{ fontSize: 12, color: '#6B6B7A' }}>High</span>
          </div>
        </div>
      </div>

      {/* ── Explainer ─────────────────────────────────────────────────────── */}
      <div style={{ background: '#FBFAF7', border: '1px solid #D4CFC8', borderLeft: '3px solid #1B2A4A', borderRadius: 4, padding: '18px 22px', marginBottom: 34 }}>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: '#3A3A4A' }}>
          These results come from running the Trust Account Integrity Engine against synthetic NZ trust ledger data containing 7 deliberately seeded compliance breaches. The engine processed the data deterministically in Python; no AI is in the arithmetic path.
        </p>
      </div>

      {/* ── Violations — real data with clickable badges (Correction 6 P2) ── */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 500, fontSize: 22, margin: 0, color: '#1B2A4A' }}>Violations</h2>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#8A8576' }}>{reportSummary.totalViolations} findings</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 44 }}>
        {sorted.map((v, i) => {
          const isCrit  = v.severity === 'CRITICAL';
          const color   = isCrit ? RED : AMBER;
          const border  = isCrit ? '#E8B0BD' : '#E8C8A8';
          const tint    = isCrit ? '#FBEEF1' : '#FBF3EA';
          const href    = regUrl(v.nzLawSocietyRule);
          return (
            <div key={`${v.ruleId}-${i}`} style={{ background: '#FFFFFF', border: `1px solid #D4CFC8`, borderLeft: `4px solid ${color}`, borderRadius: 4, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                {/* Severity badge */}
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#FFFFFF', background: color, borderRadius: 3, padding: '4px 9px' }}>
                  {v.severity}
                </span>
                {/* Regulation badge — clickable (Correction 6 Placement 2) */}
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 500, color: color, border: `1px solid ${border}`, borderRadius: 3, padding: '3px 9px', background: tint, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  {v.nzLawSocietyRule} <ExternalLink style={{ width: 10, height: 10, flexShrink: 0 }} />
                </a>
                {/* Record ID */}
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#8A8576', marginLeft: 'auto' }}>
                  Record {v.sourceRecordId}
                </span>
              </div>
              <h3 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 16, margin: '0 0 8px', color: '#1B2A4A' }}>{v.ruleName}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#3A3A4A' }}>{v.evidence}</p>
            </div>
          );
        })}
      </div>

      {/* ── Compliance checks — Correction 3 regulation codes ─────────────── */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 500, fontSize: 22, margin: 0, color: '#1B2A4A' }}>Compliance checks</h2>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#8A8576' }}>{complianceChecks.length} rules evaluated</span>
      </div>
      <div style={{ background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, overflow: 'hidden', marginBottom: 30 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 90px 96px', padding: '13px 22px', borderBottom: '1px solid #D4CFC8', background: '#F2EFE8', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#6B6B7A' }}>
          <div>Regulation</div>
          <div>Check</div>
          <div style={{ textAlign: 'center' }}>Findings</div>
          <div style={{ textAlign: 'right' }}>Result</div>
        </div>
        {complianceChecks.map((c, i) => {
          const isPassed = c.status === 'passed';
          const color    = isPassed ? GREEN : RED;
          const label    = isPassed ? 'PASS' : 'FAIL';
          return (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '220px 1fr 90px 96px', alignItems: 'center', padding: '15px 22px', borderBottom: i < complianceChecks.length - 1 ? '1px solid #E8E3DB' : 'none' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#1B2A4A', lineHeight: 1.4 }}>{c.nzlsReference}</div>
              <div style={{ fontSize: 14, color: '#1A1A2E' }}>{c.name}</div>
              <div style={{ textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#6B6B7A' }}>{c.resultCount}</div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 500, letterSpacing: 0.5, color }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }}></span>{label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 14 }}>
        <a
          href="/exception_report.pdf"
          style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 600, background: '#C8A84B', color: '#1B2A4A', border: 'none', borderRadius: 4, padding: '13px 24px', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}
        >
          Download Exception Report (PDF)
        </a>
      </div>

    </div>
  );
}
