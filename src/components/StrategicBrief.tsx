import React, { useState } from 'react';
import { productsData, marketingChannels, feasibilityHardTruths } from '../sandbox_data';
import { ShieldCheck, Target, AlertTriangle, Lightbulb, CheckCircle2, ChevronRight, FileText, DollarSign, HelpCircle } from 'lucide-react';

export default function StrategicBrief() {
  const [activeTab, setActiveTab] = useState<'demand' | 'products' | 'marketing' | 'feasibility'>('demand');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">
          Strategic Business & Demand Analysis
        </h2>
        <p className="mt-1 text-sm text-gray-500 max-w-3xl">
          A targeted market overview and feasibility study evaluating the product-market fit of an automated trust integrity engine for New Zealand legal and accounting SMEs.
        </p>
      </div>

      {/* Segment controls */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-2">
        <button
          onClick={() => setActiveTab('demand')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'demand'
              ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <Target className="w-4 h-4" /> Market Demand
          </span>
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'products'
              ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> The Product Suite
          </span>
        </button>
        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'marketing'
              ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Go-To-Market Channels
          </span>
        </button>
        <button
          onClick={() => setActiveTab('feasibility')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'feasibility'
              ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Feasibility & Hard Truths
          </span>
        </button>
      </div>

      {/* Content Panes */}
      <div className="mt-6">
        {activeTab === 'demand' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-xl p-6 shadow-sm border border-emerald-800">
              <h3 className="text-xl font-display font-medium mb-3">Is it in Demand?</h3>
              <p className="text-emerald-100 text-sm leading-relaxed mb-4">
                Absolutely. New Zealand has strict regulatory frameworks governing solicitor and accountant trust funds, primarily overseen by the <strong>New Zealand Law Society (NZLS) Inspectorate</strong> and governed by the <strong>Lawyers and Conveyancers Act 2006</strong>. 
                SME practices carry enormous personal liability for trust accounting errors. A single undetected overdraw or uncleared commission can result in disciplinary action, personal fines of up to <strong>NZD $15,000 per violation</strong>, and permanent reputational damage.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-emerald-800/60">
                <div>
                  <div className="text-2xl font-bold font-display text-emerald-300">100% Mandatory</div>
                  <div className="text-xs text-emerald-200 mt-1">Monthly trust reporting & annual statutory audits are legally required.</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-emerald-300">TAS Liability</div>
                  <div className="text-xs text-emerald-200 mt-1">The Trust Account Supervisor (TAS) carries individual, non-delegable personal risk.</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-emerald-300">High Stress</div>
                  <div className="text-xs text-emerald-200 mt-1">Manual audits between monthly reconciliation dates lead to systemic blindspots.</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-100 rounded-xl p-5 bg-white space-y-3">
                <div className="inline-flex p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-gray-900 font-display">Target Client Profile (SME Market)</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  NZ boutique law firms (1-5 partners), conveyancing practices, and localized accounting practices. These practices lack dedicated compliance officers or complex ERP software. The partners act as the bookkeepers and trust supervisors, leading to major operational strain.
                </p>
              </div>

              <div className="border border-gray-100 rounded-xl p-5 bg-white space-y-3">
                <div className="inline-flex p-2 bg-amber-50 text-amber-700 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-gray-900 font-display">Core Industry Pain Points Caught</h4>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    <span><strong>Unintentional Overdrawing:</strong> Making disbursements from a client matter ledger before clearing bank credits.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    <span><strong>Aged Dormant Balances:</strong> Trust money sitting stale for over 12 months with no ongoing matter activity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    <span><strong>Mixing Funds:</strong> Bank commission credits or firm interest (FIT) retained in the trust ledger beyond 14 days.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {productsData.map((prod, idx) => (
                <div 
                  key={idx} 
                  className="border border-gray-100 rounded-xl p-6 bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                        {prod.badge}
                      </span>
                    </div>
                    <h4 className="text-lg font-display font-semibold text-gray-900">{prod.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{prod.description}</p>
                    <div className="border-t border-gray-50 pt-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Scope Deliverables:</p>
                      <ul className="text-xs text-gray-500 space-y-2">
                        {prod.features.map((f, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-50">
                    <div className="text-xs text-gray-400">Target Value Pricing</div>
                    <div className="text-xl font-display font-bold text-gray-900 mt-1">{prod.pricing}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'marketing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketingChannels.map((channel, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-5 bg-white hover:border-emerald-200 transition-colors duration-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold text-gray-900 font-display">{channel.target}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        <strong className="text-gray-900">Execution Strategy:</strong> {channel.strategy}
                      </p>
                      <div className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md inline-block">
                        <strong>Reach:</strong> {channel.reach}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-emerald-100 rounded-xl p-5 bg-emerald-50/50 space-y-3">
              <h4 className="text-sm font-semibold text-emerald-900 font-display flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> The Beachhead Strategy: Auckland & Wellington Boutique Conveyancers
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Property transactions (conveyancing) generate massive trust account volume and carry the highest risk of timing errors (e.g., funds disbursed before the corresponding deposit clears). By marketing first to Auckland and Wellington property conveyancing boutiques, the value of continuous overdraw checking is felt instantly. Once verified with 5 local references, the expansion to broader litigation and trust-heavy legal firms is streamlined.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'feasibility' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-semibold text-amber-900 font-display flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Critical Risks & Founder Considerations
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Handling, reviewing, and evaluating trust compliance parameters is highly critical. A single software failure that fails to flag an exception can open you to negligence claims. This plan requires robust commercial risk management, structured data policies, and defensive contracts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feasibilityHardTruths.map((truth, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-5 bg-white space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {truth.type}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      truth.status === 'High Priority' || truth.status === 'Non-Negotiable'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {truth.status}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 font-display">{truth.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{truth.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
