import { useMemo, useState, type ReactNode } from 'react';
import { reportSummary } from '../data';
import { CHECKS, FINDINGS, GROUPS, LINKEDIN_URL, NOT_RUN, STATUTORY_COUNT } from '../lib/rules';
import { PLAIN_NAME, findingSpan, plainEvidence } from '../lib/plain';
import { fmtDay, fmtMonth, nextCertificate } from '../lib/dates';
import { SAMPLE_ROWS, checkRows, nzd, type Row } from '../lib/r01';
import { useActiveSection, useNow, useScrollMotion } from '../lib/scroll';
import { Lamp, Nib, Pen, Shelves } from './Objects';

export interface EnterOptions { focus?: string }
interface Props { onEnterDemo: (o?: EnterOptions) => void }

const byRecord = (id: string, code?: string) => FINDINGS.find(f => f.sourceRecordId === id && (!code || f.code === code))!;
const SHEET_ROWS = [byRecord('L021', 'R01'), byRecord('R002', 'R03'), byRecord('B031', 'R12'), byRecord('L037', 'R07')];
const SPAN = findingSpan(FINDINGS);
const RAN = CHECKS.length - NOT_RUN.length;

function resultPill(c: (typeof CHECKS)[number]) {
  if (c.status === 'not_evaluated') return <span className="pill pill--na">Not run</span>;
  if (c.resultCount === 0) return <span className="pill pill--pass">Passed</span>;
  const crit = c.severity === 'critical';
  return <span className={`pill ${crit ? 'pill--crit' : 'pill--high'}`}>{c.resultCount} {crit ? 'critical' : 'high'}</span>;
}

// The side index (desktop): one entry per section, numbered like the report's own sections.
const INDEX = [
  { id: 'try', label: 'Try a check' },
  { id: 'finds', label: 'What it finds' },
  { id: 'checks', label: 'The checks' },
  { id: 'due', label: 'Your certificate' },
  { id: 'runs', label: 'How it runs' },
  { id: 'questions', label: 'Questions' },
  { id: 'talk', label: 'Talk to me' },
];
const INDEX_IDS = INDEX.map(i => i.id);
const pad = (n: number) => String(n).padStart(2, '0');

/** A section heading with its word drifting behind it, outlined, as the section scrolls past. */
function SecHead({ id, word, children, lede }: { id: string; word: string; children: ReactNode; lede?: ReactNode }) {
  return (
    <div className="sec-head" data-progress>
      <span className="drift" aria-hidden="true">{word}</span>
      <h2 id={id}>{children}</h2>
      {lede && <p className="sec-lede">{lede}</p>}
    </div>
  );
}

/** Time left until the end of the due day, in the viewer's own time zone. */
function Countdown({ due }: { due: Date }) {
  const now = useNow();
  const end = new Date(due.getFullYear(), due.getMonth(), due.getDate() + 1);
  const s = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  const parts = [
    { v: Math.floor(s / 86400), u: 'days' },
    { v: Math.floor(s / 3600) % 24, u: 'hours' },
    { v: Math.floor(s / 60) % 60, u: 'minutes' },
    { v: s % 60, u: 'seconds' },
  ];
  return (
    <p className="clock" role="timer" aria-label={`${parts[0].v} days and ${parts[1].v} hours left`}>
      {parts.map((p, i) => (
        <span key={p.u}>{i > 0 && <i aria-hidden="true">:</i>}<span className="unit"><b className="num">{pad(p.v)}</b><small>{p.u}</small></span></span>
      ))}
    </p>
  );
}

const FAQ = [
  { q: 'Does our ledger leave the office?', a: 'No. The engine runs on your own computer and reads files you export. This website only shows its output for a made-up firm; it cannot receive your data.' },
  { q: 'Is it approved by the Law Society?', a: `No. It is not affiliated with or endorsed by the New Zealand Law Society. ${STATUTORY_COUNT} of its ${CHECKS.length} checks cite the Lawyers and Conveyancers Act or its Trust Account Regulations; the other is an internal control with no direct statutory basis.` },
  { q: 'Does it use AI?', a: 'No AI decides a result. Each check is a written rule, so the same ledger gives the same report every time, and every finding points to the row it came from.' },
  { q: 'Which practice systems can it read?', a: 'CSV exports, with a column map for your system’s column names. It has not yet been run on a real firm’s export: that is the research I am doing now.' },
  { q: 'Does it replace my reconciliation?', a: 'No. It is a second look before you sign. You still reconcile, and you still decide what each finding means.' },
  { q: 'What does it cost?', a: 'Nothing is for sale. I am talking to sole practitioners and trust account administrators first, to learn what certificate week is really like.' },
];

