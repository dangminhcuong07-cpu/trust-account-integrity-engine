// Plain-English wording for the engine's findings. The engine's evidence strings
// are written for logs (`ledger_total=$798,500.00 bank_balance=…`); a supervisor
// reads sentences. Every figure here is parsed from the evidence string, never typed.
import type { Finding } from './rules';

export const PLAIN_NAME: Record<string, string> = {
  R01: 'Client ledger below zero',
  R02: 'Balance left untouched',
  R03: 'Ledger and bank disagree',
  R04: 'Bank line with no ledger entry',
  R05: 'Entry left unreconciled',
  R06: 'Fee balance not transferred',
  R07: 'Fee with no invoice reference',
  R08: 'Invoice not in the register',
  R09: 'Fee larger than its invoice',
  R10: 'Invoice dated after the payment',
  R12: 'Deposit not allocated to clients',
  R13: 'Trust bank account overdrawn',
  R14: 'Certificate timing',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 2026-04-28 → 28 Apr 2026 */
export function fmtIso(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : iso;
}

/** -$2,500.00 → −$2,500.00 (a real minus sign) */
export const money = (s: string) => s.replace(/^-\$/, '−$');

/** The engine's own action wording (exception_report.py _RECOMMENDED_ACTION / _ACTION_TEXT). */
export const actionFor = (level: Finding['level']) =>
  level === 'critical'
    ? 'Escalate: investigate and resolve immediately, and give the Trust Account Supervisor a written explanation within 2 business days.'
    : 'Review.';

const get = (s: string, re: RegExp) => s.match(re)?.[1] ?? '';

export function plainEvidence(f: Finding): string {
  const e = f.evidence;
  const d = (re: RegExp) => fmtIso(get(e, re));
  switch (f.code) {
    case 'R01':
      return `Matter ${get(e, /matter (M\d+)/)} went to ${money(get(e, /balance (-?\$[\d,.]+)/))} after entry ${get(e, /entry (\w+)/)} on ${d(/dated (\d{4}-\d{2}-\d{2})/)}.`;
    case 'R02':
      return `${get(e, /balance (\$[\d,.]+)/)} has not moved since ${d(/last activity (\d{4}-\d{2}-\d{2})/)}: ${get(e, /open (\d+) days/)} days, against a limit of ${get(e, /threshold (\d+)/)}.`;
    case 'R03': {
      const bankMore = /bank exceeds ledger/.test(e);
      return `At ${d(/period (\d{4}-\d{2}-\d{2})/)} the ${bankMore ? 'bank held' : 'ledger showed'} ${get(e, /by (\$[\d,.]+)/)} more than the ${bankMore ? 'ledger' : 'bank'} (ledger ${get(e, /ledger_total=(\$[\d,.]+)/)}, bank ${get(e, /bank_balance=(\$[\d,.]+)/)}).`;
    }
    case 'R04':
      return `A ${get(e, /credit=(\$[\d,.]+)/)} credit on ${d(/\((\d{4}-\d{2}-\d{2})\)/)} has had no ledger entry for ${get(e, /open (\d+) days/)} days.`;
    case 'R05':
      return `Entry ${get(e, /entry (\w+)/)} on matter ${get(e, /matter (M\d+)/)} (${d(/dated (\d{4}-\d{2}-\d{2})/)}) is still unreconciled after ${get(e, /open (\d+) days/)} days, against a limit of ${get(e, /threshold (\d+)/)}.`;
    case 'R06':
      return `A ${get(e, /balance (\$[\d,.]+)/)} fee balance credited on ${d(/credited (\d{4}-\d{2}-\d{2})/)} should have moved to the office account within ${get(e, /threshold (\d+)/)} days; it has been ${get(e, /open (\d+) days/)}.`;
    case 'R07':
      return `${get(e, /payment=(\$[\d,.]+)/)} paid on matter ${get(e, /matter (M\d+)/)} for “${get(e, /description='([^']*)'/)}” has no invoice reference.`;
    case 'R08':
      return `${get(e, /payment=(\$[\d,.]+)/)} paid on matter ${get(e, /matter (M\d+)/)} cites invoice ${get(e, /reference='([^']*)'/)}, which is not in the invoice register.`;
    case 'R09':
      return `${get(e, /payment=(\$[\d,.]+)/)} was taken on matter ${get(e, /matter (M\d+)/)} against invoice ${get(e, /reference='([^']*)'/)} for ${get(e, /invoice amount (\$[\d,.]+)/)}.`;
    case 'R10':
      return `The payment on ${d(/payment dated (\d{4}-\d{2}-\d{2})/)} (matter ${get(e, /matter (M\d+)/)}) came before invoice ${get(e, /invoice '([^']*)'/)}, issued ${d(/issued (\d{4}-\d{2}-\d{2})/)}.`;
    case 'R12': {
      const credit = get(e, /credit=(\$[\d,.]+)/);
      const when = d(/\((\d{4}-\d{2}-\d{2})\)/);
      if (/zero allocations/.test(e)) return `A ${credit} deposit on ${when} is not allocated to any client.`;
      const sum = get(e, /allocations sum=(\$[\d,.]+)/);
      const rows = get(e, /\((\d+) rows\)/);
      return /over-allocated/.test(e)
        ? `A ${credit} deposit on ${when} has ${sum} allocated across ${rows} rows: more than it brought in.`
        : `A ${credit} deposit on ${when} has only ${sum} allocated, across ${rows} rows.`;
    }
    case 'R13':
      return `The trust bank account went to ${money(get(e, /balance (-?\$[\d,.]+)/))} after ${get(e, /entry (\w+)/)} on ${d(/dated (\d{4}-\d{2}-\d{2})/)}.`;
    default:
      return e;
  }
}

/** The matter a finding belongs to, if it has one. */
export const matterOf = (f: Finding) => f.evidence.match(/matter (M\d+)/)?.[1] ?? null;

/** Earliest and latest dates the findings mention: the sample's real span. */
export function findingSpan(findings: Finding[]): { from: string; to: string } {
  // Only the dates of entries and periods; R02's "last activity" date is history, not the sample's span.
  const re = /(?:dated|period|credited|\() ?(\d{4}-\d{2}-\d{2})/g;
  const dates = findings.flatMap(f => [...f.evidence.matchAll(re)].map(m => m[1])).sort();
  return { from: fmtIso(dates[0] ?? ''), to: fmtIso(dates[dates.length - 1] ?? '') };
}

// Every finding must get a full sentence: no empty slots from a regex that missed.
export const PLAIN_CHECK_FAILURES = (findings: Finding[]) =>
  findings.filter(f => { const t = plainEvidence(f); return t === f.evidence || /(\s\s|\s[.,:)]|\(\)|“”|for\s+days| on \.)/.test(t); });
