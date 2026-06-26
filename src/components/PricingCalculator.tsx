import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, DollarSign, Hourglass, TrendingUp, HelpCircle } from 'lucide-react';

export default function PricingCalculator() {
  const [numAccounts, setNumAccounts] = useState<number>(2);
  const [partnerRate, setPartnerRate] = useState<number>(450);
  const [manualHours, setManualHours] = useState<number>(12);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'professional' | 'enterprise'>('professional');

  // Outputs
  const [timeSavedHours, setTimeSavedHours] = useState<number>(0);
  const [annualSavingsValue, setAnnualSavingsValue] = useState<number>(0);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [riskMitigationValue, setRiskMitigationValue] = useState<number>(15000); // Base NZLS breach mitigation
  const [netROI, setNetROI] = useState<number>(0);
  const [roiPercentage, setRoiPercentage] = useState<number>(0);

  // Auto-pricing updates based on accounts or selected tier
  useEffect(() => {
    // Determine default tier based on accounts
    if (numAccounts <= 2 && selectedTier === 'enterprise') {
      setSelectedTier('professional');
    } else if (numAccounts > 5 && selectedTier !== 'enterprise') {
      setSelectedTier('enterprise');
    }
  }, [numAccounts]);

  useEffect(() => {
    // Map tier pricing
    let monthlyCost = 0;
    if (selectedTier === 'basic') monthlyCost = 600;
    else if (selectedTier === 'professional') monthlyCost = 1000;
    else monthlyCost = 1500;

    const annualSubCost = monthlyCost * 12;
    setEstimatedCost(annualSubCost);

    // Time saved calculation (approx 75% efficiency gain)
    const monthlySaved = Math.round(manualHours * 0.75 * 10) / 10;
    setTimeSavedHours(monthlySaved);

    // Direct financial value of partner hours saved
    const annualHoursSavedValue = Math.round(monthlySaved * partnerRate * 12);
    setAnnualSavingsValue(annualHoursSavedValue);

    // NZ Law Society inspector audits carry a fine up to $15k + administrative disruption.
    // Proactive detection reduces the risk of fine and auditor overtime bills by $15,000 conservatively.
    const riskReduction = 15000;
    setRiskMitigationValue(riskReduction);

    const totalValue = annualHoursSavedValue + riskReduction;
    const net = totalValue - annualSubCost;
    setNetROI(net);

    const percentage = Math.round((net / annualSubCost) * 100);
    setRoiPercentage(percentage);
  }, [numAccounts, partnerRate, manualHours, selectedTier]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">
          Feasibility & Cost-Benefit Calculator
        </h2>
        <p className="mt-1 text-sm text-gray-500 max-w-3xl">
          Evaluate the direct return on investment (ROI) of the integrity engine by inputting your firm\'s operational statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-100 p-6 space-y-6">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider font-display border-b border-gray-50 pb-2">
            1. Input Firm Variables
          </h3>

          {/* Slider 1: Trust Accounts */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-medium text-gray-700">Number of Trust Accounts</label>
              <span className="font-semibold text-emerald-700">{numAccounts} Account(s)</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={numAccounts}
              onChange={(e) => setNumAccounts(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-xxs text-gray-400">
              <span>1 Account</span>
              <span>5 Accounts</span>
              <span>10 Accounts</span>
            </div>
          </div>

          {/* Slider 2: Manual Audit Hours */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-medium text-gray-700">Monthly Partner/Staff Compliance Hours</label>
              <span className="font-semibold text-emerald-700">{manualHours} hrs / month</span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              value={manualHours}
              onChange={(e) => setManualHours(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <p className="text-xxs text-gray-400">
              Time spent on manual three-way ledger matching, checking transaction history, reconciling bank margins, and compiling regulatory TAS logs.
            </p>
          </div>

          {/* Slider 3: Hourly billing rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-medium text-gray-700">Partner / Trust Supervisor Billable Rate</label>
              <span className="font-semibold text-emerald-700">NZD ${partnerRate} / hr</span>
            </div>
            <input
              type="range"
              min="200"
              max="800"
              step="50"
              value={partnerRate}
              onChange={(e) => setPartnerRate(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-xxs text-gray-400">
              <span>$200 / hr</span>
              <span>$500 / hr</span>
              <span>$800 / hr</span>
            </div>
          </div>

          {/* Tier Selector */}
          <div className="space-y-3 pt-4 border-t border-gray-50">
            <label className="block text-sm font-medium text-gray-700">Select Proposed Retainer Tier</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                disabled={numAccounts > 2}
                onClick={() => setSelectedTier('basic')}
                className={`p-3 text-left border rounded-lg transition-all duration-200 ${
                  selectedTier === 'basic'
                    ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 ring-1 ring-emerald-500'
                    : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-700'
                } ${numAccounts > 2 ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="text-xs font-semibold">Basic</div>
                <div className="text-sm font-bold mt-1">NZD $600/mo</div>
                <div className="text-xxs text-gray-400 mt-1">Max 2 Accounts</div>
              </button>

              <button
                type="button"
                disabled={numAccounts > 5}
                onClick={() => setSelectedTier('professional')}
                className={`p-3 text-left border rounded-lg transition-all duration-200 ${
                  selectedTier === 'professional'
                    ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 ring-1 ring-emerald-500'
                    : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-700'
                } ${numAccounts > 5 ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="text-xs font-semibold">Professional</div>
                <div className="text-sm font-bold mt-1">NZD $1,000/mo</div>
                <div className="text-xxs text-gray-400 mt-1">Max 5 Accounts</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('enterprise')}
                className={`p-3 text-left border rounded-lg transition-all duration-200 ${
                  selectedTier === 'enterprise'
                    ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 ring-1 ring-emerald-500'
                    : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="text-xs font-semibold">Enterprise</div>
                <div className="text-sm font-bold mt-1">NZD $1,500/mo</div>
                <div className="text-xxs text-gray-400 mt-1">Unlimited</div>
              </button>
            </div>
            {numAccounts > 2 && selectedTier === 'basic' && (
              <p className="text-xxs text-rose-600 mt-1">Basic tier is limited to 2 trust accounts. Please adjust or choose a higher tier.</p>
            )}
            {numAccounts > 5 && selectedTier === 'professional' && (
              <p className="text-xxs text-rose-600 mt-1">Professional tier is limited to 5 trust accounts. Please adjust or choose Enterprise.</p>
            )}
          </div>
        </div>

        {/* Right Side: Cost-Benefit Outcomes */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 text-white rounded-xl p-6 border border-gray-800 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-display border-b border-gray-800 pb-2 mb-4">
                2. Feasibility Outcomes (Annualized)
              </h3>

              <div className="space-y-4">
                {/* Time Saved Row */}
                <div className="flex justify-between items-center py-2 border-b border-gray-800/40">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Hourglass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Time Saved / Month</span>
                  </div>
                  <div className="text-sm font-semibold font-mono text-emerald-300">
                    {timeSavedHours} Hours
                  </div>
                </div>

                {/* Partner Value Row */}
                <div className="flex justify-between items-center py-2 border-b border-gray-800/40">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Annual Time Savings Value</span>
                  </div>
                  <div className="text-sm font-semibold font-mono text-emerald-300">
                    ${annualSavingsValue.toLocaleString()} NZD
                  </div>
                </div>

                {/* Risk Mitigation Row */}
                <div className="flex justify-between items-center py-2 border-b border-gray-800/40">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NZLS Regulatory Risk Reduction</span>
                  </div>
                  <div className="text-sm font-semibold font-mono text-emerald-300">
                    ${riskMitigationValue.toLocaleString()} NZD
                  </div>
                </div>

                {/* Subscription Cost Row */}
                <div className="flex justify-between items-center py-2 border-b border-gray-800/40">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                    <span>Engine Subscription Cost</span>
                  </div>
                  <div className="text-sm font-semibold font-mono text-rose-300">
                    -${estimatedCost.toLocaleString()} NZD
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-800">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xxs uppercase text-gray-400 tracking-wider">Net Annual Return (ROI)</div>
                  <div className="text-2xl font-bold font-display text-emerald-400 mt-1">
                    ${netROI.toLocaleString()} <span className="text-xs">NZD</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xxs uppercase text-gray-400 tracking-wider">ROI Ratio</div>
                  <div className="text-lg font-bold font-mono text-emerald-300 mt-1">
                    +{roiPercentage}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-emerald-100 rounded-xl p-4 bg-emerald-50/30">
            <h4 className="text-xs font-semibold text-emerald-900 uppercase tracking-wide font-display mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> ROI Feasibility Verdict
            </h4>
            <p className="text-xxs text-emerald-800 leading-relaxed">
              At a conservative ${partnerRate}/hr partner rate and {manualHours} manual hours, the financial value of time recovered alone (${annualSavingsValue.toLocaleString()} NZD) represents an immediate positive yield. When factoring in the prevention of NZLS inspectorate regulatory penalties and defense prep hours, the financial feasibility for a typical NZ SME practice is extremely compelling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
