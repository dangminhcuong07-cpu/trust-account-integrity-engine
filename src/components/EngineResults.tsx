import { useMemo, useRef, useState } from 'react';
import { reportSummary } from '../data';
import { CHECKS, FINDINGS, NOT_RUN, checkName, tidy, type Finding } from '../lib/rules';

type Filter = 'all' | 'critical' | 'high';

const levelPill = (l: Finding['level']) =>
  <span className={`pill pill--${l === 'critical' ? 'crit' : 'high'}`}>{l === 'critical' ? 'Critical' : 'High'}</span>;

const fmtDate = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });

// The screen's one finding, computed from the R01 rows: how many client ledgers
// went below zero, and the deepest balance.
function overdrawnSummary() {
  const r01 = FINDINGS.filter(f => f.code === 'R01').map(f => {
    const matter = f.evidence.match(/matter (M\d+)/)?.[1] ?? '';
    const bal = Number(f.evidence.match(/balance (-?)\$([\d,.]+)/)?.slice(1).join('').replace(/,/g, '') ?? 0);
    const date = f.evidence.match(/dated (\d{4}-\d{2}-\d{2})/)?.[1] ?? '';
    return { matter, bal, date };
  });
  const matters = new Set(r01.map(r => r.matter));
  const deepest = r01.reduce((a, b) => (b.bal < a.bal ? b : a), r01[0]);
  return { count: matters.size, deepest };
}

