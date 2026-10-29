// A browser copy of one engine check (R01, overdrawn client ledger) so the
// overview can run it on amounts the visitor edits. The engine itself runs all
// checks in Python on the firm's computer; this is only the demonstration.

export interface Row { entry: string; matter: string; date: string; receipt: string; payment: string }
export interface Checked extends Row { balance: number | null }
export interface CheckResult { rows: Checked[]; findings: (Checked & { balance: number })[]; errors: string[]; ran: boolean }

// The engine's own sample rows for matters M016 and M022 (data/sample/client_ledger.csv).
export const SAMPLE_ROWS: Row[] = [
  { entry: 'L007', matter: 'M016', date: '2026-03-15', receipt: '95000.00', payment: '0.00' },
  { entry: 'L021', matter: 'M016', date: '2026-04-28', receipt: '0.00', payment: '97500.00' },
  { entry: 'L052', matter: 'M022', date: '2026-06-20', receipt: '3000.00', payment: '0.00' },
  { entry: 'L053', matter: 'M022', date: '2026-06-24', receipt: '0.00', payment: '4800.00' },
];

/** Accepts 97500, 97500.00 or 97,500.00. Anything else is unreadable: null. */
export function parseAmount(s: string): number | null {
  const t = s.trim().replace(/,(?=\d{3}(\D|$))/g, '');
  return /^\d+(\.\d{1,2})?$/.test(t) ? Number(t) : null;
}

export function checkRows(input: Row[]): CheckResult {
  const errors: string[] = [];
  input.forEach(r => {
    if (parseAmount(r.receipt) === null) errors.push(`${r.entry}: the receipt “${r.receipt}” is not a plain amount like 3000.00`);
    if (parseAmount(r.payment) === null) errors.push(`${r.entry}: the payment “${r.payment}” is not a plain amount like 97500.00`);
  });
  if (errors.length) return { rows: input.map(r => ({ ...r, balance: null })), findings: [], errors, ran: false };
  const balances = new Map<string, number>();
  const rows = [...input]
    .sort((a, b) => a.date.localeCompare(b.date) || a.entry.localeCompare(b.entry))
    .map(r => {
      const balance = Math.round(((balances.get(r.matter) ?? 0) + parseAmount(r.receipt)! - parseAmount(r.payment)!) * 100) / 100;
      balances.set(r.matter, balance);
      return { ...r, balance };
    });
  return { rows, findings: rows.filter((r): r is Checked & { balance: number } => (r.balance ?? 0) < 0), errors, ran: true };
}

export const nzd = (n: number) =>
  (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

console.assert(checkRows(SAMPLE_ROWS).findings.length === 2, "sample gives the engine's two R01 findings for M016 and M022");
console.assert(!checkRows([{ ...SAMPLE_ROWS[0], payment: '15/03/2026' }]).ran, 'unreadable input is not run, never a pass');
console.assert(parseAmount('97,500.00') === 97500 && parseAmount('$5') === null, 'amount parsing');
