import { useEffect, useState } from 'react';
import EngineResults from './components/EngineResults';
import LandingPage, { type EnterOptions } from './components/LandingPage';
import { reportSummary } from './data';
import { CHECKS, LCA_URL, LINKEDIN_URL, NOT_RUN, NZLS_URL, STATUTORY_COUNT } from './lib/rules';

type Tab = 'findings' | 'how' | 'workflows' | 'context';

const NAV: { id: Tab; label: string; count?: number }[] = [
  { id: 'findings', label: 'Exception report', count: reportSummary.totalViolations },
  { id: 'how', label: 'How it works' },
  { id: 'workflows', label: 'Practice workflows' },
  { id: 'context', label: 'Regulations and context' },
];

function Mark() {
  // A ledger line with a tick: the report's own mark.
  return (
    <svg className="ap-mark" viewBox="0 0 22 22" aria-hidden="true">
      <rect width="22" height="22" rx="6" fill="#333231" />
      <path d="M5 7h12M5 11h5M5 15h4" stroke="#cdc3b6" strokeWidth="1.6" strokeLinecap="round" />
      <path d="m11.5 14 2.2 2.2 3.8-4.6" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HowItWorks() {
  const steps = [
    { title: 'Export', body: 'Export the client ledger, trust bank statement, invoice register, matters, allocations and reconciliations as CSV from your practice system.' },
    { title: 'Read', body: 'The engine reads the files on your own computer and maps them to one ledger model. Nothing is uploaded.' },
    { title: 'Check', body: `${CHECKS.length} checks run as written rules: ${STATUTORY_COUNT} follow the Trust Account Regulations 2008 and one is an internal control.` },
    { title: 'Report', body: 'A dated PDF exception report and an evidence pack are written to disk, ready for your monthly certificate.' },
  ];
  return (
    <div className="ap-col">
      <div className="ap-titlerow"><div><h1>How it works</h1><p className="ap-sub">Four steps on your own computer. No account, no upload.</p></div></div>
      <section className="ap-card ap-section" aria-label="Steps">
        <ol className="ap-steps">
          {steps.map(s => <li key={s.title}><h3>{s.title}</h3><p>{s.body}</p></li>)}
        </ol>
      </section>
      <section className="ap-card ap-section" aria-labelledby="expects-h">
        <div className="ap-card-h"><h2 id="expects-h">What the files need</h2></div>
        <div className="ap-two">
          <div><h3>Dates</h3><p>YYYY-MM-DD. If your system exports DD/MM/YYYY, reformat the date column in Excel before saving.</p></div>
          <div><h3>Amounts</h3><p>Plain numbers such as 15000.00: no currency signs, commas or brackets. Negative amounts take a minus sign.</p></div>
          <div><h3>Column names</h3><p>If your system names columns differently, a column map in the config file translates them.</p></div>
          <div><h3>First run on your own export</h3><p>It has not yet been run on a real firm&rsquo;s export. If you would try it, <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">message me first</a> and we can check the mapping together.</p></div>
        </div>
      </section>
    </div>
  );
}

function Workflows() {
  const items = [
    { title: 'Before the monthly certificate', body: 'Run it on last month before you sign, while a breach can still be explained or corrected.' },
    { title: 'Before an inspection', body: 'Keep the dated reports as a record that the account was reviewed every month, and what was done about each finding.' },
    { title: 'Taking over as supervisor', body: 'Run it once on the account you inherit, so you know where it stands on the day you take responsibility.' },
    { title: 'After a correction', body: 'Run it again to confirm a finding has cleared, and keep the date it did.' },
  ];
  return (
    <div className="ap-col">
      <div className="ap-titlerow"><div><h1>Practice workflows</h1><p className="ap-sub">Where it fits into what a Trust Account Supervisor already does.</p></div></div>
      <section className="ap-card ap-section" aria-label="Workflows">
        <div className="ap-two">{items.map(w => <div key={w.title}><h3>{w.title}</h3><p>{w.body}</p></div>)}</div>
      </section>
    </div>
  );
}

function Context() {
  const facts = [
    { h: 'Every own-account practice with a trust account is inspected', b: 'The NZLS Inspectorate visits on a risk-based cycle. It reviewed 263 trust accounts in 2024/25.', cite: 'NZLS Annual Report 2024/25', url: 'https://www.lawsociety.org.nz/news/newsroom/law-societys-annual-report-released/' },
    { h: 'The certificate is due on the 10th working day', b: 'For the month before; for December, the 15th working day of January. If the account does not reconcile, the certificate is still filed on time, with an explanation. Late certificates are recorded and passed to the inspectors.', cite: 'NZLS trust account certificates FAQ', url: 'https://www.lawsociety.org.nz/professional-practice/legal-practice/trust-account-management/trust-account-certificates-faqs/' },
    { h: 'Misused trust money ends careers', b: 'In 2024 a lawyer was struck off after misappropriating $700,000 from client trust accounts. The Lawyers’ Fidelity Fund paid six claimants.', cite: 'NZ Lawyers and Conveyancers Disciplinary Tribunal, 2024', url: 'https://www.lawsociety.org.nz/lawyers-complaints-service/decisions/new-zealand-lawyers-and-conveyancers-disciplinary-tribunal/aaron-nicholls-struck-off-for-misappropriating-client-funds/' },
  ];
  const refs = [
    { label: 'Lawyers and Conveyancers Act 2006, ss 110–116', url: 'https://www.legislation.govt.nz/act/public/2006/0001/latest/whole.html', kind: 'Act' },
    { label: 'Lawyers and Conveyancers Act (Trust Account) Regulations 2008', url: LCA_URL, kind: 'Regulations' },
    { label: 'NZLS Lawyers’ Trust Accounting Guidelines, June 2024', url: NZLS_URL, kind: 'Guidance' },
    { label: 'NZLS trust account management and the Inspectorate', url: 'https://www.lawsociety.org.nz/professional-practice/legal-practice/trust-account-management/', kind: 'Guidance' },
  ];
  return (
    <div className="ap-col">
      <div className="ap-titlerow"><div><h1>Regulations and context</h1><p className="ap-sub">Why the review before the certificate matters, with sources.</p></div></div>
      <section className="ap-card ap-section" aria-labelledby="facts-h">
        <div className="ap-card-h"><h2 id="facts-h">The rules around the certificate</h2></div>
        <ul className="ap-refs">
          {facts.map(f => (
            <li key={f.h} style={{ flexDirection: 'column', gap: 4 }}>
              <b style={{ fontWeight: 600 }}>{f.h}</b>
              <span style={{ color: '#4f4b47', fontSize: 14, whiteSpace: 'normal' }}>{f.b}</span>
              <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13 }}>{f.cite}</a>
            </li>
          ))}
        </ul>
      </section>
      <section className="ap-card ap-section" aria-labelledby="refs-h">
        <div className="ap-card-h"><h2 id="refs-h">Sources</h2></div>
        <ul className="ap-refs">
          {refs.map(r => <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.label}</a><span>{r.kind}</span></li>)}
        </ul>
      </section>
    </div>
  );
}

