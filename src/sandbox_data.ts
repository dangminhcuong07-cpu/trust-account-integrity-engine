import { TrustAccount, ClientLedger, BankStatementLine, RuleViolation } from './types';

// ── Sandbox initial state ──────────────────────────────────────────────────

export const initialTrustAccounts: TrustAccount[] = [
  {
    id: 'TA-ANZ-01',
    name: 'ANZ Main Solicitor Trust Account',
    accountNumber: '01-0240-0123456-00',
    bankBalance: 512450,
    ledgerBalance: 510950,
    status: 'Discrepancy',
    lastReconciliationDate: '2026-05-31'
  },
  {
    id: 'TA-ANZ-02',
    name: 'ANZ FIT (Firm Interest in Trust) Account',
    accountNumber: '01-0240-0123456-01',
    bankBalance: 125000,
    ledgerBalance: 125000,
    status: 'Reconciled',
    lastReconciliationDate: '2026-05-31'
  },
  {
    id: 'TA-BNZ-01',
    name: 'BNZ Solicitor Trust Account',
    accountNumber: '02-0100-0654321-00',
    bankBalance: 45000,
    ledgerBalance: 45000,
    status: 'Reconciled',
    lastReconciliationDate: '2026-05-31'
  }
];

// Client ledger balances sum to $510,950 — $1,500 short of ANZ bank balance
export const initialClientLedgers: ClientLedger[] = [
  {
    id: 'CL-001',
    clientId: 'C-101',
    clientName: 'Auckland Commercial Developments Ltd',
    matterReference: 'M016',
    accountNumber: 'TA-ANZ-01/CL-001',
    balance: -2500,
    lastActivityDate: '2026-04-28',
    isDormant: false,
    dormancyDays: 0,
    hasFirmInterest: false,
    entries: [
      {
        id: 'L018',
        date: '2026-03-01',
        description: 'Receipt - Purchase deposit from Auckland Commercial',
        reference: 'REC-AUCDEV',
        debit: 0,
        credit: 95000,
        runningBalance: 95000
      },
      {
        id: 'L021',
        date: '2026-04-28',
        description: "Payment - Settlement disbursement to vendor's solicitors",
        reference: '',
        debit: 97500,
        credit: 0,
        runningBalance: -2500
      }
    ]
  },
  {
    id: 'CL-002',
    clientId: 'C-102',
    clientName: 'Sarah Jane Jenkins (Estate of)',
    matterReference: 'M017',
    accountNumber: 'TA-ANZ-01/CL-002',
    balance: 8500,
    lastActivityDate: '2024-12-15',
    isDormant: true,
    dormancyDays: 558,
    hasFirmInterest: false,
    entries: [
      {
        id: 'L005',
        date: '2024-10-01',
        description: 'Receipt - Estate distribution held in trust',
        reference: 'EST-JENK-01',
        debit: 0,
        credit: 8500,
        runningBalance: 8500
      }
    ]
  },
  {
    id: 'CL-003',
    clientId: 'C-103',
    clientName: 'Smith & Brown Family Trust',
    matterReference: 'M003',
    accountNumber: 'TA-ANZ-01/CL-003',
    balance: 380000,
    lastActivityDate: '2026-06-10',
    isDormant: false,
    dormancyDays: 0,
    hasFirmInterest: false,
    entries: [
      {
        id: 'L009',
        date: '2026-03-28',
        description: 'Receipt - Purchase price held in trust',
        reference: 'REF-SMB-021',
        debit: 0,
        credit: 420000,
        runningBalance: 420000
      },
      {
        id: 'L011',
        date: '2026-05-15',
        description: 'Payment - Disbursement to beneficiary J. Williams',
        reference: '',
        debit: 40000,
        credit: 0,
        runningBalance: 380000
      }
    ]
  },
  {
    id: 'CL-004',
    clientId: 'C-104',
    clientName: 'Firm Commission Account (FIT)',
    matterReference: 'M-FIT',
    accountNumber: 'TA-ANZ-01/CL-004',
    balance: 350,
    lastActivityDate: '2026-05-02',
    isDormant: false,
    dormancyDays: 0,
    hasFirmInterest: true,
    entries: [
      {
        id: 'L030',
        date: '2026-05-02',
        description: 'Credit - Firm commission on trust interest (April 2026)',
        reference: 'INT-APR-2026',
        debit: 0,
        credit: 350,
        runningBalance: 350
      }
    ]
  },
  {
    id: 'CL-005',
    clientId: 'C-105',
    clientName: 'Wellington Retail Group',
    matterReference: 'M008',
    accountNumber: 'TA-ANZ-01/CL-005',
    balance: 124600,
    lastActivityDate: '2026-06-01',
    isDormant: false,
    dormancyDays: 0,
    hasFirmInterest: false,
    entries: [
      {
        id: 'L025',
        date: '2026-04-15',
        description: 'Receipt - Lease deposit from Wellington Retail Group',
        reference: 'REC-WRG-01',
        debit: 0,
        credit: 124600,
        runningBalance: 124600
      }
    ]
  }
];

