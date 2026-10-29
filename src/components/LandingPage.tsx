import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { reportSummary } from '../data';
import { CHECKS, FINDINGS, GROUPS, LINKEDIN_URL, NOT_RUN, STATUTORY_COUNT, tidy, type Check, type GroupId } from '../lib/rules';
import { fmtDay, fmtMonth, nextCertificate } from '../lib/dates';
import { SAMPLE_ROWS, nzd, runR01 } from '../lib/r01';

export interface EnterOptions { focus?: string; filter?: 'all' | 'critical'; reviewer?: string }
interface Props { onEnterDemo: (o?: EnterOptions) => void }

const byRecord = (id: string) => FINDINGS.find(f => f.sourceRecordId === id);
const HERO_ROWS = ['L021', 'R002', 'B031', 'B050'].map(byRecord).filter(Boolean) as typeof FINDINGS;

function Pill({ level, children }: { level: 'crit' | 'high' | 'pass' | 'na'; children: ReactNode }) {
  return <span className={`pill pill--${level}`}>{children}</span>;
}

function Arrow() {
  return <span className="arrow" aria-hidden="true">→</span>;
}

function resultPill(c: Check) {
  if (c.status === 'not_evaluated') return <Pill level="na">Not run</Pill>;
  if (c.resultCount === 0) return <Pill level="pass">Passed</Pill>;
  return <Pill level={c.severity === 'critical' ? 'crit' : 'high'}>{c.resultCount} {c.resultCount === 1 ? 'finding' : 'findings'}</Pill>;
}

/* Reveal the parts of each section as it arrives. Content is visible without JS. */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.rv'));
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(e => io.observe(e));
    const safety = window.setTimeout(() => els.forEach(e => e.classList.add('in')), 4000);
    return () => { io.disconnect(); window.clearTimeout(safety); };
  }, []);
}

function useNzTime() {
  const fmt = () => new Date().toLocaleTimeString('en-NZ', { timeZone: 'Pacific/Auckland', hour: 'numeric', minute: '2-digit' });
  const [t, setT] = useState(fmt);
  useEffect(() => { const id = window.setInterval(() => setT(fmt()), 30_000); return () => window.clearInterval(id); }, []);
  return t;
}

const FAQ = [
  { q: 'Does our ledger leave the office?', a: 'No. The engine runs on your own computer and reads files you export. This website only shows its output for a made-up firm; it cannot receive your data.' },
  { q: 'Is it approved by the Law Society?', a: `No. It is not affiliated with or endorsed by the New Zealand Law Society. ${STATUTORY_COUNT} of its ${CHECKS.length} checks follow the Trust Account Regulations 2008; the other is an internal control.` },
  { q: 'Does it use AI?', a: 'No AI decides a result. Each check is a written rule, so the same ledger gives the same report every time, and every finding points to the row it came from.' },
  { q: 'Which practice systems can it read?', a: 'CSV exports, with a column map for your system’s column names. It has not yet been run on a real firm’s export: that is the research I am doing now.' },
  { q: 'Does it replace my reconciliation?', a: 'No. It is a second look before you sign. You still reconcile, and you still decide what each finding means.' },
  { q: 'What does it cost?', a: 'Nothing is for sale. I am talking to sole practitioners and trust account administrators first, to learn what certificate week is really like.' },
];

