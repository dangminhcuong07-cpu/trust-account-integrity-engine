import React, { useState, useEffect } from 'react';
import { billingWorkflows, complianceWorkflows } from '../sandbox_data';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  TrendingUp, 
  FileSignature, 
  DollarSign, 
  HelpCircle, 
  ShieldCheck, 
  Info, 
  Percent 
} from 'lucide-react';

export default function WorkflowDesigner() {
  const [activeWorkflow, setActiveWorkflow] = useState<'billing' | 'compliance'>('compliance');

  // Billing interactive model state
  const [mattersCount, setMattersCount] = useState<number>(40);
  const [disbursementFee, setDisbursementFee] = useState<number>(20);
  const [selectedSubTier, setSelectedSubTier] = useState<number>(1000); // Default Professional tier $1000/mo

  // Calculated billing outcomes
  const [monthlyYield, setMonthlyYield] = useState<number>(0);
  const [netCost, setNetCost] = useState<number>(0);
  const [isProfitable, setIsProfitable] = useState<boolean>(false);

  useEffect(() => {
    const yieldAmount = mattersCount * disbursementFee;
    setMonthlyYield(yieldAmount);

    const net = selectedSubTier - yieldAmount;
    setNetCost(net);
    setIsProfitable(yieldAmount > selectedSubTier);
  }, [mattersCount, disbursementFee, selectedSubTier]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">
          Streamlined Practice Workflows
        </h2>
        <p className="mt-1 text-sm text-gray-500 max-w-3xl">
          Detailed operational frameworks to transition trust accounting from a manual cost-center into an automated, self-funding safety layer.
        </p>
      </div>

      {/* Segment controls */}
      <div className="flex gap-2 border-b border-gray-100 pb-2">
        <button
          onClick={() => setActiveWorkflow('compliance')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeWorkflow === 'compliance'
              ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Compliance Reporting Timeline
          </span>
        </button>
        <button
          onClick={() => setActiveWorkflow('billing')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeWorkflow === 'billing'
              ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Client Billing Disbursement Model
          </span>
        </button>
      </div>

      {/* Content panes */}
      <div className="mt-6">
        
        {/* Compliance workflow timeline */}
        {activeWorkflow === 'compliance' && (
          <div className="space-y-8">
            <div className="bg-emerald-50/40 border border-emerald-100 p-5 rounded-xl space-y-2">
              <h4 className="text-sm font-semibold text-emerald-900 font-display flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Trust Account Supervisor (TAS) Duty Optimization
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                By substituting manual month-end checklists with an automated pipeline, the engine optimizes the monthly audit requirements under Lawyers and Conveyancers Act Rules 10 and 11.
              </p>
            </div>

            <div className="relative border-l border-emerald-200 ml-4 pl-8 space-y-8">
              {complianceWorkflows.map((flow, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline node */}
                  <span className="absolute -left-12 top-0.5 bg-emerald-600 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center text-xs font-semibold ring-4 ring-white shadow-sm">
                    {idx + 1}
                  </span>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono bg-emerald-50 px-2 py-0.5 rounded">
                        {flow.phase}
                      </span>
                      <h4 className="text-base font-semibold text-gray-900 font-display">{flow.title}</h4>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">{flow.description}</p>
                    <div className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100/50 max-w-2xl font-mono leading-relaxed">
                      <strong>Audit Trail Impact:</strong> {flow.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client billing workflow */}
        {activeWorkflow === 'billing' && (
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Steps explanation */}
              <div className="lg:col-span-7 space-y-6">
                <div className="border-b border-gray-50 pb-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display">
                    Defensible Billing Steps (NZ Jurisdiction)
                  </h3>
                </div>

                <div className="space-y-6">
                  {billingWorkflows.map((step) => (
                    <div key={step.step} className="flex gap-4">
                      <div className="text-lg font-bold font-display text-emerald-600 bg-emerald-50 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                        {step.step}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-gray-900 font-display">{step.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                        <div className="text-xxs text-gray-400 leading-relaxed font-mono">
                          <strong>Operational Action:</strong> {step.details}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Offset Modeler */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-gray-100 p-6 space-y-6 shadow-xxs">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-display border-b border-gray-50 pb-2">
                  Cost-Neutrality Modeler
                </h3>

                {/* Slider: Matters */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label className="font-medium text-gray-700">Monthly Trust Transactions</label>
                    <span className="font-semibold text-emerald-700">{mattersCount} Transactions</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={mattersCount}
                    onChange={(e) => setMattersCount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xxs text-gray-400">
                    <span>5 txs</span>
                    <span>50 txs</span>
                    <span>100 txs</span>
                  </div>
                </div>

                {/* Slider: Fee */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label className="font-medium text-gray-700">Admin Fee Per Transaction</label>
                    <span className="font-semibold text-emerald-700">NZD ${disbursementFee} + GST</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="5"
                    value={disbursementFee}
                    onChange={(e) => setDisbursementFee(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xxs text-gray-400">
                    <span>$5</span>
                    <span>$20</span>
                    <span>$40</span>
                  </div>
                </div>

                {/* Subscription cost tier selector */}
                <div className="space-y-2 pt-2 border-t border-gray-50">
                  <label className="block text-xxs uppercase tracking-wider text-gray-400 font-semibold">Select Retainer Option</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSubTier(600)}
                      className={`py-1.5 px-2 text-center border rounded-md text-xxs font-semibold transition-all duration-200 ${
                        selectedSubTier === 600
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      Basic ($600)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSubTier(1000)}
                      className={`py-1.5 px-2 text-center border rounded-md text-xxs font-semibold transition-all duration-200 ${
                        selectedSubTier === 1000
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      Pro ($1,000)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSubTier(1500)}
                      className={`py-1.5 px-2 text-center border rounded-md text-xxs font-semibold transition-all duration-200 ${
                        selectedSubTier === 1500
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      Ent ($1,500)
                    </button>
                  </div>
                </div>

                {/* Calculation Outputs */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Admin Disbursements Billed:</span>
                    <span className="font-semibold text-gray-950 font-mono">+${monthlyYield} NZD</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Engine Retainer Subscription:</span>
                    <span className="font-semibold text-rose-600 font-mono">-${selectedSubTier} NZD</span>
                  </div>

                  <div className={`p-3 rounded-lg border flex flex-col justify-between ${
                    isProfitable 
                      ? 'bg-emerald-50/40 border-emerald-100 text-emerald-900' 
                      : 'bg-rose-50/40 border-rose-100 text-rose-900'
                  }`}>
                    <span className="text-xxs uppercase tracking-wider font-semibold">Net Firm Margin:</span>
                    <span className="text-lg font-bold font-mono mt-1">
                      {isProfitable ? '+' : ''}${-netCost} NZD / month
                    </span>
                    <span className="text-xxs mt-1 opacity-80 leading-relaxed font-sans">
                      {isProfitable 
                        ? '🚀 Self-Funding. Client-billed recoveries completely offset compliance monitoring, creating net-positive business yield.'
                        : '⚠️ Partial Offset. Disbursement billing offsets a portion of the software costs.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