export const initialBankStatements: BankStatementLine[] = [
  {
    id: 'BS-001',
    date: '2026-03-01',
    description: 'Credit - Auckland Commercial purchase deposit (AUCDEV)',
    reference: 'REC-AUCDEV',
    amount: 95000,
    isReconciled: true,
    matchedLedgerEntryId: 'L018'
  },
  {
    id: 'BS-002',
    date: '2026-04-15',
    description: 'Credit - Wellington Retail lease deposit (WRG-01)',
    reference: 'REC-WRG-01',
    amount: 124600,
    isReconciled: true,
    matchedLedgerEntryId: 'L025'
  },
  {
    id: 'BS-003',
    date: '2026-06-01',
    description: 'Credit - Wellington Retail supplemental deposit (DEP-JHNSTN)',
    reference: 'DEP-JHNSTN',
    amount: 1500,
    isReconciled: false
  },
  {
    id: 'BS-004',
    date: '2026-04-28',
    description: 'Debit - Bank levy charge (transaction fees Apr 2026)',
    reference: 'BANK-LEVY-APR',
    amount: -1200,
    isReconciled: false
  }
];

export const initialRuleViolations: RuleViolation[] = [
  {
    id: 'V-001',
    ruleId: 'RULE-01',
    ruleName: 'Overdrawn Client Ledger',
    nzLawSocietyRule: 'LCA (Trust Account) Regulations 2008, Reg 12(6)(a)',
    severity: 'CRITICAL',
    description: 'Auckland Commercial Developments Ltd (M016) has a negative balance of -$2,500.00. Client funds must not fall below zero.',
    evidence: 'CL-001 running balance: -$2,500.00 NZD after disbursement L021 on 2026-04-28.',
    sourceRecordId: 'CL-001',
    sourceRecordType: 'ClientLedger',
    targetClientName: 'Auckland Commercial Developments Ltd',
    status: 'UNRESOLVED',
    dateIdentified: '2026-06-26'
  },
  {
    id: 'V-002',
    ruleId: 'RULE-02',
    ruleName: 'Dormant Balance — no activity exceeds threshold',
    nzLawSocietyRule: 'NZLS Trust Accounting Guidelines 2024, s4.3',
    severity: 'WARNING',
    description: 'Sarah Jane Jenkins (Estate of) (M017) has held $8,500.00 with no activity for 558 days, exceeding the 365-day threshold.',
    evidence: 'CL-002 last activity: 2024-12-15 — 558 days ago. Balance: $8,500.00 NZD.',
    sourceRecordId: 'CL-002',
    sourceRecordType: 'ClientLedger',
    targetClientName: 'Sarah Jane Jenkins (Estate of)',
    status: 'UNRESOLVED',
    dateIdentified: '2026-06-26'
  },
  {
    id: 'V-003',
    ruleId: 'RULE-03',
    ruleName: 'Reconciliation break — ledger does not equal bank balance',
    nzLawSocietyRule: 'LCA (Trust Account) Regulations 2008, Reg 12(1)',
    severity: 'CRITICAL',
    description: 'ANZ Main Trust bank balance ($512,450.00) exceeds total client ledger sum ($510,950.00) by $1,500.00. An unposted bank line exists.',
    evidence: 'Bank: $512,450.00 NZD. Ledger sum: $510,950.00 NZD. Unposted line BS-003: +$1,500.00 (DEP-JHNSTN).',
    sourceRecordId: 'TA-ANZ-01',
    sourceRecordType: 'Account',
    targetClientName: 'Wellington Retail Group',
    status: 'UNRESOLVED',
    dateIdentified: '2026-06-26'
  },
  {
    id: 'V-004',
    ruleId: 'RULE-04',
    ruleName: 'FIT balance held beyond transfer deadline',
    nzLawSocietyRule: 'NZLS Trust Accounting Guidelines 2024 / PS-2 (eff. 1 Jan 2026)',
    severity: 'WARNING',
    description: 'Firm commission of $350.00 has been held in trust for 54 days, exceeding the 14-day transfer deadline under PS-2.',
    evidence: 'CL-004 firm interest credit $350.00 posted 2026-05-02 — 54 days in trust (threshold: 14 days).',
    sourceRecordId: 'CL-004',
    sourceRecordType: 'ClientLedger',
    targetClientName: 'Firm Commission Account (FIT)',
    status: 'UNRESOLVED',
    dateIdentified: '2026-06-26'
  },
  {
    id: 'V-005',
    ruleId: 'RULE-05',
    ruleName: 'Unmatched bank line exceeds age threshold',
    nzLawSocietyRule: 'LCA (Trust Account) Regulations 2008, Reg 12(1)',
    severity: 'WARNING',
    description: 'Bank debit of -$1,200.00 (bank levy charge) has remained unreconciled for 59 days, exceeding the 5-day threshold.',
    evidence: 'BS-004 debit: -$1,200.00 NZD dated 2026-04-28. 59 days unreconciled. No matching ledger entry.',
    sourceRecordId: 'BS-004',
    sourceRecordType: 'BankLine',
    status: 'UNRESOLVED',
    dateIdentified: '2026-06-26'
  }
];