export default function LandingPage({ onEnterDemo }: Props) {
  useReveal();
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => stageRef.current?.classList.add('open')));
    return () => cancelAnimationFrame(id);
  }, []);

  const due = useMemo(() => nextCertificate(new Date()), []);
  const [csv, setCsv] = useState(SAMPLE_ROWS);
  const r01 = useMemo(() => runR01(csv), [csv]);
  const [group, setGroup] = useState<GroupId>('balances');
  const [faq, setFaq] = useState(0);
  const [reviewer, setReviewer] = useState('Trust Account Supervisor');
  const [filter, setFilter] = useState<'all' | 'critical'>('all');
  const nzTime = useNzTime();

  const groupChecks = (id: GroupId) => GROUPS.find(g => g.id === id)!.rules.map(code => CHECKS.find(c => c.code === code)!).filter(Boolean);
  const m028 = FINDINGS.filter(f => f.code === 'R01' && f.evidence.includes('M028'));
  const balanceOf = (ev: string) => ev.match(/balance (-?\$[\d,.]+)/)?.[1]?.replace('-$', '−$') ?? '';
  const dateOf = (ev: string) => ev.match(/dated (\d{4}-\d{2}-\d{2})/)?.[1] ?? '';

  return (
    <div className="lp">
      {/* ── First screen ─────────────────────────────────────────────────── */}
      <header className="lp-wrap">
        <nav className="lp-nav" aria-label="Main">
          <a className="lp-word" href="#top">TrustSentry <span>· trust account checks</span></a>
          <ul>
            <li><a href="#finds">What it finds</a></li>
            <li><a href="#checks">The checks</a></li>
            <li><a href="#runs">How it runs</a></li>
            <li><a href="#questions">Questions</a></li>
          </ul>
        </nav>
      </header>

      <main id="top">
        <section className="lp-wrap lp-hero" aria-labelledby="hero-h">
          <div className="lp-hero-copy">
            <h1 id="hero-h"><span>Check the ledger</span> <span>before you sign</span></h1>
            <p>TrustSentry reads a law firm&rsquo;s trust ledger, bank statement and invoices, and lists every entry that breaks the Trust Account Regulations, on your own computer, before the monthly certificate.</p>
            <button className="btn" onClick={() => onEnterDemo()}>Open the sample report <Arrow /></button>
            <p className="lp-due">
              Your next certificate, for {fmtMonth(due.period)}, is due <strong>{fmtDay(due.due)}</strong>:{' '}
              <strong className="num">{due.workingDaysLeft} working {due.workingDaysLeft === 1 ? 'day' : 'days'}</strong> from today, counting Monday to Friday.
            </p>
          </div>

          <div className="lp-stage" ref={stageRef}>
            <div className="lp-stage-inner">
              <div className="ui" data-ui style={{ width: 640, maxWidth: 'none' }}>
                <div className="ui-head">
                  <span className="ui-title">Exception report · {reportSummary.firmName} (sample)</span>
                  <span className="ui-meta num">{reportSummary.period} · {reportSummary.totalViolations} findings</span>
                </div>
                {HERO_ROWS.map((f, i) => (
                  <button
                    key={f.sourceRecordId}
                    className={`ui-row${i === 0 ? ' is-hover' : ''}`}
                    style={{ width: '100%', border: 0, borderBottom: '1px solid var(--ui-rule)', background: undefined, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                    onClick={() => onEnterDemo({ focus: f.sourceRecordId })}
                    aria-label={`Open finding ${f.sourceRecordId}: ${f.ruleName}`}
                  >
                    <span className="num">{f.sourceRecordId}</span>
                    <span><b style={{ fontWeight: 500 }}>{f.ruleName}</b><span className="ev" style={{ display: 'block' }}>{tidy(f.evidence)}</span></span>
                    <Pill level="crit">Critical</Pill>
                  </button>
                ))}
                <div className="ui-kv" style={{ background: 'var(--ui-ground)' }}>
                  <dt>Checks run</dt><dd>{CHECKS.length - NOT_RUN.length} of {CHECKS.length}</dd>
                  <dt>Critical · High</dt><dd>{reportSummary.criticalCount} · {reportSummary.highCount}</dd>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Showcase: the visitor's rows in, the finding out ─────────────── */}
        <section className="lp-split" aria-label="Try one check" style={{ marginTop: 'clamp(120px, 14vh, 200px)' }}>
          <div className="lp-in">
            <label htmlFor="rows" className="rv">client_ledger.csv · four rows from the sample firm. Change a payment.</label>
            <textarea id="rows" className="rv" style={{ ['--i' as string]: 1 }} value={csv} onChange={e => setCsv(e.target.value)} spellCheck={false} aria-describedby="rows-hint" />
            <p id="rows-hint" className="hint rv" style={{ ['--i' as string]: 2 }}>This page runs one check, overdrawn client ledgers (R01), on what you type. The engine runs all {CHECKS.length} on your computer.</p>
            <h2>Your rows</h2>
          </div>
          <div className="lp-out">
            <div className="ui lp-out-frag rv" data-ui aria-live="polite" style={{ ['--i' as string]: 1 }}>
              <div className="ui-head">
                <span className="ui-title">R01 · Overdrawn client ledger</span>
                <span className="ui-meta">Reg 6, Reg 12(6)(a)</span>
              </div>
              {r01.errors.length > 0 && <p style={{ margin: 0, padding: '12px 18px', color: 'var(--crit)', fontSize: 13 }}>{r01.errors[0]}</p>}
              <table className="ui-table">
                <thead><tr><th>Entry</th><th>Matter</th><th>Date</th><th className="r">Balance after</th></tr></thead>
                <tbody>
                  {r01.rows.map(r => (
                    <tr key={r.entry + r.date} className={r.balance < 0 ? 'flag' : undefined}>
                      <td>{r.entry}</td><td>{r.matter}</td><td>{r.date}</td>
                      <td className={`r${r.balance < 0 ? ' neg' : ''}`}>{nzd(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '12px 18px', borderTop: '1px solid var(--ui-rule)', background: 'var(--ui-ground)' }}>
                {r01.findings.length === 0
                  ? <span>No client ledger goes below zero in these rows.</span>
                  : r01.findings.map(f => (
                    <div key={f.entry} style={{ display: 'flex', gap: 10, alignItems: 'baseline', padding: '3px 0' }}>
                      <Pill level="crit">Critical</Pill>
                      <span>Matter {f.matter} at <b className="neg num" style={{ fontWeight: 600 }}>{nzd(f.balance)}</b> after {f.entry} on {f.date}</span>
                    </div>
                  ))}
              </div>
            </div>
            <h2>Its findings</h2>
          </div>
        </section>

        {/* ── What it finds ─────────────────────────────────────────────────── */}
        <section id="finds" className="lp-wrap lp-features" aria-labelledby="finds-h">
          <h2 id="finds-h" className="lp-sec-h rv">What it finds</h2>
          <div className="lp-grid">
            <article className="lp-cell rv">
              <div className="lp-cell-text">
                <h3>A client ledger below zero</h3>
                <p>Even for a day, even if month end looks fine. Matter M028 went further below zero with each of three entries.</p>
              </div>
              <div className="lp-cell-frag">
                <table className="ui ui-table" data-ui style={{ borderRadius: '8px 0 0 0', borderRight: 0, borderBottom: 0 }}>
                  <thead><tr><th>Entry</th><th>Date</th><th className="r">M028 balance</th></tr></thead>
                  <tbody>{m028.map(f => <tr key={f.sourceRecordId} className="flag"><td>{f.sourceRecordId}</td><td>{dateOf(f.evidence)}</td><td className="r neg">{balanceOf(f.evidence)}</td></tr>)}</tbody>
                </table>
              </div>
            </article>

            <article className="lp-cell frag-top frag-right rv" style={{ ['--i' as string]: 1 }}>
              <div className="lp-cell-text">
                <h3>Deposits nobody allocated</h3>
                <p>A bulk deposit has to be split to clients. B046 brought in $9,000.00 and only $7,500.00 was allocated.</p>
              </div>
              <div className="lp-cell-frag">
                <div className="ui" data-ui style={{ borderRadius: '0 0 8px 0', borderLeft: 0, borderTop: 0 }}>
                  <div className="ui-head"><span className="ui-title">Bank line B046 · 24 Jun 2026</span></div>
                  <dl className="ui-kv">
                    <dt>Credit</dt><dd>$9,000.00</dd>
                    <dt>Allocated (3 rows)</dt><dd>$7,500.00</dd>
                    <dt><b style={{ color: 'var(--ink)', fontWeight: 500 }}>Not allocated</b></dt><dd className="neg">$1,500.00</dd>
                  </dl>
                </div>
              </div>
            </article>

            <article className="lp-cell rv" style={{ ['--i' as string]: 2 }}>
              <div className="lp-cell-text">
                <h3>Fees taken without an invoice</h3>
                <p>Money moved to the office account needs an invoice behind it, issued in time.</p>
              </div>
              <div className="lp-cell-frag">
                <div className="ui" data-ui style={{ borderRadius: '8px 0 0 0', borderRight: 0, borderBottom: 0 }}>
                  {['L037', 'L039', 'L041'].map(byRecord).filter(Boolean).map(f => (
                    <div key={f!.sourceRecordId} className="ui-row" style={{ gridTemplateColumns: '48px 1fr' }}>
                      <span className="num">{f!.sourceRecordId}</span>
                      <span>{f!.ruleName}<span className="ev" style={{ display: 'block' }}>{f!.short}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="lp-cell frag-top rv">
              <div className="lp-cell-text">
                <h3>A ledger that disagrees with the bank</h3>
                <p>At the end of April the bank held $250.00 more than the ledger said it should.</p>
              </div>
              <div className="lp-cell-frag">
                <div className="ui" data-ui style={{ borderRadius: '0 0 0 8px', borderRight: 0, borderTop: 0 }}>
                  <div className="ui-head"><span className="ui-title">Reconciliation · 30 Apr 2026</span></div>
                  <dl className="ui-kv">
                    <dt>Ledger total</dt><dd>$798,500.00</dd>
                    <dt>Bank balance</dt><dd>$798,750.00</dd>
                    <dt>Difference</dt><dd className="neg">$250.00</dd>
                  </dl>
                </div>
              </div>
            </article>

            <article className="lp-cell frag-right rv" style={{ ['--i' as string]: 1 }}>
              <div className="lp-cell-text">
                <h3>A check that could not run says so</h3>
                <p>The sample has no certification dates, so the timing check is shown as not run. It is never counted as a pass.</p>
              </div>
              <div className="lp-cell-frag">
                <div className="ui" data-ui style={{ borderRadius: '0 8px 0 0', borderLeft: 0, borderBottom: 0 }}>
                  {CHECKS.filter(c => ['R13', 'R14'].includes(c.code)).map(c => (
                    <div key={c.code} className="ui-row" style={{ gridTemplateColumns: '40px 1fr auto' }}>
                      <span className="num">{c.code}</span><span>{c.name}</span>{resultPill(c)}
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="lp-cell frag-top rv" style={{ ['--i' as string]: 2 }}>
              <div className="lp-cell-text">
                <h3>Every finding names its regulation</h3>
                <p>And the row it came from, so you can check it yourself in the export.</p>
              </div>
              <div className="lp-cell-frag">
                <div className="ui" data-ui style={{ borderRadius: '0 0 0 8px', borderRight: 0, borderTop: 0 }}>
                  <dl className="ui-kv">
                    <dt>Record</dt><dd>L021</dd>
                    <dt>Check</dt><dd>R01 · Overdrawn client ledger</dd>
                    <dt>Regulation</dt><dd>Reg 6 and Reg 12(6)(a)</dd>
                    <dt>Balance after</dt><dd className="neg">−$2,500.00</dd>
                  </dl>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ── The checks ────────────────────────────────────────────────────── */}
        <section id="checks" className="lp-wrap lp-checks" aria-labelledby="checks-h">
          <div className="lp-checks-head rv">
            <h2 id="checks-h"><span>{CHECKS.length} checks.</span> <span>{STATUTORY_COUNT} from the Regulations.</span></h2>
            <button className="btn btn--ink" onClick={() => onEnterDemo()}>Open the sample report <Arrow /></button>
          </div>
          <div className="lp-checks-body">
            <div className="lp-tabs" role="tablist" aria-label="Groups of checks">
              {GROUPS.map(g => (
                <button key={g.id} role="tab" id={`tab-${g.id}`} aria-selected={group === g.id} aria-controls="bands" className="lp-tab" onClick={() => setGroup(g.id)}>
                  <b>{g.label}</b><small>{g.rules.length} checks · {g.note.toLowerCase()}</small>
                </button>
              ))}
            </div>
            <div id="bands" className="lp-bands" role="tabpanel" aria-labelledby={`tab-${group}`} key={group}>
              {groupChecks(group).map((c, i) => (
                <div key={c.code} className="lp-band" style={{ ['--i' as string]: i }}>
                  <span className="lp-band-code">{c.code}</span>
                  <span className="lp-band-name">{c.name}</span>
                  <span className="lp-band-cite">{c.sourceUrl ? <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer">{c.short}</a> : `${c.short}, no direct statutory basis`}</span>
                  <span className="lp-band-res">{resultPill(c)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it runs ───────────────────────────────────────────────────── */}
        <section id="runs" className="lp-steps" aria-labelledby="runs-h">
          <div className="lp-step">
            <h2 id="runs-h">How it runs</h2>
            <div className="lp-step-card ui rv" data-ui>
              <div className="ui-head"><span className="ui-title">Export · May 2026</span></div>
              <dl className="ui-kv" style={{ fontSize: 13 }}>
                <dt>client_ledger.csv</dt><dd>ledger</dd>
                <dt>trust_bank_statement.csv</dt><dd>bank</dd>
                <dt>invoice_register.csv</dt><dd>invoices</dd>
                <dt>+3 more</dt><dd>matters, allocations, reconciliations</dd>
              </dl>
            </div>
            <p className="lp-step-say">First you export the month from your practice system.</p>
          </div>
          <div className="lp-step">
            <div className="lp-step-card ui rv" data-ui style={{ ['--i' as string]: 1 }}>
              <div className="ui-head"><span className="ui-title">Checking on this computer</span></div>
              <dl className="ui-kv">
                <dt>Checks run</dt><dd>{CHECKS.length - NOT_RUN.length} of {CHECKS.length}</dd>
                <dt>Not run</dt><dd>{NOT_RUN.map(c => c.code).join(', ') || 'none'}</dd>
                <dt>Uploaded</dt><dd>nothing</dd>
              </dl>
            </div>
            <p className="lp-step-say">Then the engine checks it where it already sits.</p>
          </div>
          <div className="lp-step">
            <figure className="lp-step-card rv" style={{ ['--i' as string]: 2 }}>
              <img className="ui-shot" src="/img/report-page-1.png" width={909} height={1286} alt="Page 1 of the exception report: firm, period, 23 exceptions, and the first critical finding with its regulation, record and action." loading="lazy" />
            </figure>
            <p className="lp-step-say">Then you read the report, finding by finding.</p>
          </div>
          <div className="lp-step">
            <div className="lp-step-card ui rv" data-ui style={{ ['--i' as string]: 3 }}>
              <div className="ui-head"><span className="ui-title">L021 · your note</span></div>
              <dl className="ui-kv" style={{ textAlign: 'left' }}>
                <dt>Found</dt><dd>Payment exceeded receipts</dd>
                <dt>Cause</dt><dd>for you to write</dd>
                <dt>Fixed on</dt><dd>for you to write</dd>
              </dl>
            </div>
            <p className="lp-step-say">Then you sign, knowing what is behind each figure.</p>
          </div>
        </section>

        {/* ── Questions ─────────────────────────────────────────────────────── */}
        <section id="questions" className="lp-wrap lp-faq" aria-labelledby="faq-h">
          <div className="lp-faq-list">
            <h2 id="faq-h">Questions</h2>
            {FAQ.map((f, i) => (
              <div key={f.q}>
                <button className="lp-q" aria-expanded={faq === i} onClick={() => setFaq(i)} onMouseEnter={() => setFaq(i)} onFocus={() => setFaq(i)}>{f.q}</button>
                {faq === i && <p className="lp-a-inline">{f.a}</p>}
              </div>
            ))}
          </div>
          <div className="lp-faq-pane" aria-live="polite">
            <p key={faq}>{FAQ[faq].a}</p>
          </div>
        </section>

        {/* ── Close: the first step, already open ───────────────────────────── */}
        <section className="lp-wrap lp-cta" aria-labelledby="cta-h">
          <div className="lp-cta-copy">
            <h2 id="cta-h">See it<br />run</h2>
            <p>Opens the report the engine wrote for a made-up firm. Nothing to install, nothing to upload.</p>
          </div>
          <form
            className="lp-cta-dialog ui ui-dialog"
            data-ui
            onSubmit={e => { e.preventDefault(); onEnterDemo({ filter, reviewer: reviewer.trim() || undefined }); }}
          >
            <div className="ui-head"><span className="ui-title">Open a report</span><span className="ui-meta">{reportSummary.firmName} (sample) · {reportSummary.period}</span></div>
            <div className="ui-body">
              <div className="ui-field">
                <label htmlFor="reviewer">Reviewing as</label>
                <input id="reviewer" value={reviewer} onChange={e => setReviewer(e.target.value)} autoComplete="off" />
              </div>
              <div className="ui-field">
                <label id="show-label">Show</label>
                <div className="seg" role="group" aria-labelledby="show-label">
                  <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All {reportSummary.totalViolations}</button>
                  <button type="button" aria-pressed={filter === 'critical'} onClick={() => setFilter('critical')}>Critical {reportSummary.criticalCount}</button>
                </div>
              </div>
              <button type="submit" className="ui-primary">Open the sample report</button>
            </div>
          </form>
        </section>
      </main>

      {/* ── Footer of tiles ─────────────────────────────────────────────────── */}
      <footer>
        <div className="lp-foot">
          <div className="lp-tile lp-t-statement">
            <p>Every figure on this site comes from the engine, run on a made-up firm&rsquo;s ledger.</p>
            <small>Not affiliated with or endorsed by the New Zealand Law Society. Not legal advice.</small>
          </div>
          <nav className="lp-tile lp-t-nav" aria-label="Footer">
            <ul>
              <li><a href="#finds">What it finds</a></li>
              <li><a href="#checks">The checks</a></li>
              <li><a href="#runs">How it runs</a></li>
              <li><a href="#questions">Questions</a></li>
            </ul>
          </nav>
          <div className="lp-tile lp-t-time">
            <p>Auckland</p>
            <p className="num">{nzTime}</p>
          </div>
          <div className="lp-tile lp-t-contact">
            <p>Talk to me about certificate week</p>
            <a className="link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">Michael Dang on LinkedIn</a>
          </div>
          <div className="lp-tile lp-t-word" aria-hidden="true"><span>TrustSentry</span></div>
          <button className="lp-tile lp-t-go" onClick={() => onEnterDemo()}>
            <span>Open the sample report</span>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true"><path d="M14 42 42 14M20 14h22v22" stroke="currentColor" strokeWidth="4" /></svg>
          </button>
        </div>
        <p className="lp-credit">Built by Michael Dang in Auckland. The sample report is generated from synthetic data; it describes no real firm, client or matter.</p>
      </footer>
    </div>
  );
}
