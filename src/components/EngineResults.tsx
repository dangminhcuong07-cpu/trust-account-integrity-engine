import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { violations, complianceChecks, reportSummary } from '../data';

const NAVY    = '#1B2A4A';
const GOLD    = '#C8A84B';
const OFFWHITE = '#F7F5F0';
const LCA_URL  = 'https://www.legislation.govt.nz/regulation/public/2008/0183/latest/whole.html';
const NZLS_URL = 'https://www.lawsociety.org.nz/assets/Professional-practice-docs/Rules-and-Guidelines/Trust-Accounting-Guidelines-2024.pdf';

function regUrl(citation: string): string {
  if (citation.startsWith('NZLS') || citation.includes('PS-2')) return NZLS_URL;
  return LCA_URL;
}

const sorted = [...violations].sort((a, b) => {
  if (a.severity === b.severity) return a.ruleId.localeCompare(b.ruleId);
  return a.severity === 'CRITICAL' ? -1 : 1;
});

const criticalCount = violations.filter(v => v.severity === 'CRITICAL').length;
const warningCount  = violations.length - criticalCount;

export default function EngineResults() {
  return (
    <div className="space-y-8" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h2 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 700, fontSize: 20, color: NAVY }}>
            Compliance Findings
          </h2>
          <span style={{ fontSize: 10, fontWeight: 700, background: `${GOLD}22`, color: '#8B6914', padding: '3px 10px', borderRadius: 20, border: `1px solid ${GOLD}44`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            LIVE ENGINE OUTPUT
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#5a5a5a', lineHeight: 1.7, maxWidth: 640 }}>
          These results come from running the Trust Account Integrity Engine against
          synthetic NZ trust ledger data containing 7 deliberately seeded compliance
          breaches. The engine processed the data deterministically in Python; no AI
          is in the arithmetic path.
        </p>
      </div>

      {/* ── Summary cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div style={{ background: OFFWHITE, borderRadius: 10, padding: '14px 16px', border: '1px solid #e0ddd6' }}>
          <p style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 4 }}>Firm</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{reportSummary.firmName}</p>
        </div>
        <div style={{ background: OFFWHITE, borderRadius: 10, padding: '14px 16px', border: '1px solid #e0ddd6' }}>
          <p style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 4 }}>Period</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{reportSummary.period}</p>
        </div>
        <div style={{ background: OFFWHITE, borderRadius: 10, padding: '14px 16px', border: '1px solid #e0ddd6' }}>
          <p style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 4 }}>Generated</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{reportSummary.generatedAt}</p>
        </div>
        <div style={{ background: '#FEF0F0', borderRadius: 10, padding: '14px 16px', border: '1px solid #FCCACA' }}>
          <p style={{ fontSize: 10, color: '#C8284B', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 4 }}>Violations</p>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#2a2a2a' }}>
            {violations.length} total —{' '}
            <span style={{ color: '#C8284B' }}>{criticalCount} CRITICAL</span>
            {', '}
            <span style={{ color: '#C87028' }}>{warningCount} WARNING</span>
          </p>
        </div>
      </div>

      {/* ── Violation cards ────────────────────────────────────────────────── */}
      <div>
        <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Exceptions Found
        </h3>
        <div className="space-y-3">
          {sorted.map((v, i) => {
            const isCrit = v.severity === 'CRITICAL';
            const borderColor = isCrit ? '#C8284B' : '#C87028';
            const bgColor     = isCrit ? '#FFF8F8' : '#FFFBF5';
            return (
              <div
                key={`${v.ruleId}-${v.id}-${i}`}
                style={{ borderLeft: `3px solid ${borderColor}`, borderRadius: '0 10px 10px 0', background: bgColor, padding: '14px 18px', border: `1px solid ${isCrit ? '#FCCACA' : '#F5DDB8'}`, borderLeftWidth: 3, borderLeftColor: borderColor }}
              >
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  {/* Severity badge */}
                  {isCrit ? (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#C8284B', background: '#FCCACA', padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <ShieldAlert className="w-3 h-3" /> CRITICAL
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#C87028', background: '#FDEDC4', padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <AlertTriangle className="w-3 h-3" /> WARNING
                    </span>
                  )}
                  {/* Regulation badge — clickable link */}
                  <a
                    href={regUrl(v.nzLawSocietyRule)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 10, fontWeight: 600, color: NAVY, background: `${NAVY}10`, padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 3, border: `1px solid ${NAVY}22`, textDecoration: 'none', letterSpacing: '0.04em' }}
                  >
                    {v.nzLawSocietyRule} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  {/* Record ID */}
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#888', padding: '2px 6px', background: '#f0ede8', borderRadius: 4 }}>
                    {v.sourceRecordId}
                  </span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>{v.ruleName}</p>
                <p style={{ fontSize: 12, color: '#5a5a5a', lineHeight: 1.6 }}>{v.evidence}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Rules applied table ────────────────────────────────────────────── */}
      <div>
        <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Rules Applied
        </h3>
        <div style={{ borderRadius: 10, border: '1px solid #e0ddd6', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: NAVY }}>
                <th style={{ textAlign: 'left', padding: '9px 14px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Rule</th>
                <th className="hidden sm:table-cell" style={{ textAlign: 'left', padding: '9px 14px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Regulation</th>
                <th style={{ textAlign: 'left', padding: '9px 14px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', width: 80 }}>Status</th>
                <th style={{ textAlign: 'left', padding: '9px 14px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', width: 64 }}>Found</th>
              </tr>
            </thead>
            <tbody>
              {complianceChecks.map((c, i) => (
                <tr key={c.id} style={{ borderTop: i > 0 ? '1px solid #e8e6e1' : 'none', background: i % 2 === 0 ? OFFWHITE : '#fff' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500, color: '#1a1a1a' }}>{c.name}</td>
                  <td className="hidden sm:table-cell" style={{ padding: '10px 14px', color: '#5a5a5a' }}>{c.nzlsReference}</td>
                  <td style={{ padding: '10px 14px' }}>
                    {c.status === 'passed' ? (
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#2A6B3C', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#C8284B', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <XCircle className="w-3.5 h-3.5" /> FAIL
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#5a5a5a' }}>{c.resultCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
