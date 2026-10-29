import { useMemo, useRef, useState } from 'react';
import { reportSummary } from '../data';
import { CHECKS, FINDINGS, LINKEDIN_URL, NOT_RUN, checkName, type Finding } from '../lib/rules';
import { PLAIN_NAME, actionFor, findingSpan, fmtIso, matterOf, money, plainEvidence } from '../lib/plain';

type Filter = 'all' | 'critical' | 'high';
const keyOf = (f: Finding) => `${f.code}-${f.sourceRecordId}`;
const SPAN = findingSpan(FINDINGS);
const COUNTS = { all: FINDINGS.length, critical: FINDINGS.filter(f => f.level === 'critical').length, high: FINDINGS.filter(f => f.level === 'high').length };
const LABEL: Record<Filter, string> = { all: 'All', critical: 'Critical', high: 'High' };

const levelPill = (l: Finding['level'], n?: number) =>
  <span className={`pill pill--${l === 'critical' ? 'crit' : 'high'}`}>{n !== undefined ? `${n} ${l}` : l === 'critical' ? 'Critical' : 'High'}</span>;

// The screen's one finding, computed from the R01 rows: how many client ledgers
// went below zero, and the deepest balance.
function overdrawn() {
  const r01 = FINDINGS.filter(f => f.code === 'R01').map(f => ({
    matter: matterOf(f) ?? '',
    bal: Number((f.evidence.match(/balance (-?)\$([\d,.]+)/)?.slice(1).join('') ?? '0').replace(/,/g, '')),
    date: f.evidence.match(/dated (\d{4}-\d{2}-\d{2})/)?.[1] ?? '',
  }));
  const deepest = r01.reduce((a, b) => (b.bal < a.bal ? b : a), r01[0]);
  return { count: new Set(r01.map(r => r.matter)).size, deepest };
}

