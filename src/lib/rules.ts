// Presentation metadata for the engine's checks. Names, citations, results and
// counts come from the engine-generated data.ts; this file only groups them and
// gives each a short citation for tight spaces. Never type a rule count here.
import { complianceChecks, violations } from '../data';
import type { ComplianceCheck, RuleViolation } from '../types';

export const LCA_URL = 'https://www.legislation.govt.nz/regulation/public/2008/0183/latest/whole.html';
export const NZLS_URL = 'https://www.lawsociety.org.nz/assets/Professional-practice-docs/Rules-and-Guidelines/Trust-Accounting-Guidelines-2024.pdf';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/michael-dang-964622193/';

export type GroupId = 'balances' | 'reconciliation' | 'fees' | 'old';

export const GROUPS: { id: GroupId; label: string; note: string; rules: string[] }[] = [
  { id: 'balances', label: 'Balances', note: 'Money held for each client', rules: ['R01', 'R13', 'R12'] },
  { id: 'reconciliation', label: 'Reconciliation', note: 'Ledger against the bank', rules: ['R03', 'R04', 'R05', 'R14'] },
  { id: 'fees', label: 'Fees from trust', note: 'Invoices behind every fee', rules: ['R07', 'R08', 'R09', 'R10'] },
  { id: 'old', label: 'Old money', note: 'Balances that sat too long', rules: ['R02', 'R06'] },
];

const SHORT_CITATION: Record<string, string> = {
  R01: 'Reg 6, Reg 12(6)(a)',
  R02: 'Reg 12(7); NZLS guidelines',
  R03: 'Reg 17 with Reg 11',
  R04: 'Reg 11',
  R05: 'Reg 11, Reg 17',
  R06: 'LCA 2006 s110; Reg 8, Reg 9',
  R07: 'Reg 9',
  R08: 'Reg 9',
  R09: 'Internal control',
  R10: 'Reg 9',
  R12: 'Reg 12(1)(b), Reg 11',
  R13: 'Reg 6',
  R14: 'Reg 14',
};

export type Severity = 'critical' | 'high';

export interface Check extends ComplianceCheck {
  code: string;            // "R01"
  short: string;           // short citation
  severity: Severity;
  group: GroupId;
  sourceUrl: string | null;
}

// Severity comes from the engine's findings. A check with no findings in this run
// (only R14, which did not run) shows as high: the engine's level for it.
const severityOf = (code: string): Severity =>
  violations.some(v => v.ruleId.startsWith(code) && v.severity === 'CRITICAL') ? 'critical' : 'high';

export function sourceUrl(citation: string): string | null {
  if (citation.startsWith('Internal control') || citation.includes('no direct statutory basis')) return null;
  if (citation.includes('LTAG') || citation.includes('(guidance)')) return NZLS_URL;
  return LCA_URL;
}

export const CHECKS: Check[] = complianceChecks.map(c => {
  const code = c.id.slice(0, 3);
  return {
    ...c,
    code,
    short: SHORT_CITATION[code] ?? c.nzlsReference,
    severity: severityOf(code),
    group: GROUPS.find(g => g.rules.includes(code))?.id ?? 'balances',
    sourceUrl: sourceUrl(c.nzlsReference),
  };
});

export const STATUTORY_COUNT = CHECKS.filter(c => c.sourceUrl !== null).length;
export const NOT_RUN = CHECKS.filter(c => c.status === 'not_evaluated');

export interface Finding extends RuleViolation {
  code: string;
  level: Severity;
  short: string;
  url: string | null;
}

export const FINDINGS: Finding[] = violations
  .map(v => {
    const code = v.ruleId.slice(0, 3);
    return { ...v, code, level: (v.severity === 'CRITICAL' ? 'critical' : 'high') as Severity, short: SHORT_CITATION[code] ?? v.nzLawSocietyRule, url: sourceUrl(v.nzLawSocietyRule) };
  })
  .sort((a, b) => (a.level === b.level ? a.code.localeCompare(b.code) || a.sourceRecordId.localeCompare(b.sourceRecordId) : a.level === 'critical' ? -1 : 1));

export const checkName = (code: string) => CHECKS.find(c => c.code === code)?.name ?? code;

// The engine writes "−" as "-$" and a few em dashes; tidy them for reading.
export const tidy = (s: string) => s.replace(/-\$/g, '−$').replace(/ — /g, '; ').replace(/ - /g, '; ');

console.assert(FINDINGS.length === violations.length, 'every finding is shown');
console.assert(
  CHECKS.reduce((n, c) => n + (c.status === 'not_evaluated' ? 0 : c.resultCount), 0) === violations.length,
  'check counts add up to the findings',
);
