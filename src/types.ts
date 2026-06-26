export interface TrustAccount {
  id: string;
  name: string;
  accountNumber: string;
  bankBalance: number;
  ledgerBalance: number;
  status: 'Reconciled' | 'Discrepancy' | 'Unchecked';
  lastReconciliationDate: string;
}

export interface ClientLedger {
  id: string;
  clientId: string;
  clientName: string;
  matterReference: string;
  accountNumber: string;
  balance: number;
  lastActivityDate: string;
  isDormant: boolean;
  dormancyDays: number;
  hasFirmInterest: boolean;
  entries: LedgerEntry[];
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  runningBalance: number;
}

export interface BankStatementLine {
  id: string;
  date: string;
  description: string;
  reference: string;
  amount: number;
  isReconciled: boolean;
  matchedLedgerEntryId?: string;
}

export interface RuleViolation {
  id: string;
  ruleId: string;
  ruleName: string;
  nzLawSocietyRule: string; // LCA (Lawyers & Conveyancers Act) or NZLS Trust Account Rules reference
  severity: 'CRITICAL' | 'WARNING' | 'NOTICE';
  description: string;
  evidence: string;
  sourceRecordId: string;
  sourceRecordType: string;  // engine emits snake_case: "client_ledger", "bank_statement", etc.
  targetClientName?: string;
  status: 'UNRESOLVED' | 'RESOLVED' | 'MUTED';
  actionTaken?: string | null;
  dateIdentified: string;
}

export interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  nzlsReference: string;
  status: 'passed' | 'failed' | 'warning';
  resultCount: number;
}

export interface CostCalculationInput {
  numberOfAccounts: number;
  numberOfTransactions: number;
  partnerHourlyRate: number;
  manualAuditHoursPerMonth: number;
  tier: 'basic' | 'professional' | 'enterprise';
}

export interface CostCalculationOutput {
  timeSavedHours: number;
  annualTimeSavingsValue: number;
  riskMitigationValue: number;
  estimatedSubscriptionCost: number;
  netAnnualROI: number;
  roiPercentage: number;
}