export default function EngineResults({ initialFilter = 'all', focus }: { initialFilter?: Filter; focus?: string }) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const shown = useMemo(() => FINDINGS.filter(f => filter === 'all' || f.level === filter), [filter]);
  // A finding opened from the overview may sit past the first eight rows: show them all then.
  const [showAll, setShowAll] = useState(() => !!focus && shown.findIndex(f => f.sourceRecordId === focus) >= 8);
  const visible = showAll ? shown : shown.slice(0, 8);
  const detailRef = useRef<HTMLDivElement>(null);
  const select = (key: string) => {
    setSelected(key);
    // On a phone the detail sits below the list: bring it into view.
    if (window.matchMedia('(max-width: 1080px)').matches) {
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }));
    }
  };
  const [selected, setSelected] = useState<string>(() => {
    const f = FINDINGS.find(x => x.sourceRecordId === focus && x.code !== 'R04') ?? FINDINGS[0];
    return `${f.code}-${f.sourceRecordId}`;
  });
  const current = FINDINGS.find(f => `${f.code}-${f.sourceRecordId}` === selected) ?? shown[0];
  const od = overdrawnSummary();
  const byCheck = CHECKS.filter(c => c.status !== 'not_evaluated' && c.resultCount > 0).sort((a, b) => b.resultCount - a.resultCount);
  const maxCount = Math.max(...byCheck.map(c => c.resultCount));
  const ran = CHECKS.length - NOT_RUN.length;
  const fmtNzd = (n: number) => (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-NZ', { minimumFractionDigits: 2 });

  return (
    <div className="ap-col">
      <div className="ap-titlerow">
        <div>
          <h1>Exception report</h1>
          <p className="ap-sub">{reportSummary.firmName} (sample firm) · {reportSummary.period} · generated {fmtDate(reportSummary.generatedAt)} from synthetic data · {reportSummary.sensitivity} sensitivity</p>
        </div>
        <div className="ap-actions">
          <a className="ap-btn" href="/exception_report.pdf" download>Download the PDF</a>
        </div>
      </div>

      <p className="ap-finding">
        <span className="pill pill--crit">Read first</span>
        <span><strong className="num">{od.count} client ledgers</strong> went below zero. The deepest was matter {od.deepest.matter} at <strong className="num" style={{ color: 'var(--crit)' }}>{fmtNzd(od.deepest.bal)}</strong> on {fmtDate(od.deepest.date)}.</span>
      </p>

      <dl className="ap-stats">
        <div className="ap-stat lead"><dt>Findings</dt><dd>{reportSummary.totalViolations}</dd></div>
        <div className="ap-stat"><dt>Critical</dt><dd>{reportSummary.criticalCount}</dd></div>
        <div className="ap-stat"><dt>High</dt><dd>{reportSummary.highCount}</dd></div>
        <div className="ap-stat"><dt>Checks run</dt><dd>{ran} <small>of {CHECKS.length}</small></dd></div>
      </dl>

      <div className="ap-grid">
        <section className="ap-card" aria-labelledby="list-h">
          <div className="ap-card-h">
            <h2 id="list-h">Findings <span className="meta num">{shown.length}</span></h2>
            <div className="seg" role="group" aria-label="Show findings">
              {(['all', 'critical', 'high'] as Filter[]).map(f => (
                <button key={f} type="button" aria-pressed={filter === f} onClick={() => { setFilter(f); setShowAll(false); }}>
                  {f === 'all' ? 'All' : f === 'critical' ? 'Critical' : 'High'}
                </button>
              ))}
            </div>
          </div>
          <div role="listbox" aria-label="Findings" className="ap-list">
            {visible.map(f => {
              const key = `${f.code}-${f.sourceRecordId}`;
              return (
                <button key={key} role="option" aria-selected={key === selected} className="ap-item" onClick={() => select(key)}>
                  <span className="rec">{f.code} · {f.sourceRecordId}</span>
                  <span><span className="t">{f.ruleName}</span><span className="e">{tidy(f.evidence)}</span></span>
                  {levelPill(f.level)}
                </button>
              );
            })}
          </div>
          {shown.length > 8 && (
            <div className="ap-note" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <span className="num">{visible.length} of {shown.length} shown</span>
              <button className="ap-btn ap-btn--ghost" onClick={() => setShowAll(v => !v)}>{showAll ? 'Show fewer' : `Show all ${shown.length}`}</button>
            </div>
          )}
        </section>

        <div style={{ display: 'grid', gap: 16 }} className="ap-detail" ref={detailRef}>
          {current && (
            <section className="ap-card" aria-labelledby="detail-h">
              <div className="ap-card-h"><h2 id="detail-h">Record {current.sourceRecordId}</h2>{levelPill(current.level)}</div>
              <div className="ap-body">
                <h3>{current.ruleName}</h3>
                <p>{tidy(current.evidence)}</p>
                <dl>
                  <dt>Check</dt><dd>{current.code} · {checkName(current.code)}</dd>
                  <dt>Regulation</dt>
                  <dd>{current.url ? <a href={current.url} target="_blank" rel="noopener noreferrer">{current.nzLawSocietyRule}</a> : current.nzLawSocietyRule}</dd>
                  <dt>Source</dt><dd>{current.sourceRecordType.replace(/_/g, ' ')}</dd>
                  <dt>Status</dt><dd>Unresolved</dd>
                </dl>
              </div>
            </section>
          )}
          <section className="ap-card" aria-labelledby="bycheck-h">
            <div className="ap-card-h"><h2 id="bycheck-h">Findings by check</h2><span className="meta">{byCheck.length} checks found something</span></div>
            <div className="ap-bars">
              {byCheck.map(c => (
                <div key={c.code} className="ap-bar" title={c.name}>
                  <span>{c.code}</span>
                  <span className="track"><span className="fill" style={{ display: 'block', width: `${(c.resultCount / maxCount) * 100}%` }} /></span>
                  <span className="v">{c.resultCount}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="ap-card ap-section" aria-labelledby="checks-h">
        <div className="ap-card-h"><h2 id="checks-h">Checks</h2><span className="meta">{ran} of {CHECKS.length} run</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table className="ui-table" style={{ minWidth: 640 }}>
            <thead><tr><th>Check</th><th>Name</th><th>Regulation</th><th className="r">Findings</th><th className="r">Result</th></tr></thead>
            <tbody>
              {CHECKS.map(c => (
                <tr key={c.code}>
                  <td>{c.code}</td>
                  <td>{c.name}</td>
                  <td style={{ color: 'var(--muted)' }}>{c.short}</td>
                  <td className="r">{c.status === 'not_evaluated' ? '—' : c.resultCount}</td>
                  <td className="r">
                    {c.status === 'not_evaluated'
                      ? <span className="pill pill--na">Not run</span>
                      : c.resultCount === 0 ? <span className="pill pill--pass">Passed</span>
                        : <span className={`pill pill--${c.severity === 'critical' ? 'crit' : 'high'}`}>{c.severity === 'critical' ? 'Critical' : 'High'}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {NOT_RUN.length > 0 && (
          <p className="ap-note">Not run means the input lacks the fields the check needs ({NOT_RUN.map(c => c.code).join(', ')}: no certification dates in the sample). It is not a pass.</p>
        )}
      </section>
    </div>
  );
}