export default function LandingPage({ onEnterDemo }: Props) {
  const due = useMemo(() => nextCertificate(new Date()), []);
  const month = fmtMonth(due.period).split(' ')[0];
  const active = useActiveSection(INDEX_IDS);
  useScrollMotion();
  const [rows, setRows] = useState<Row[]>(SAMPLE_ROWS);
  const result = useMemo(() => checkRows(rows), [rows]);
  const edited = rows.some((r, i) => r.receipt !== SAMPLE_ROWS[i].receipt || r.payment !== SAMPLE_ROWS[i].payment);
  const setAmount = (i: number, key: 'receipt' | 'payment', value: string) =>
    setRows(rs => rs.map((r, j) => (j === i ? { ...r, [key]: value } : r)));
  const bad = (s: string) => checkRows([{ ...SAMPLE_ROWS[0], receipt: s, payment: '0' }]).errors.length > 0;

  const eg = {
    ledger: plainEvidence(byRecord('L073', 'R01')),
    deposit: plainEvidence(byRecord('B046', 'R12')),
    fee: plainEvidence(byRecord('L037', 'R07')),
    recon: plainEvidence(byRecord('R002', 'R03')),
    old: plainEvidence(byRecord('M017', 'R02')),
  };

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="top">
        <nav className="nav" aria-label="Main">
          <a className="word" href="#main" aria-label="TrustSentry, top of page">TrustSentry</a>
          <ul>
            <li><a href="#finds">What it finds</a></li>
            <li><a href="#checks">The checks</a></li>
            <li><a href="#questions">Questions</a></li>
            <li><a className="btn btn--light" href="#talk">Talk to me</a></li>
          </ul>
        </nav>
      </header>

      <nav className="index" aria-label="Sections">
        <ol>
          {INDEX.map((s, i) => (
            <li key={s.id}><a href={`#${s.id}`} aria-current={active === s.id ? 'location' : undefined}><span className="num">{pad(i + 1)}</span>{s.label}</a></li>
          ))}
        </ol>
      </nav>

      <main id="main">
        <section className="hero" aria-labelledby="hero-h">
          <div className="library"><Shelves /></div>
          <div className="hero-copy">
            <h1 id="hero-h"><span>Read the exceptions</span> <em>before you sign</em></h1>
            <p className="hero-lede">TrustSentry checks a month of trust ledger, bank statement and invoices on your own computer, and prints a dated exception report: each entry that breaks the Trust Account Regulations, the regulation, and the row it came from.</p>
            <div className="hero-actions">
              <button className="btn" onClick={() => onEnterDemo()}>Read the sample report</button>
              <a className="textlink" href="#talk">Or talk to me for 20 minutes</a>
            </div>
          </div>

          <div className="stage" data-progress>
            <Lamp className="lamp" />
            <article className="sheet paper" aria-labelledby="sheet-h">
              <Pen className="pen" />
              <div className="sheet-title">
                <b id="sheet-h">Exception report</b>
                <span>Sample firm · entries {SPAN.from} to {SPAN.to}</span>
              </div>
              <p className="sheet-counts">
                <span><strong className="neg num">{reportSummary.criticalCount}</strong>critical</span>
                <span><strong className="num">{reportSummary.highCount}</strong>high</span>
                <span><strong className="num">{RAN}</strong>of {CHECKS.length} checks run</span>
              </p>
              {SHEET_ROWS.map(f => (
                <button key={f.code + f.sourceRecordId} className="sheet-row" onClick={() => onEnterDemo({ focus: `${f.code}-${f.sourceRecordId}` })}>
                  <span className="mark" aria-label={f.level === 'critical' ? 'Critical' : 'High'}>{f.level === 'critical' ? '!' : ''}</span>
                  <span className="rec">{f.sourceRecordId}</span>
                  <span><b>{PLAIN_NAME[f.code]} <span className="cite">· {f.short}</span></b>{plainEvidence(f)}</span>
                </button>
              ))}
              {NOT_RUN.map(c => (
                <div key={c.code} className="sheet-row is-na">
                  <span></span><span className="rec">{c.code}</span>
                  <span><b>{PLAIN_NAME[c.code]} · not run</b>The sample has no certification dates. Not run is not a pass.</span>
                </div>
              ))}
              <p className="sheet-foot">Made-up firm, synthetic data. Select a finding to open it in the full report.</p>
            </article>
          </div>

          <p className="hud hud--l" aria-hidden="true"><span className="cue"></span>Scroll</p>
          <p className="hud hud--r"><a href="#due">{month} certificate due {fmtDay(due.due)}</a></p>
        </section>

        <section id="try" className="wrap sec" aria-labelledby="try-h">
          <SecHead id="try-h" word="Try it" lede={<>Four rows from the sample ledger. Change a payment and the overdrawn-ledger check runs again, here in your browser. The engine runs all {CHECKS.length} checks on your own computer.</>}>Try one check yourself</SecHead>
          <div className="try" data-reveal>
            <div className="try-in">
              <table className="try-table">
                <caption>client_ledger.csv, sample firm</caption>
                <thead><tr><th scope="col">Entry</th><th scope="col">Matter</th><th scope="col">Date</th><th scope="col">Received</th><th scope="col">Paid out</th></tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.entry}>
                      <th scope="row">{r.entry}</th>
                      <td>{r.matter}</td>
                      <td>{r.date}</td>
                      <td><input aria-label={`${r.entry} received`} inputMode="decimal" value={r.receipt} aria-invalid={bad(r.receipt)} onChange={e => setAmount(i, 'receipt', e.target.value)} /></td>
                      <td><input aria-label={`${r.entry} paid out`} inputMode="decimal" value={r.payment} aria-invalid={bad(r.payment)} onChange={e => setAmount(i, 'payment', e.target.value)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="try-actions">
                <button className="btn btn--line" onClick={() => setRows(SAMPLE_ROWS)} disabled={!edited} aria-disabled={!edited}>Restore the sample rows</button>
              </div>
            </div>
            <div className="try-out" aria-live="polite" aria-atomic="true">
              <h3>R01 · {PLAIN_NAME.R01}</h3>
              <p className="cite">Trust Account Regulations, Reg 6 and Reg 12(6)(a)</p>
              <div className="result">
                {!result.ran ? (
                  <>
                    <p className="result-head">Not run <span className="pill pill--na">Not a pass</span></p>
                    <p>Nothing was checked because {result.errors.length === 1 ? 'one amount' : `${result.errors.length} amounts`} could not be read:</p>
                    <ul>{result.errors.map(e => <li key={e}>{e}</li>)}</ul>
                  </>
                ) : result.findings.length === 0 ? (
                  <p className="result-head">No client ledger goes below zero in these rows <span className="pill pill--pass">Passed</span></p>
                ) : (
                  <>
                    <p className="result-head">{result.findings.length} {result.findings.length === 1 ? 'finding' : 'findings'} <span className="pill pill--crit">Critical</span></p>
                    {result.findings.map(f => (
                      <p key={f.entry}>Matter {f.matter} went to <span className="money neg">{nzd(f.balance)}</span> after entry {f.entry}.</p>
                    ))}
                  </>
                )}
              </div>
              {result.ran && (
                <table className="balances">
                  <thead><tr><th scope="col">Entry</th><th scope="col">Matter</th><th scope="col" className="r">Balance after</th></tr></thead>
                  <tbody>{result.rows.map(r => (
                    <tr key={r.entry}><td>{r.entry}</td><td>{r.matter}</td><td className={`r money${(r.balance ?? 0) < 0 ? ' neg' : ''}`}>{nzd(r.balance ?? 0)}</td></tr>
                  ))}</tbody>
                </table>
              )}
            </div>
          </div>
        </section>

        <section id="finds" className="wrap sec" aria-labelledby="finds-h">
          <SecHead id="finds-h" word="Exceptions" lede="Examples from the sample report, in the words the report uses.">What it finds</SecHead>
          <ul className="finds">
            <li data-reveal><h3>A client ledger below zero</h3><p>Even for a day, even if month end looks fine.</p><p className="eg">{eg.ledger}</p></li>
            <li data-reveal><h3>Deposits nobody allocated</h3><p>A bulk deposit has to be split across clients, to the cent.</p><p className="eg">{eg.deposit}</p></li>
            <li data-reveal><h3>Fees taken without an invoice</h3><p>Money moved to the office account needs an invoice behind it, issued in time.</p><p className="eg">{eg.fee}</p></li>
            <li data-reveal><h3>A ledger that disagrees with the bank</h3><p>The reconciliation has to balance, not just look close.</p><p className="eg">{eg.recon}</p></li>
            <li data-reveal><h3>Money left sitting too long</h3><p>Balances with no activity for more than a year are flagged for follow-up.</p><p className="eg">{eg.old}</p></li>
            <li data-reveal><h3>A check that could not run says so</h3><p>When the input lacks what a check needs, the report says not run. It is never counted as a pass.</p><p className="eg">In the sample, {NOT_RUN.map(c => `${c.code} (${PLAIN_NAME[c.code].toLowerCase()})`).join(', ')} did not run: there are no certification dates.</p></li>
          </ul>
        </section>

        <section id="checks" className="wrap sec" aria-labelledby="checks-h">
          <SecHead id="checks-h" word="The checks" lede={<>{STATUTORY_COUNT} cite the Lawyers and Conveyancers Act or its Trust Account Regulations; one is an internal control. The result column is the sample firm’s.</>}>The {CHECKS.length} checks</SecHead>
          <div className="checks" data-reveal>
            <table>
              <thead><tr><th scope="col">Check</th><th scope="col">What it looks for</th><th scope="col">Source</th><th scope="col" className="res">Sample result</th></tr></thead>
              {GROUPS.map(g => (
                <tbody key={g.id}>
                  <tr><th colSpan={4} scope="colgroup">{g.label}</th></tr>
                  {g.rules.map(code => CHECKS.find(c => c.code === code)!).map(c => (
                    <tr key={c.code}>
                      <td className="code">{c.code}</td>
                      <td>{PLAIN_NAME[c.code]}</td>
                      <td className="cite">{c.sourceUrl ? <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer">{c.short}</a> : `${c.short}, no direct statutory basis`}</td>
                      <td className="res">{resultPill(c)}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </section>

        <section id="due" className="wrap sec due" aria-labelledby="due-h">
          <SecHead id="due-h" word="Certificate" lede={<>Due {fmtDay(due.due)}: <strong className="num">{due.workingDaysLeft} working {due.workingDaysLeft === 1 ? 'day' : 'days'}</strong> from today, counting Monday to Friday (public holidays are not taken out). The clock runs to the end of that day, in your time zone.</>}>Your {month} certificate</SecHead>
          <div data-reveal><Countdown due={due.due} /></div>
        </section>

        <section id="runs" className="wrap sec" aria-labelledby="runs-h">
          <SecHead id="runs-h" word="Four steps">How it runs</SecHead>
          <div className="runs">
            <ol>
              <li data-reveal><div><h3>Export</h3><p>Export the month from your practice system as CSV: client ledger, trust bank statement, invoices, matters, allocations and reconciliations.</p></div></li>
              <li data-reveal><div><h3>Check, on your computer</h3><p>The engine reads the files where they already are. Nothing is uploaded and no account is needed.</p></div></li>
              <li data-reveal><div><h3>Read the report</h3><p>A dated PDF lists every exception with its regulation, the record and what to do next.</p></div></li>
              <li data-reveal><div><h3><Nib className="nib" />Sign, knowing what is behind each figure</h3><p>Note the cause and the fix against each finding, and keep the report with the certificate.</p></div></li>
            </ol>
            <figure className="lit" data-reveal>
              <img src="/img/report-page-1.png" width={909} height={1286} loading="lazy" alt="Page 1 of the sample exception report: the firm, period, 23 exceptions, and the first critical finding with its regulation, record and action." />
              <figcaption>Page 1 of the sample report the engine printed. <a href="/exception_report.pdf" download>Download the PDF</a></figcaption>
            </figure>
          </div>
        </section>

        <section id="questions" className="wrap sec" aria-labelledby="faq-h">
          <SecHead id="faq-h" word="Questions">Questions</SecHead>
          <div className="qs">
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="talk" className="ask" aria-labelledby="talk-h">
          <div className="wrap ask-in" data-reveal>
            <div>
              <h2 id="talk-h">Twenty minutes about certificate week</h2>
              <p>I’m an accounting graduate in Auckland, researching how sole practitioners and small firms prepare the monthly trust account certificate. I’m not selling anything, and I won’t ask for any client data.</p>
              <div className="hero-actions">
                <a className="btn btn--light" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">Message me on LinkedIn</a>
                <button className="textlink" onClick={() => onEnterDemo()}>Read the sample report first</button>
              </div>
            </div>
            <div>
              <h3>What I’ll ask you</h3>
              <ol>
                <li>Walk me through your last certificate week.</li>
                <li>Which step takes longest, and which worries you most?</li>
                <li>When did a reconciliation last not balance, and what did you do?</li>
                <li>What would make you trust a check like this, or ignore it?</li>
              </ol>
              <p className="aside">Michael Dang, Auckland.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap foot">
        <p>Every figure on this site comes from the engine, run on a made-up firm’s ledger. It describes no real firm, client or matter.</p>
        <p>Not affiliated with or endorsed by the New Zealand Law Society. Not legal advice.</p>
      </footer>
    </>
  );
}
