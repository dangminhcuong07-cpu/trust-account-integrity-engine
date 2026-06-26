import React from 'react';
import { Scale, ShieldCheck, FileText, Lock, ArrowRight, ChevronRight } from 'lucide-react';

interface Props {
  onEnterDemo: () => void;
}

const RULES = [
  { id: 'R01', reg: 'LCA Reg 12(6)(a)',          check: 'Overdrawn client ledger' },
  { id: 'R02', reg: 'NZLS Guidelines s4.3',       check: 'Dormant balance (>365 days)' },
  { id: 'R03', reg: 'LCA Reg 12(1)',              check: 'Reconciliation break' },
  { id: 'R04', reg: 'LCA Reg 11',                 check: 'Unmatched bank statement line' },
  { id: 'R05', reg: 'LCA Reg 12(1)',              check: 'Unreconciled item ageing' },
  { id: 'R06', reg: 'NZLS PS-2 (eff. 1 Jan 2026)', check: 'FIT balance overheld' },
  { id: 'R07', reg: 'LCA Reg 9',                  check: 'Fee without invoice reference' },
];

export default function LandingPage({ onEnterDemo }: Props) {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased flex flex-col">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="bg-emerald-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">

          {/* Brand mark */}
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-white/10 rounded-lg">
              <Scale className="w-5 h-5 text-emerald-200" />
            </div>
            <span className="text-sm font-semibold text-emerald-200 tracking-wide font-display">
              Trust Account Integrity Engine
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white leading-tight mb-5">
            Trust Account Integrity Engine
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 leading-relaxed max-w-2xl mb-10">
            Automated compliance review for NZ law firms and accounting practices —
            built around the Lawyers and Conveyancers Act (Trust Account) Regulations 2008
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onEnterDemo}
              className="inline-flex items-center gap-2 bg-white text-emerald-900 font-semibold text-sm px-5 py-3 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer shadow-sm"
            >
              View Live Demo <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="/exception_report.pdf"
              className="inline-flex items-center gap-2 border border-emerald-600 text-emerald-100 font-semibold text-sm px-5 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <FileText className="w-4 h-4" /> Download Sample Report (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* ── What it does (3 cards) ─────────────────────────────────────────── */}
      <section className="bg-slate-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="grid sm:grid-cols-3 gap-6">

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs">
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-semibold font-display text-gray-900 mb-2">7 Compliance Rules</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Checks your trust ledger against the LCA Regulations and NZLS Guidelines —
                reconciliation, overdrawn accounts, dormant balances, unmatched bank lines, and more.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs">
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-semibold font-display text-gray-900 mb-2">Inspector-Ready Output</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Produces a PDF exception report and Statement of Diligence evidence pack —
                formatted for the NZLS Inspectorate and your TAS monthly certification.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs">
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-semibold font-display text-gray-900 mb-2">Your Data Stays Local</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Runs entirely on your machine. No data is sent to any external service.
                Evidence strings contain only the record references needed to identify each exception.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Who it's for ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <h2 className="text-xl font-bold font-display text-gray-900 mb-4">Who it's for</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
            Designed for Trust Account Supervisors at NZ law firms and accounting practices
            who need a systematic, documented integrity review before filing their monthly and
            quarterly certifications under Regulation 17.
          </p>
        </div>
      </section>

      {/* ── Regulations table ─────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <h2 className="text-xl font-bold font-display text-gray-900 mb-6">The regulations it covers</h2>
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-xs">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400 uppercase tracking-wider text-xs w-16">Rule</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400 uppercase tracking-wider text-xs">Regulation</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400 uppercase tracking-wider text-xs">What it checks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RULES.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-emerald-700">{r.id}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.reg}</td>
                    <td className="px-4 py-3 text-gray-700">{r.check}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enter demo CTA */}
          <div className="mt-8">
            <button
              onClick={onEnterDemo}
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              View the live results against synthetic data <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-2">
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            This demo runs against synthetic NZ trust ledger data containing 7 deliberately
            seeded compliance breaches. No real client data is used in this demonstration.
          </p>
          <p className="text-xs text-gray-400">Built for NZ — not generic compliance software.</p>
        </div>
      </footer>

    </div>
  );
}