export default function EngineResults({ focus }: { focus?: string }) {
  const [filter, setFilter] = useState<Filter>('all');
  const shown = useMemo(() => FINDINGS.filter(f => filter === 'all' || f.level === filter), [filter]);
  const [selected, setSelected] = useState<string>(() => (FINDINGS.some(f => keyOf(f) === focus) ? focus! : keyOf(FINDINGS[0])));
  // The detail always shows a finding that is in the list as filtered.
  const current = shown.find(f => keyOf(f) === selected) ?? shown[0];
  const listRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  const narrow = () => window.matchMedia('(max-width: 1080px)').matches;
  const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth') as ScrollBehavior;

  const groups = useMemo(() => {
    const m = new Map<string, Finding[]>();
    shown.forEach(f => m.set(f.code, [...(m.get(f.code) ?? []), f]));
    return [...m.entries()];
  }, [shown]);

  const select = (f: Finding) => {
    setSelected(keyOf(f));
    if (narrow()) requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: smooth(), block: 'start' }));
  };
  const od = overdrawn();
  const ran = CHECKS.length - NOT_RUN.length;
  const fmtNzd = (n: number) => (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-NZ', { minimumFractionDigits: 2 });

  return (
    <div className="ap-col">
      <div className="ap-title">
        <div>
          <h1>Exception report</h1>
          <p>Synthetic sample firm · entries {SPAN.from} to {SPAN.to} · {reportSummary.sensitivity} sensitivity</p>
        </div>
        <div className="ap-actions">
          <a className="ap-btn ap-btn--line" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">Talk to me about it</a>
          <a className="ap-btn" href="/exception_report.pdf" download>Download the PDF</a>
        </div>
      </div>

      <p className="ap-first">
        <strong>Before you sign:</strong> {od.count} client ledgers went below zero. The deepest was matter {od.deepest.matter} at{' '}
        <strong className="money neg">{fmtNzd(od.deepest.bal)}</strong> on {fmtIso(od.deepest.date)}.
      </p>

      <div className="ap-grid">
        <section className="card" aria-labelledby="list-h" ref={listRef}>
          <div className="card-h">
            <h2 id="list-h">Findings, grouped by check</h2>
            <div className="seg" role="group" aria-label="Show findings">
              {(['all', 'critical', 'high'] as Filter[]).map(k => (
                <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>{LABEL[k]} {COUNTS[k]}</button>
              ))}
            </div>
          </div>
          {groups.map(([code, items]) => (
            <div key={code} role="group" aria-labelledby={`g-${code}`}>
              <div className="group-h" id={`g-${code}`}>
                <span>{code} · {PLAIN_NAME[code]} <span className="cite">· {items[0].short}</span></span>
                {levelPill(items[0].level, items.length)}
              </div>
              {items.map(f => (
                <button key={keyOf(f)} className="item" aria-current={current && keyOf(f) === keyOf(current) ? 'true' : undefined} onClick={() => select(f)}>
                  <span className="rec">{f.sourceRecordId}</span>
                  <span>{plainEvidence(f)}</span>
                  <span className="matter">{matterOf(f) ?? ''}</span>
                </button>
              ))}
            </div>
          ))}
        </section>

        {current && (
          <section className="card detail" aria-labelledby="detail-h" ref={detailRef}>
            <div className="card-h"><h2 id="detail-h">Record {current.sourceRecordId}</h2>{levelPill(current.level)}</div>
            <div className="body">
              <p className="lead">{plainEvidence(current)}</p>
              <dl>
                <dt>Check</dt><dd>{current.code} · {PLAIN_NAME[current.code]}<br /><span style={{ color: 'var(--muted)' }}>Engine name: {checkName(current.code)}</span></dd>
                <dt>Regulation</dt><dd>{current.url ? <a href={current.url} target="_blank" rel="noopener noreferrer">{current.nzLawSocietyRule}</a> : current.nzLawSocietyRule}</dd>
                <dt>Engine says</dt><dd>{actionFor(current.level)}</dd>
                <dt>Source</dt><dd>{current.sourceRecordType.replace(/_/g, ' ')}, record {current.sourceRecordId}</dd>
                <dt>Status</dt><dd>{current.status.charAt(0) + current.status.slice(1).toLowerCase()}</dd>
              </dl>
              <button className="ap-btn ap-btn--line back" onClick={() => listRef.current?.scrollIntoView({ behavior: smooth(), block: 'start' })}>Back to findings</button>
            </div>
          </section>
        )}
      </div>

      <section className="card" aria-labelledby="checks-h">
        <div className="card-h"><h2 id="checks-h">All {CHECKS.length} checks</h2><span style={{ color: 'var(--muted)' }}>{ran} of {CHECKS.length} run</span></div>
        <div className="scrollbox" tabIndex={0} role="region" aria-label="Checks table">
          <table className="ui-table">
            <thead><tr><th scope="col">Check</th><th scope="col">What it looks for</th><th scope="col">Source</th><th scope="col" className="r">Findings</th><th scope="col" className="r">Result</th></tr></thead>
            <tbody>
              {CHECKS.map(c => (
                <tr key={c.code}>
                  <td>{c.code}</td>
                  <td>{PLAIN_NAME[c.code]}</td>
                  <td style={{ color: 'var(--muted)' }}>{c.short}</td>
                  <td className="r">{c.status === 'not_evaluated' ? '—' : c.resultCount}</td>
                  <td className="r">
                    {c.status === 'not_evaluated' ? <span className="pill pill--na">Not run</span>
                      : c.resultCount === 0 ? <span className="pill pill--pass">Passed</span>
                        : levelPill(c.severity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {NOT_RUN.length > 0 && <p className="note">Not run means the input lacks the fields the check needs ({NOT_RUN.map(c => c.code).join(', ')}: the sample has no certification dates). It is not a pass.</p>}
      </section>
    </div>
  );
}

// Every finding gets a full plain-English sentence and a real minus sign.
console.assert(FINDINGS.every(f => !plainEvidence(f).includes('-$')), 'no hyphen-minus in amounts');
console.assert(money('-$1.00') === '−$1.00', 'money minus');
