// Certificate due dates, the same way the engine's R14 computes them:
// the 10th working day of the month after the period, or the 15th working day
// of January for the December certificate. Working days are Monday to Friday;
// public holidays are not skipped (R14 has the same simplification).

const isWorkingDay = (d: Date) => d.getDay() !== 0 && d.getDay() !== 6;

export function nthWorkingDay(year: number, month: number, n: number): Date {
  const d = new Date(year, month, 1);
  let count = isWorkingDay(d) ? 1 : 0;
  while (count < n) {
    d.setDate(d.getDate() + 1);
    if (isWorkingDay(d)) count += 1;
  }
  return d;
}

/** The deadline for the certificate covering `periodMonth` (0-11) of `periodYear`. */
export function certificateDue(periodYear: number, periodMonth: number): Date {
  const y = periodMonth === 11 ? periodYear + 1 : periodYear;
  const m = (periodMonth + 1) % 12;
  return nthWorkingDay(y, m, m === 0 ? 15 : 10);
}

export interface NextCertificate {
  period: Date;        // first day of the month the certificate covers
  due: Date;
  workingDaysLeft: number; // counting today if it is a working day, and the due day
}

export function nextCertificate(today: Date): NextCertificate {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // The certificate for last month is still open until its due date.
  let period = new Date(t.getFullYear(), t.getMonth() - 1, 1);
  let due = certificateDue(period.getFullYear(), period.getMonth());
  if (t > due) {
    period = new Date(t.getFullYear(), t.getMonth(), 1);
    due = certificateDue(period.getFullYear(), period.getMonth());
  }
  let left = 0;
  for (const d = new Date(t); d <= due; d.setDate(d.getDate() + 1)) if (isWorkingDay(d)) left += 1;
  return { period, due, workingDaysLeft: left };
}

export const fmtDay = (d: Date) =>
  d.toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long' });
export const fmtMonth = (d: Date) => d.toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' });

// Known values, checked on load (dev console).
console.assert(certificateDue(2026, 9).toDateString() === new Date(2026, 10, 13).toDateString(), 'Oct 2026 due Fri 13 Nov');
console.assert(certificateDue(2026, 11).toDateString() === new Date(2027, 0, 21).toDateString(), 'Dec 2026 due Thu 21 Jan');
