import React, { useState } from 'react';
import LedgerSandbox from './components/LedgerSandbox';
import WorkflowDesigner from './components/WorkflowDesigner';
import PricingCalculator from './components/PricingCalculator';
import StrategicBrief from './components/StrategicBrief';
import EngineResults from './components/EngineResults';
import LandingPage from './components/LandingPage';
import {
  Scale,
  Activity,
  ShieldAlert,
  TrendingUp,
  Calendar,
  FileCheck,
  Layers,
  ChevronLeft
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'results' | 'sandbox' | 'workflows' | 'roi' | 'brief'>('results');
  const [showLanding, setShowLanding] = useState(true);

  if (showLanding) {
    return <LandingPage onEnterDemo={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-gray-800 font-sans antialiased flex flex-col justify-between">
      {/* Upper Navigation Header bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xxs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left Brand Area */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-900 text-white rounded-lg shrink-0 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-md sm:text-lg font-display font-bold text-gray-950 tracking-tight">
                  Trust Account Integrity Engine
                </h1>
                <p className="text-xxs text-gray-400">NZ-aware compliance review for law firms and accountants</p>
              </div>
            </div>

            {/* Right: Back link + Status */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLanding(true)}
                className="hidden sm:inline-flex items-center gap-1 text-xxs font-medium text-gray-400 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3" /> Back to Overview
              </button>
              <div className="hidden md:flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xxs font-medium font-mono text-gray-500 uppercase tracking-wider">
                  System Active (Read-Only)
                </span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar Panel */}
        <aside className="lg:w-64 shrink-0 space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xxs space-y-1">
            <p className="text-xxs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 font-display">Engine Controls</p>

            <button
              onClick={() => setActiveTab('results')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span className="flex-1">Live Results</span>
              <span className="text-xxs font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase tracking-wider">
                LIVE
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'sandbox'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span className="flex-1">Interactive Demo</span>
              <span className="text-xxs font-semibold text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 uppercase tracking-wider">
                DEMO
              </span>
            </button>

            <button
              onClick={() => setActiveTab('workflows')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'workflows'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Practice Workflows</span>
            </button>

            <button
              onClick={() => setActiveTab('roi')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'roi'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Feasibility & Costing</span>
            </button>

            <button
              onClick={() => setActiveTab('brief')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'brief'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Market Demand & Strategy</span>
            </button>
          </div>

          {/* Quick Context Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-xl p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-semibold font-display tracking-tight flex items-center gap-1.5 text-emerald-200">
              <FileCheck className="w-4 h-4 shrink-0" /> Regulatory Scope
            </h4>
            <p className="text-xxs text-emerald-100 leading-relaxed">
              Rules and filters configured in accordance with the <strong>Lawyers and Conveyancers Act (Trust Account) Regulations 2008</strong> and <strong>New Zealand Law Society (NZLS) Guidelines</strong>.
            </p>
          </div>
        </aside>

        {/* Dynamic Content Frame */}
        <section className="flex-1 bg-white border border-gray-100 rounded-xl p-6 shadow-xxs">
          {activeTab === 'results'    && <EngineResults />}
          {activeTab === 'sandbox'    && <LedgerSandbox />}
          {activeTab === 'workflows'  && <WorkflowDesigner />}
          {activeTab === 'roi'        && <PricingCalculator />}
          {activeTab === 'brief'      && <StrategicBrief />}
        </section>
      </main>

      {/* Footer copyright */}
      <footer className="border-t border-gray-100 bg-white py-4 mt-8 shrink-0">
        <div className="max-w-7xl mx-auto px-4 text-center text-xxs text-gray-400">
          NZ Trust Account Integrity Engine • Grounded Deterministic Verification System • Localized Law & Accountancy SME Proposition
        </div>
      </footer>
    </div>
  );
}