// ── Workflow Designer data ─────────────────────────────────────────────────

export const complianceWorkflows = [
  {
    phase: 'Day 1',
    title: 'Automated Data Ingestion',
    description: 'Bank statement feeds (CSV/OFX) and internal ledger exports are ingested nightly via a scheduled parser, normalising all entries into a canonical schema.',
    action: 'Every transaction is timestamped, hashed, and written to an append-only audit log. No manual data entry required.'
  },
  {
    phase: 'Day 2–5',
    title: 'Deterministic Rules Sweep',
    description: 'The compliance engine evaluates all 7 rule filters against the ingested data — overdraw detection, dormancy checks, 3-way reconciliation, unmatched bank lines, FIT holdover, and invoice references.',
    action: 'Each violation is grounded with evidence (record ID, amount, date, regulation citation) and written to the violations register with UNRESOLVED status.'
  },
  {
    phase: 'Day 5–15',
    title: 'Partner Exception Review',
    description: 'The TAS (Trust Account Supervisor) reviews the exception feed via the dashboard. Each item links directly to the source record, reducing investigation time from hours to minutes.',
    action: 'Corrective actions are logged against the violation. Resolved items are time-stamped and attributed to the reviewing partner for the statutory audit trail.'
  },
  {
    phase: 'Day 25–28',
    title: 'Month-End Reconciliation Lock',
    description: 'The engine performs a final 3-way reconciliation sweep (bank statement ↔ client ledgers ↔ trust account balance). A pass/fail report is auto-generated per account.',
    action: 'A signed PDF evidence pack is produced, satisfying LCA Reg 12(1) monthly reconciliation requirements. Ready for statutory auditor delivery.'
  },
  {
    phase: 'Annual',
    title: 'Statutory Audit Package Export',
    description: 'At year-end, the engine compiles a complete compliance archive — all reconciliations, violation logs, resolution audit trails, and partner sign-offs — into a structured export.',
    action: 'Delivered as a cryptographically signed package to the NZLS-appointed auditor, replacing weeks of manual binder preparation.'
  }
];

export const billingWorkflows = [
  {
    step: 1,
    title: 'Disbursement Event Trigger',
    description: 'Every client disbursement processed through the system automatically triggers a compliance fee calculation. The firm sets a per-transaction fee in the admin panel.',
    details: 'The engine captures the disbursement record, calculates the compliance levy, and queues it for the monthly billing run without any manual touch.'
  },
  {
    step: 2,
    title: 'Invoice Generation & Tax Compliance',
    description: 'A GST-compliant invoice (15% NZ GST) is auto-generated per billing period, itemised by disbursement type and matter reference.',
    details: 'Invoices reference the applicable LCA regulation for each compliance action performed, creating a defensible paper trail that justifies the charge to clients.'
  },
  {
    step: 3,
    title: 'Cost-Neutral Offset to Client',
    description: 'The firm passes the compliance levy to the relevant client matter ledger as a disbursement charge, making the integrity engine cost-neutral or profit-positive for the firm.',
    details: 'The disbursement is posted directly to the matter ledger with a regulation reference (e.g., "Trust compliance sweep — LCA Reg 12"), ensuring audit-proof justification.'
  },
  {
    step: 4,
    title: 'Subscription Fee Reconciliation',
    description: 'The monthly subscription fee is deducted against the aggregated compliance levies collected. Any surplus flows to the firm as net profit from compliance services.',
    details: 'A monthly P&L summary is available in the admin dashboard, showing the subscription cost, total levies collected, and net margin per billing period.'
  }
];

// ── Strategic Brief data ───────────────────────────────────────────────────

