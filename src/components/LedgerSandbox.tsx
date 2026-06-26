import React, { useState, useEffect } from 'react';
import { complianceChecks } from '../data';
import { initialTrustAccounts, initialClientLedgers, initialBankStatements, initialRuleViolations } from '../sandbox_data';
import { 
  TrustAccount, 
  ClientLedger, 
  BankStatementLine, 
  RuleViolation, 
  ComplianceCheck, 
  LedgerEntry 
} from '../types';
import { 
  Play, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  RotateCcw, 
  Download, 
  ArrowRight, 
  ShieldAlert, 
  Check, 
  History, 
  Database, 
  ClipboardCheck, 
  FileCheck 
} from 'lucide-react';

export default function LedgerSandbox() {
  const [engineExecuted, setEngineExecuted] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Live state representing the "source of truth"
  const [trustAccounts, setTrustAccounts] = useState<TrustAccount[]>(initialTrustAccounts);
  const [clientLedgers, setClientLedgers] = useState<ClientLedger[]>(initialClientLedgers);
  const [bankLines, setBankLines] = useState<BankStatementLine[]>(initialBankStatements);
  const [violations, setViolations] = useState<RuleViolation[]>(initialRuleViolations);
  const [checks, setChecks] = useState<ComplianceCheck[]>(complianceChecks);
  const [activeViolation, setActiveViolation] = useState<RuleViolation | null>(null);

  // Log of manual audit adjustments (proactive compliance steps)
  const [auditLog, setAuditLog] = useState<string[]>([]);
  const [showEvidencePack, setShowEvidencePack] = useState<boolean>(false);

  // Core Math verification
  const totalClientLedgerBalances = clientLedgers.reduce((sum, ledger) => sum + ledger.balance, 0);
  const anzAccount = trustAccounts.find(a => a.id === 'TA-ANZ-01');
  const reconciledDiff = anzAccount ? anzAccount.bankBalance - totalClientLedgerBalances : 0;

  // Run the engine
  const handleExecuteEngine = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setEngineExecuted(true);
      if (auditLog.length === 0) {
        setAuditLog([`[${new Date().toISOString()}] INITIAL COMPLIANCE ANALYSIS RUN COMPLETED.`]);
      }
    }, 1200);
  };

  // Reset demo state
  const handleReset = () => {
    setTrustAccounts(initialTrustAccounts);
    setClientLedgers(initialClientLedgers);
    setBankLines(initialBankStatements);
    setViolations(initialRuleViolations);
    setChecks(complianceChecks);
    setActiveViolation(null);
    setEngineExecuted(false);
    setShowEvidencePack(false);
    setAuditLog([]);
  };

  // Resolve Overdraw (RULE-01)
  const resolveOverdraw = (violationId: string) => {
    // 1. Update ledger
    const updatedLedgers = clientLedgers.map(cl => {
      if (cl.id === 'CL-001') {
        const depositEntry: LedgerEntry = {
          id: `E-DEP-${Date.now()}`,
          date: '2026-06-24',
          description: 'Client deposit to clear ledger overdraw (Proactive check)',
          reference: 'DEP-PROACTIVE',
          debit: 0,
          credit: 3000,
          runningBalance: 500
        };
        return {
          ...cl,
          balance: 500,
          entries: [...cl.entries, depositEntry]
        };
      }
      return cl;
    });
    setClientLedgers(updatedLedgers);

    // 2. Resolve violation
    setViolations(violations.map(v => v.id === violationId ? { ...v, status: 'RESOLVED', actionTaken: 'Partner requested urgent client funds deposit of $3,000.00. Account is now positive (+$500.00).' } : v));
    
    // 3. Update check status if appropriate
    setAuditLog(prev => [...prev, `[${new Date().toISOString()}] CORRECTED overdraw for Auckland Commercial Developments Ltd. Balance is now +$500.`]);
    setActiveViolation(null);
  };

  // Resolve Dormant Estate Balance (RULE-02)
  const resolveDormancy = (violationId: string) => {
    // 1. Update ledger
    const updatedLedgers = clientLedgers.map(cl => {
      if (cl.id === 'CL-002') {
        return {
          ...cl,
          isDormant: false,
          dormancyDays: 0,
          lastActivityDate: '2026-06-24'
        };
      }
      return cl;
    });
    setClientLedgers(updatedLedgers);

    // 2. Resolve violation
    setViolations(violations.map(v => v.id === violationId ? { ...v, status: 'RESOLVED', actionTaken: 'Initiated trust return under LCA Reg 12. Unclaimed Money Act compliance log flagged. Notice dispatched to beneficiary.' } : v));
    setAuditLog(prev => [...prev, `[${new Date().toISOString()}] DISPATCHED dormancy notice for Sarah Jane Jenkins (Estate of) to commence regulatory refund.`]);
    setActiveViolation(null);
  };

  // Resolve ANZ Reconciliation mismatch (RULE-03)
  const resolveReconciliationDiscrepancy = (violationId: string) => {
    // 1. Post unposted bank line to ledger
    const updatedLedgers = clientLedgers.map(cl => {
      if (cl.id === 'CL-005') { // Wellington Retail
        const newEntry: LedgerEntry = {
          id: `E-POST-${Date.now()}`,
          date: '2026-06-22',
          description: 'Post unposted deposit from bank (DEP-JHNSTN)',
          reference: 'DEP-JHNSTN',
          debit: 0,
          credit: 1500,
          runningBalance: cl.balance + 1500
        };
        return {
          ...cl,
          balance: cl.balance + 1500,
          entries: [...cl.entries, newEntry]
        };
      }
      return cl;
    });
    setClientLedgers(updatedLedgers);

    // 2. Reconcile Bank line
    setBankLines(bankLines.map(bl => bl.id === 'BS-003' ? { ...bl, isReconciled: true, matchedLedgerEntryId: `E-POST-${Date.now()}` } : bl));

    // 3. Update trust account ledgerBalance to match bank
    setTrustAccounts(trustAccounts.map(ta => {
      if (ta.id === 'TA-ANZ-01') {
        return {
          ...ta,
          ledgerBalance: ta.bankBalance, // They now equal $512,450
          status: 'Reconciled'
        };
      }
      return ta;
    }));

    // 4. Resolve violation
    setViolations(violations.map(v => v.id === violationId ? { ...v, status: 'RESOLVED', actionTaken: 'Identified unposted deposit of $1,500.00. Posted corresponding client ledger receipt journal under Wellington Retail Group. Reconciliation discrepancy cleared.' } : v));
    setAuditLog(prev => [...prev, `[${new Date().toISOString()}] POSTED missing deposit journal of $1,500. ANZ Solicitor Trust Account balance is now fully 3-way reconciled.`]);
    setActiveViolation(null);
  };

  // Resolve Firm Interest in Trust holdover (RULE-04)
  const resolveFirmInterest = (violationId: string) => {
    // 1. Update ledger (clear firm commission)
    const updatedLedgers = clientLedgers.map(cl => {
      if (cl.id === 'CL-004') {
        const withdrawEntry: LedgerEntry = {
          id: `E-DRAW-${Date.now()}`,
          date: '2026-06-24',
          description: 'Draw commission to solicitor office bank account',
          reference: 'CHQ-OFFICE-83',
          debit: 350,
          credit: 0,
          runningBalance: 0
        };
        return {
          ...cl,
          balance: 0,
          entries: [...cl.entries, withdrawEntry]
        };
      }
      return cl;
    });
    setClientLedgers(updatedLedgers);

    // 2. Resolve violation
    setViolations(violations.map(v => v.id === violationId ? { ...v, status: 'RESOLVED', actionTaken: 'Drew $350.00 commission to office account via trust cheque/AP. Ledger cleared to $0.00, fully complying with 14-day holdover rules.' } : v));
    setAuditLog(prev => [...prev, `[${new Date().toISOString()}] CLEARED firm interest in trust. Drew $350.00 to solicitor business office bank account.`]);
    setActiveViolation(null);
  };

  // Resolve Unmatched Bank Line aging (RULE-05)
  const resolveAgedBankLine = (violationId: string) => {
    // 1. Reconcile line
    setBankLines(bankLines.map(bl => bl.id === 'BS-004' ? { ...bl, isReconciled: true } : bl));

    // 2. Resolve violation
    setViolations(violations.map(v => v.id === violationId ? { ...v, status: 'RESOLVED', actionTaken: 'Reclaimed aged bank levy charge of -$1,200.00 as a firm office disbursement. Reconciled and matched.' } : v));
    setAuditLog(prev => [...prev, `[${new Date().toISOString()}] MATCHED aged bank charge of -$1,200. Reclaimed as firm disbursement.`]);
    setActiveViolation(null);
  };

  // Automatically update general rule checks indicators when their respective violations are resolved
  useEffect(() => {
    const updatedChecks = checks.map(chk => {
      const relatedViolations = violations.filter(v => v.ruleId === chk.id && v.status === 'UNRESOLVED');
      return {
        ...chk,
        status: relatedViolations.length === 0 ? 'passed' as const : 'failed' as const,
        resultCount: relatedViolations.length
      };
    });
    setChecks(updatedChecks);
  }, [violations]);

  // Generate compliance evidence pack markup
  const generateMarkdownEvidencePack = () => {
    const unresolved = violations.filter(v => v.status === 'UNRESOLVED');
    const resolved = violations.filter(v => v.status === 'RESOLVED');

    return `
# TRUST ACCOUNT INTEGRITY EVIDENCE PACK (PROOF OF DILIGENCE)
**Generated Timestamp:** ${new Date().toISOString()}
**Account Supervisor Jurisdiction:** New Zealand (Lawyers and Conveyancers Act 2006)
**Principal Host Service:** Cloud Run (AI Studio Secured Environment)

---

## 1. EXECUTION SUMMARY
The Trust Accounting Integrity Engine performed a full deterministic sweep on raw database records.

*   **Total Trust Accounts Swept:** ${trustAccounts.length}
*   **Total Client Ledger Balances Checked:** $${totalClientLedgerBalances.toLocaleString('en-NZ', { minimumFractionDigits: 2 })} NZD
*   **Active Compliance Exceptions Found:** ${unresolved.length}
*   **Proactively Resolved Discrepancies:** ${resolved.length}

---

## 2. DETERMINISTIC 3-WAY RECONCILIATION
*   **ANZ Bank Statement Balance:** $${(anzAccount?.bankBalance || 0).toLocaleString('en-NZ', { minimumFractionDigits: 2 })} NZD
*   **Client Ledger Balances Sum:** $${totalClientLedgerBalances.toLocaleString('en-NZ', { minimumFractionDigits: 2 })} NZD
*   **Reconciliation Difference:** $${reconciledDiff.toLocaleString('en-NZ', { minimumFractionDigits: 2 })} NZD
*   **Reconciliation Status:** ${reconciledDiff === 0 ? '✅ RECONCILED' : '⚠️ DISCREPANCY DETECTED'}

---

## 3. ENGINE EXCEPTION LOGS (GROUNDED PROOF)
${violations.map(v => `
### [${v.severity}] ${v.ruleName}
*   **NZLS Reference:** ${v.nzLawSocietyRule}
*   **Evidence Grounding:** ${v.evidence}
*   **Current Status:** ${v.status}
*   **Resolution Audit:** ${v.actionTaken || 'No action taken yet.'}
`).join('\n')}

---

## 4. DILIGENCE TRAIL LOGS
${auditLog.map(log => `*   ${log}`).join('\n')}

---
**Verification Signature:**
\`SHA256: e873cfa8f321b0b74147055ffcf70c657a2bf62489028c2e6427389a9cf35cfd\`
**Trust Account Supervisor (TAS) Sign-off Field:** 
X ____________________________
`.trim();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">
          Trust Integrity Engine Prototype Sandbox
        </h2>
        <p className="mt-1 text-sm text-gray-500 max-w-3xl">
          Interact with a live representation of our compliance engine. Explore synthetic NZ law firm registers, run the rules to spot breaches, and apply audit corrections.
        </p>
      </div>

      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 border border-gray-200/50 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-gray-400 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-gray-900">Active DataSource: Synthetic NZ Trust Register</div>
            <div className="text-xxs text-gray-500 font-mono">5 client ledgers, 3 bank assets, 4 bank lines</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
          </button>

          <button
            disabled={engineExecuted || isExecuting}
            onClick={handleExecuteEngine}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              engineExecuted
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
            }`}
          >
            {isExecuting ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing ledger...
              </>
            ) : engineExecuted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Compliance Audited
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Run Compliance Engine
              </>
            )}
          </button>
        </div>
      </div>

      {!engineExecuted && !isExecuting && (
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-8 text-center max-w-xl mx-auto space-y-4">
          <ShieldAlert className="w-10 h-10 text-emerald-700 mx-auto" />
          <h3 className="text-base font-semibold text-gray-900 font-display">Simulate the Trust Integrity Run</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            The database currently holds synthetic transactions simulating New Zealand regulatory breaches. Click the "Run Compliance Engine" button above to evaluate deterministic filters against the database and surface exceptions.
          </p>
        </div>
      )}

      {(engineExecuted || isExecuting) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Register views and rule checklist */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 3-way Reconciliation Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xxs">
                <div className="text-xxs uppercase tracking-wider text-gray-400 font-semibold">ANZ Bank Cleared Balance</div>
                <div className="text-lg font-bold font-mono text-gray-900 mt-1">
                  ${(anzAccount?.bankBalance || 0).toLocaleString('en-NZ', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xxs text-gray-400 mt-1">ANZ Main Solicitor Trust</div>
              </div>

              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xxs">
                <div className="text-xxs uppercase tracking-wider text-gray-400 font-semibold">Total Client Ledger Sum</div>
                <div className="text-lg font-bold font-mono text-gray-900 mt-1">
                  ${totalClientLedgerBalances.toLocaleString('en-NZ', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xxs text-gray-400 mt-1">Sum of individual accounts</div>
              </div>

              <div className={`p-4 rounded-xl shadow-xxs border ${
                reconciledDiff === 0 
                  ? 'bg-emerald-50/40 border-emerald-100 text-emerald-900' 
                  : 'bg-rose-50/40 border-rose-100 text-rose-900'
              }`}>
                <div className="text-xxs uppercase tracking-wider text-gray-500 font-semibold">3-Way Discrepancy</div>
                <div className="text-lg font-bold font-mono mt-1">
                  ${reconciledDiff.toLocaleString('en-NZ', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xxs font-semibold mt-1">
                  {reconciledDiff === 0 ? '✅ Fully Reconciled' : '⚠️ OUT OF BALANCE'}
                </div>
              </div>
            </div>

            {/* Rules checklist indicators */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display border-b border-gray-50 pb-2">
                Evaluated Compliance Filters (LCA Regs)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {checks.map((chk) => (
                  <div key={chk.id} className="flex items-start gap-2.5 p-2 bg-gray-50/60 rounded-lg">
                    {chk.status === 'passed' ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-gray-800">{chk.name}</div>
                      <div className="text-xxs text-gray-400 font-mono mt-0.5">{chk.nzlsReference}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingestion Registers Tabs (Read-only representation of raw data) */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider font-display">
                  Live Client Trust Register
                </h3>
                <span className="text-xxs text-gray-400">All balances calculated via code</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-medium">
                      <th className="py-2">Client / Matter</th>
                      <th className="py-2">Matter Ref</th>
                      <th className="py-2 text-right">Dormancy</th>
                      <th className="py-2 text-right">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {clientLedgers.map((cl) => (
                      <tr key={cl.id} className="hover:bg-gray-50/40">
                        <td className="py-3 font-medium text-gray-900">{cl.clientName}</td>
                        <td className="py-3 text-gray-500 font-mono">{cl.matterReference}</td>
                        <td className="py-3 text-right font-mono text-gray-500">
                          {cl.dormancyDays > 0 ? `${cl.dormancyDays} days` : 'Active'}
                        </td>
                        <td className={`py-3 text-right font-mono font-semibold ${cl.balance < 0 ? 'text-rose-600' : 'text-gray-900'}`}>
                          ${cl.balance.toLocaleString('en-NZ', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bank feed register */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider font-display">
                  Raw Bank Statement Ingestion
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-medium">
                      <th className="py-2">Date</th>
                      <th className="py-2">Description</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bankLines.map((bl) => (
                      <tr key={bl.id} className="hover:bg-gray-50/40">
                        <td className="py-3 font-mono text-gray-500">{bl.date}</td>
                        <td className="py-3 text-gray-700 font-mono text-xxs">{bl.description}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-xxs font-medium ${
                            bl.isReconciled 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {bl.isReconciled ? 'Matched' : 'Unposted'}
                          </span>
                        </td>
                        <td className={`py-3 text-right font-mono font-semibold ${bl.amount < 0 ? 'text-gray-700' : 'text-emerald-700'}`}>
                          ${bl.amount.toLocaleString('en-NZ', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Violation feed & audit logs */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Active compliance alerts feed */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 shadow-xxs">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider font-display border-b border-gray-50 pb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4.5 h-4.5 text-rose-600" /> Active Exceptions Feed
              </h3>

              <div className="space-y-3">
                {violations.map((violation) => (
                  <button
                    key={violation.id}
                    onClick={() => setActiveViolation(violation)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 cursor-pointer flex justify-between items-start ${
                      activeViolation?.id === violation.id
                        ? 'border-emerald-600 bg-emerald-50/20 shadow-xxs'
                        : violation.status === 'RESOLVED'
                        ? 'border-gray-100 bg-gray-50/50 opacity-60'
                        : 'border-rose-100 hover:border-rose-200 bg-rose-50/20'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xxs font-medium px-1.5 py-0.5 rounded ${
                          violation.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : violation.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : violation.severity === 'WARNING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {violation.status === 'RESOLVED' ? 'Resolved' : violation.severity}
                        </span>
                        <span className="text-xxs text-gray-400 font-mono">{violation.nzLawSocietyRule.split(' ')[0]}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-gray-800">{violation.ruleName}</h4>
                      <p className="text-xxs text-gray-500 line-clamp-2 leading-relaxed">{violation.description}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Proactive Audit Log (Diligence path) */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider font-display border-b border-gray-50 pb-2 flex items-center gap-1.5">
                <History className="w-4.5 h-4.5 text-emerald-700" /> Proactive Diligence Logs
              </h3>
              <div className="h-40 overflow-y-auto border border-gray-50 rounded-lg p-2.5 bg-gray-50/40 text-xxs font-mono text-gray-600 space-y-2">
                {auditLog.map((log, idx) => (
                  <div key={idx} className="leading-relaxed border-b border-gray-100/30 pb-1 last:border-0">
                    {log}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowEvidencePack(true)}
                className="w-full py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4" /> View Evidence Pack (MD)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Slide-over Inspection Panel / Modal (For active violation inspection) */}
      {activeViolation && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <span className={`text-xxs font-semibold px-2 py-0.5 rounded ${
                    activeViolation.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {activeViolation.status === 'RESOLVED' ? 'Audit Clean' : 'Outstanding Discrepancy'}
                  </span>
                  <h3 className="text-lg font-display font-semibold text-gray-900 mt-1.5">
                    {activeViolation.ruleName}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveViolation(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-xs font-semibold cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xxs uppercase tracking-wider text-gray-400 font-semibold">NZ Law Society Regulation Reference</div>
                  <div className="text-sm font-semibold text-gray-800 mt-1 font-display">
                    {activeViolation.nzLawSocietyRule}
                  </div>
                </div>

                <div>
                  <div className="text-xxs uppercase tracking-wider text-gray-400 font-semibold">Detailed Exception Evidence</div>
                  <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100/50 mt-1 leading-relaxed font-mono">
                    {activeViolation.evidence}
                  </div>
                </div>

                {activeViolation.targetClientName && (
                  <div>
                    <div className="text-xxs uppercase tracking-wider text-gray-400 font-semibold">Associated Ledger Account</div>
                    <div className="text-xs font-medium text-gray-700 mt-1">
                      {activeViolation.targetClientName}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Proactive corrective action flow */}
            <div className="border-t border-gray-100 pt-6">
              {activeViolation.status === 'UNRESOLVED' ? (
                <div className="space-y-3">
                  <div className="text-xs text-gray-500 leading-relaxed bg-emerald-50/40 p-3 rounded-lg border border-emerald-100/40">
                    <strong>Integrity Action Required:</strong> In a live environment, the software notifies the partner with a single click. Click below to simulate the correction journal or notice dispatch.
                  </div>
                  {activeViolation.ruleId === 'RULE-01' && (
                    <button
                      onClick={() => resolveOverdraw(activeViolation.id)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" /> Clear Overdraw (Deposit $3,000.00 from client account)
                    </button>
                  )}
                  {activeViolation.ruleId === 'RULE-02' && (
                    <button
                      onClick={() => resolveDormancy(activeViolation.id)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" /> Dispatch Regulatory Dormancy Notice
                    </button>
                  )}
                  {activeViolation.ruleId === 'RULE-03' && (
                    <button
                      onClick={() => resolveReconciliationDiscrepancy(activeViolation.id)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" /> Post Missing Ledger Deposit Journal ($1,500.00)
                    </button>
                  )}
                  {activeViolation.ruleId === 'RULE-04' && (
                    <button
                      onClick={() => resolveFirmInterest(activeViolation.id)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" /> Draw $350.00 Commission to Business Office
                    </button>
                  )}
                  {activeViolation.ruleId === 'RULE-05' && (
                    <button
                      onClick={() => resolveAgedBankLine(activeViolation.id)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" /> Reclaim Bank Charge as Firm Disbursement
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Discrepancy Resolved
                  </div>
                  <div className="text-xxs text-emerald-800 leading-relaxed">
                    <strong>Action Audit Log:</strong> {activeViolation.actionTaken}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Evidence Pack Markdown Export Modal */}
      {showEvidencePack && (
        <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-gray-100 flex flex-col h-[85vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-display font-semibold text-gray-900">
                  Compliance Certification Evidence Pack (Markdown)
                </h3>
              </div>
              <button
                onClick={() => setShowEvidencePack(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-xs font-semibold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-900 text-gray-100 font-mono text-xs leading-relaxed rounded-b-xl select-all select-text">
              <pre className="whitespace-pre-wrap">{generateMarkdownEvidencePack()}</pre>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex justify-between items-center bg-gray-50 rounded-b-xl">
              <p className="text-xxs text-gray-500">
                You can select and copy the complete Markdown log. In production, this compiles to a PDF and logs cryptographically to the compliance ledger.
              </p>
              <button
                onClick={() => {
                  const element = document.createElement("a");
                  const file = new Blob([generateMarkdownEvidencePack()], {type: 'text/markdown'});
                  element.href = URL.createObjectURL(file);
                  element.download = `trust_integrity_evidence_pack_${Date.now()}.md`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors duration-200 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" /> Download Markdown
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
