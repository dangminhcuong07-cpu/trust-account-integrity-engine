import { useEffect, useRef, useState } from 'react';
import EngineResults from './components/EngineResults';
import LandingPage, { type EnterOptions } from './components/LandingPage';
import { CHECKS, FINDINGS, LCA_URL, LINKEDIN_URL, NOT_RUN, NZLS_URL, STATUTORY_COUNT } from './lib/rules';
import { findingSpan } from './lib/plain';

type Tab = 'findings' | 'about';
const NAV: { id: Tab; label: string; count?: number }[] = [
  { id: 'findings', label: 'Exception report', count: FINDINGS.length },
  { id: 'about', label: 'About this sample' },
];
const SPAN = findingSpan(FINDINGS);

function About() {
  const facts = [
    { h: 'The certificate is due on the 10th working day', b: 'For the month before; for December, the 15th working day of January. If the account does not reconcile, the certificate is still filed on time, with an explanation. Late certificates are recorded and passed to the inspectors.', cite: 'NZLS trust account certificates FAQ', url: 'https://www.lawsociety.org.nz/professional-practice/legal-practice/trust-account-management/trust-account-certificates-faqs/' },
    { h: 'Every own-account practice with a trust account is inspected', b: 'The NZLS Inspectorate visits on a risk-based cycle. It reviewed 263 trust accounts in 2024/25.', cite: 'NZLS Annual Report 2024/25', url: 'https://www.lawsociety.org.nz/news/newsroom/law-societys-annual-report-released/' },
  ];
  return (
    <div className="ap-col about">
      <div className="ap-title"><div><h1>About this sample</h1><p>How the report was made, what the files need, and the sources behind it.</p></div></div>
      <section className="card">
        <h2>How it was made</h2>
        <ol>
          <li>The engine read six CSV files for a made-up firm: client ledger, trust bank statement, invoices, matters, allocations and reconciliations.</li>
          <li>It ran on one computer, with nothing uploaded: {CHECKS.length - NOT_RUN.length} of {CHECKS.length} checks ran. {STATUTORY_COUNT} checks cite the Lawyers and Conveyancers Act or its Trust Account Regulations; one is an internal control.</li>
          <li>It printed a dated exception report and an evidence pack. The findings here are that report, entries {SPAN.from} to {SPAN.to}.</li>
        </ol>
      </section>
      <section className="card">
        <h2>What your files would need</h2>
        <ul>
          <li>Dates as YYYY-MM-DD. A DD/MM/YYYY export needs the date column reformatted before saving.</li>
          <li>Amounts as plain numbers such as 15000.00: no currency signs or brackets, a minus sign for negatives.</li>
          <li>Your system’s column names, mapped once in the config file.</li>
          <li>It has not yet been run on a real firm’s export. If you would try it, <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">message me first</a> and we can check the mapping together.</li>
        </ul>
      </section>
      <section className="card">
        <h2>Where it fits</h2>
        <ul>
          <li><b>Before the monthly certificate:</b> run it on last month while a breach can still be explained or corrected.</li>
          <li><b>Before an inspection:</b> keep the dated reports as a record that the account was reviewed every month.</li>
          <li><b>Taking over as supervisor:</b> run it once on the account you inherit.</li>
          <li><b>After a correction:</b> run it again to confirm a finding has cleared.</li>
        </ul>
      </section>
      <section className="card">
        <h2>The rules around the certificate</h2>
        {facts.map(f => <p key={f.h}><b>{f.h}.</b> {f.b} <a href={f.url} target="_blank" rel="noopener noreferrer">{f.cite}</a></p>)}
        <h2 style={{ marginTop: 16 }}>Sources</h2>
        <ul>
          <li><a href="https://www.legislation.govt.nz/act/public/2006/0001/latest/whole.html" target="_blank" rel="noopener noreferrer">Lawyers and Conveyancers Act 2006, ss 110–116</a></li>
          <li><a href={LCA_URL} target="_blank" rel="noopener noreferrer">Lawyers and Conveyancers Act (Trust Account) Regulations 2008</a></li>
          <li><a href={NZLS_URL} target="_blank" rel="noopener noreferrer">NZLS Lawyers’ Trust Accounting Guidelines, June 2024</a></li>
        </ul>
      </section>
    </div>
  );
}

export default function App() {
  // #report opens the sample report directly, so it can be linked and bookmarked.
  const [view, setView] = useState<'landing' | 'app'>(() => (window.location.hash === '#report' ? 'app' : 'landing'));
  const [tab, setTab] = useState<Tab>('findings');
  const [opts, setOpts] = useState<EnterOptions>({});
  const [menu, setMenu] = useState(false);
  const firstNav = useRef<HTMLButtonElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onHash = () => setView(window.location.hash === '#report' ? 'app' : 'landing');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    if (view === 'app' && window.location.hash !== '#report') history.pushState(null, '', '#report');
    if (view === 'landing' && window.location.hash === '#report') history.pushState(null, '', window.location.pathname);
  }, [view]);
  // A new view starts at its top, not at the previous scroll position.
  useEffect(() => { window.scrollTo(0, 0); }, [tab, view]);
  useEffect(() => { document.title = view === 'landing' ? 'TrustSentry: read the exceptions before you sign' : 'Exception report · TrustSentry sample'; }, [view]);

  // Phone menu: Esc closes it and returns focus; the page behind does not scroll.
  useEffect(() => {
    if (!menu) return;
    firstNav.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); menuBtn.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [menu]);

  if (view === 'landing') {
    return <LandingPage onEnterDemo={o => { setOpts(o ?? {}); setTab('findings'); setView('app'); }} />;
  }

  const go = (t: Tab) => { setTab(t); setMenu(false); };

  return (
    <div className="ap">
      <a className="skip" href="#report-main">Skip to content</a>
      <div className="ap-topbar">
        <b>TrustSentry</b>
        <button ref={menuBtn} onClick={() => setMenu(m => !m)} aria-expanded={menu} aria-controls="ap-side">{menu ? 'Close' : 'Menu'}</button>
      </div>
      <aside id="ap-side" className={`ap-side${menu ? ' open' : ''}`}>
        <div className="ap-brand">TrustSentry</div>
        <div className="ap-scope">
          <b>Sample firm (synthetic)</b>
          <span>Entries {SPAN.from} to {SPAN.to}</span>
        </div>
        <nav className="ap-nav" aria-label="Sample report">
          {NAV.map((n, i) => (
            <button key={n.id} ref={i === 0 ? firstNav : undefined} aria-current={tab === n.id ? 'page' : undefined} onClick={() => go(n.id)}>
              <span>{n.label}</span>{n.count !== undefined && <span className="count">{n.count}</span>}
            </button>
          ))}
        </nav>
        <div className="ap-side-foot">
          <span>{CHECKS.length - NOT_RUN.length} of {CHECKS.length} checks run</span>
          <button onClick={() => { setMenu(false); setView('landing'); }}>Back to the overview</button>
        </div>
      </aside>
      <main id="report-main" className="ap-main">
        {tab === 'findings' && <EngineResults focus={opts.focus} />}
        {tab === 'about' && <About />}
      </main>
    </div>
  );
}
