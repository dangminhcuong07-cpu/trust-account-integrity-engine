// A browser copy of one engine check (R01, overdrawn client ledger) so the
// landing page can run it on rows the visitor edits. The engine itself runs all
// checks in Python on the firm's computer; this is only the demonstration.

export interface LedgerRow { entry: string; matter: string; date: string; receipt: number; payment: number; }
export interface R01Result { rows: (LedgerRow & { balance: number })[]; findings: { entry: string; matter: string; date: string; balance: number }[]; errors: string[]; }

// The engine's own sample rows for matters M016 and M022 (data/sample/client_ledger.csv).
export const SAMPLE_ROWS = `entry,matter,date,receipt,payment
L007,M016,2026-03-15,95000.00,0.00
L021,M016,2026-04-28,0.00,97500.00
L052,M022,2026-06-20,3000.00,0.00
L053,M022,2026-06-24,0.00,4800.00`;

export function runR01(csv: string): R01Result {
  const errors: string[] = [];
  const parsed: LedgerRow[] = [];
  csv.trim().split(/\r?\n/).slice(1).forEach((line, i) => {
    if (!line.trim()) return;
    const [entry, matter, date, receipt, payment] = line.split(',').map(s => s.trim());
    const r = Number(receipt), p = Number(payment);
    if (!entry || !matter || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') || Number.isNaN(r) || Number.isNaN(p)) {
      errors.push(`Row ${i + 2} needs entry, matter, YYYY-MM-DD date, receipt and payment`);
      return;
    }
    parsed.push({ entry, matter, date, receipt: r, payment: p });
  });
  const balances = new Map<string, number>();
  const rows = [...parsed]
    .sort((a, b) => a.date.localeCompare(b.date) || a.entry.localeCompare(b.entry))
    .map(row => {
      const balance = Math.round(((balances.get(row.matter) ?? 0) + row.receipt - row.payment) * 100) / 100;
      balances.set(row.matter, balance);
      return { ...row, balance };
    });
  const findings = rows.filter(r => r.balance < 0).map(({ entry, matter, date, balance }) => ({ entry, matter, date, balance }));
  return { rows, findings, errors };
}

export const nzd = (n: number) =>
  (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

console.assert(runR01(SAMPLE_ROWS).findings.length === 2, 'sample gives the engine\'s two R01 findings for M016 and M022');
