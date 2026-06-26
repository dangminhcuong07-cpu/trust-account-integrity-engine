import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { violations, complianceChecks, reportSummary } from '../data';

const sorted = [...violations].sort((a, b) => {
  if (a.severity === b.severity) return a.ruleId.localeCompare(b.ruleId);
  return a.severity === 'CRITICAL' ? -1 : 1;
});

const criticalCount = violations.filter(v => v.severity === 'CRITICAL').length;
const warningCount  = violations.length - criticalCount;

export default function EngineResults() {
  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-gray-900 font-display tracking-tight">
            Trust Account Integrity Engine — Live Results
          </h2>
          <span className="text-xxs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
            LIVE ENGINE OUTPUT
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">
          These results come from running the Trust Account Integrity Engine against
          synthetic NZ trust ledger data containing 7 deliberately seeded compliance
          breaches. The engine processed the data deterministically in Python; no AI
          is in the arithmetic path.
        </p>
      </div>

      {/* ── Summary cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <p className="text-xxs text-gray-400 uppercase tracking-wider font-medium mb-0.5">Firm</p>
          <p className="text-xs font-semibold text-gray-800">{reportSummary.firmName}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <p className="text-xxs text-gray-400 uppercase tracking-wider font-medium mb-0.5">Period</p>
          <p className="text-xs font-semibold text-gray-800">{reportSummary.period}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <p className="text-xxs text-gray-400 uppercase tracking-wider font-medium mb-0.5">Generated</p>
          <p className="text-xs font-semibold text-gray-800">{reportSummary.generatedAt}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 border border-red-100">
          <p className="text-xxs text-red-400 uppercase tracking-wider font-medium mb-0.5">Violations</p>
          <p className="text-xs font-semibold text-gray-800">
            {violations.length} total —{' '}
            <span className="text-red-600">{criticalCount} CRITICAL</span>
            {', '}
            <span className="text-amber-600">{warningCount} WARNING</span>
          </p>
        </div>
      </div>

      {/* ── Violations table ───────────────────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 font-display">
          Exceptions Found
        </h3>
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-gray-400 uppercase tracking-wider w-28">Severity</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-400 uppercase tracking-wider">Rule</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Regulation</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-400 uppercase tracking-wider w-20">Record</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-400 uppercase tracking-wider">Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((v, i) => (
                <tr
                  key={`${v.ruleId}-${v.id}-${i}`}
                  className={
                    v.severity === 'CRITICAL'
                      ? 'border-l-2 border-red-400 bg-red-50/30'
                      : 'border-l-2 border-amber-300 bg-amber-50/20'
                  }
                >
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    {v.severity === 'CRITICAL' ? (
                      <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-1.5 py-0.5 rounded text-xxs font-bold">
                        <ShieldAlert className="w-3 h-3" /> CRITICAL
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-xxs font-bold">
                        <AlertTriangle className="w-3 h-3" /> WARNING
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 font-medium text-gray-700">{v.ruleName}</td>
                  <td className="px-3 py-2.5 text-gray-500 hidden lg:table-cell">{v.nzLawSocietyRule}</td>
                  <td className="px-3 py-2.5 font-mono text-gray-600 text-xxs">{v.sourceRecordId}</td>
                  <td className="px-3 py-2.5 text-gray-600 leading-relaxed">{v.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Compliance checks table ────────────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 font-display">
          Rules Applied
        </h3>
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-gray-400 uppercase tracking-wider">Rule</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Regulation</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-400 uppercase tracking-wider w-20">Status</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-400 uppercase tracking-wider w-20">Found</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {complianceChecks.map(c => (
                <tr key={c.id}>
                  <td className="px-3 py-2.5 font-medium text-gray-700">{c.name}</td>
                  <td className="px-3 py-2.5 text-gray-500 hidden sm:table-cell">{c.nzlsReference}</td>
                  <td className="px-3 py-2.5">
                    {c.status === 'passed' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> FAIL
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{c.resultCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