export default function App() {
  // #report opens the sample report directly, so it can be linked and bookmarked.
  const [view, setView] = useState<'landing' | 'app'>(() => (window.location.hash === '#report' ? 'app' : 'landing'));
  useEffect(() => {
    const onHash = () => setView(window.location.hash === '#report' ? 'app' : 'landing');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    if (view === 'app' && window.location.hash !== '#report') history.pushState(null, '', '#report');
    if (view === 'landing' && window.location.hash === '#report') history.pushState(null, '', window.location.pathname);
  }, [view]);
  const [tab, setTab] = useState<Tab>('findings');
  const [opts, setOpts] = useState<EnterOptions>({});
  const [menu, setMenu] = useState(false);

  // A new view starts at its top, not at the previous scroll position.
  useEffect(() => { window.scrollTo(0, 0); }, [tab, view]);
  useEffect(() => { document.title = view === 'landing' ? 'TrustSentry: check the trust ledger before you sign' : 'Exception report · TrustSentry sample'; }, [view]);

  if (view === 'landing') {
    return <LandingPage onEnterDemo={o => { setOpts(o ?? {}); setTab('findings'); setView('app'); }} />;
  }

  const go = (t: Tab) => { setTab(t); setMenu(false); };
  const current = NAV.find(n => n.id === tab)!;

  return (
    <div className="ap">
      <div className="ap-topbar">
        <b>{current.label}</b>
        <button onClick={() => setMenu(m => !m)} aria-expanded={menu} aria-controls="ap-side">{menu ? 'Close' : 'Menu'}</button>
      </div>
      <aside id="ap-side" className={`ap-side${menu ? ' open' : ''}`}>
        <div className="ap-brand"><Mark />TrustSentry</div>
        <div className="ap-scope">
          <b>{reportSummary.firmName} (sample)</b>
          <span>Trust account · {reportSummary.period}</span>
        </div>
        <p className="ap-group">Review</p>
        <nav className="ap-nav" aria-label="Sample report">
          {NAV.map(n => (
            <button key={n.id} aria-current={tab === n.id ? 'page' : undefined} onClick={() => go(n.id)}>
              <span>{n.label}</span>{n.count !== undefined && <span className="count">{n.count}</span>}
            </button>
          ))}
        </nav>
        <div className="ap-side-foot">
          {opts.reviewer && <span>Reviewing as {opts.reviewer}</span>}
          <span>{CHECKS.length - NOT_RUN.length} of {CHECKS.length} checks run · synthetic data</span>
          <button onClick={() => setView('landing')}>Back to the overview</button>
        </div>
      </aside>
      <main className="ap-main">
        {tab === 'findings' && <EngineResults initialFilter={opts.filter} focus={opts.focus} />}
        {tab === 'how' && <HowItWorks />}
        {tab === 'workflows' && <Workflows />}
        {tab === 'context' && <Context />}
      </main>
    </div>
  );
}