export const productsData = [
  {
    badge: 'Core Engine',
    title: 'Trust Integrity Engine',
    description: 'The foundational compliance product. Connects to bank feeds and practice management systems to run nightly deterministic sweeps across all trust accounts.',
    features: [
      '7-rule compliance filter suite (overdraw, dormancy, reconciliation, FIT, invoice, unmatched lines)',
      'Real-time 3-way reconciliation dashboard',
      'Automated violation register with evidence grounding',
      'Partner sign-off workflow and audit trail export'
    ],
    pricing: 'NZD $500–$800/mo'
  },
  {
    badge: 'Professional',
    title: 'Compliance Evidence Suite',
    description: 'Extends the core engine with monthly statutory compliance packages ready for NZLS auditor submission, reducing annual audit preparation from weeks to hours.',
    features: [
      'Auto-generated signed PDF reconciliation reports',
      'Annual statutory audit archive export (cryptographically signed)',
      'NZLS Inspectorate-ready evidence packs',
      'Multi-entity support (multiple trust accounts)'
    ],
    pricing: 'NZD $1,000–$1,500/mo'
  },
  {
    badge: 'Enterprise',
    title: 'Practice Intelligence Layer',
    description: 'AI-assisted anomaly detection layered on top of the rules engine, surfacing unusual patterns that deterministic rules alone cannot catch.',
    features: [
      'Anomaly scoring on transaction velocity and counterparty patterns',
      'Partner workload and compliance KPI dashboards',
      'Integration with Xero, MYOB, and popular NZ practice management tools',
      'Dedicated implementation and onboarding support'
    ],
    pricing: 'NZD $2,500+/mo'
  }
];

export const marketingChannels = [
  {
    target: 'NZLS Continuing Legal Education (CLE) Sponsorship',
    strategy: 'Sponsor trust accounting CPD sessions delivered to TAS-designated partners. Live demo of the engine during the session converts directly to trial sign-ups from the most compliance-anxious audience.',
    reach: '500–1,000 qualified TAS partners per year across Auckland, Wellington, Christchurch'
  },
  {
    target: 'Conveyancing Practice Management Forums',
    strategy: 'Partner with NZ conveyancing software vendors (LEAP, Actionstep) to offer the engine as an add-on integration. Co-marketing to their existing customer base.',
    reach: 'Access to 800+ NZ conveyancing practices already using practice management software'
  },
  {
    target: 'Direct Outreach to NZLS Inspectorate Findings',
    strategy: 'NZLS publishes annual inspectorate finding summaries listing common violation categories. Targeted cold outreach to practices in high-risk categories with a free 30-day compliance scan.',
    reach: 'High-intent outreach — firms already aware of compliance risk, low sales friction'
  },
  {
    target: 'Accounting Software Referral Partnerships',
    strategy: 'Build a referral channel with NZ accounting firms that audit legal trust accounts. They refer clients for ongoing monitoring; the engine provides them structured data for their annual audit work.',
    reach: 'Top 20 NZ accounting firms cover ~60% of SME legal trust audits nationally'
  }
];

export const feasibilityHardTruths = [
  {
    type: 'Legal Risk',
    status: 'Non-Negotiable',
    title: 'Liability Disclaimers Are Essential',
    desc: 'The engine flags violations — it does not provide legal advice. Terms of service must explicitly disclaim that the software output is not a substitute for qualified legal or accounting judgment. A missed violation that results in an NZLS disciplinary action could expose the vendor to negligence claims without airtight contractual protection.'
  },
  {
    type: 'Technical Risk',
    status: 'High Priority',
    title: 'Bank Feed Integration Complexity',
    desc: 'NZ banks (ANZ, BNZ, Westpac, ASB) do not offer unified open banking APIs. Real-time feeds require either Akahu (NZ open finance aggregator) or client-side CSV/OFX export workflows. The MVP should accept CSV imports; direct bank integration is a Phase 2 feature.'
  },
  {
    type: 'Market Risk',
    status: 'Manageable',
    title: 'Incumbent Practice Software Resistance',
    desc: 'Large practice management vendors (LEAP, Actionstep) have basic trust accounting modules. Positioning must emphasize continuous monitoring vs. point-in-time reconciliation — a differentiated capability these incumbents do not offer.'
  },
  {
    type: 'Regulatory Risk',
    status: 'Manageable',
    title: 'NZLS Rule Changes Require Rapid Engine Updates',
    desc: 'Trust accounting regulations evolve. The rules engine must be parameterised (not hard-coded) so new or amended regulations can be deployed within days of NZLS guidance updates. A regulatory update SLA should be included in enterprise contracts.'
  },
  {
    type: 'Revenue Risk',
    status: 'High Priority',
    title: 'SME Budget Sensitivity',
    desc: 'Boutique law firms operate on tight margins. The cost-neutral billing model (passing compliance levies to clients as disbursements) must be demonstrated concretely in the sales process. Firms need to see that the subscription pays for itself before signing.'
  },
  {
    type: 'Competitive Risk',
    status: 'Manageable',
    title: 'First-Mover Window Is Limited',
    desc: 'No NZ-specific trust compliance SaaS product currently dominates the market. However, Australian RegTech vendors (e.g., GlobalX, InfoTrack) are expanding into NZ. The first 18 months are critical to establishing reference customers and NZLS relationships before offshore competition arrives.'
  }
];
