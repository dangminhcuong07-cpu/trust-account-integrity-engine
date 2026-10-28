# Lessons (read before changing the demo)

One line per lesson: **what happened → the rule → where it's handled.** The engine's own lessons are in the core repo's `docs/LESSONS.md`.

## Data comes from the engine
- **`src/data.ts` and `public/exception_report.pdf` were a 26 July run with 11 rules** while the engine shipped 13 → after any engine change, rerun `python run.py --config trust_domain/config/coastal_law.toml --as-at 2026-06-25` in the core repo and copy `output/coastal_law/data.ts` and `exception_report.pdf` here (README "Updating the demo data").
- **Rule counts were typed by hand in 6 places** ("7-rule", "Eleven", "11 rules") → use `complianceChecks.length` (`RULE_COUNT` in `App.tsx`); never type a count. The landing page's `RULES` table is still a hand-kept list: check it against the engine's `RULE_METADATA`.
- **R14 showed as "passed" when it never ran**, and after core PR #8 the new status would have shown as a red FAIL → the `ComplianceCheck.status` union includes `'not_evaluated'`, rendered as a grey N/A with a note. Any new engine status needs a type plus a badge here before the data is regenerated.
- **Merge order:** engine PRs first, then regenerate data here, then merge the frontend.

## Layout and interaction
- **On a 390px phone the 264px sidebar left a 126px content column** (one word per line) → below 760px the sidebar becomes a sticky tab bar and wide tables scroll sideways (`.app-*`, `.wide-table`, `.stack-sm` in `index.css`). Measure the content column width; "no horizontal overflow" alone missed this, because the column clipped.
- **Inline styles can't express `:active`, `:hover` or `:focus-visible`**, so buttons had no press feedback and hover was mouse-only JS → use the `.press` and `.link-u` classes and the global focus rule in `index.css`.
- **The focus ring was clipped on scrolling navs** (outline drawn outside an `overflow` box) → nav buttons use `outline-offset: -2px`.
- **The scroll reset only ran on tab change**, so entering the demo from the bottom of the landing page kept the scroll position → the effect depends on `[tab, showLanding]`.
- **Two predictions in the apple-design work were wrong:** removing unused font families didn't reduce font downloads (browsers only fetch faces in use), and "tab keeps old scroll" didn't reproduce. Write the prediction down before changing anything, then measure.

## What the page claims
- **Pricing is undecided and the demo is linked from research requests** → prices hidden (`SHOW_PRICING = false` on the landing page; the Fee Estimate tab is removed from the navigation). The figures are still in the JS bundle; delete them if pricing must not be public at all.
- **Name the product once.** The page mixes "Trust Account Integrity Engine" and "TrustSentry"; the runbook decision is to pick TrustSentry. Until the rename, say "the engine".
- **A Gemini SDK dependency in a "no AI in the calculation" product** invites the wrong question → removed with the other unused packages. Removing them alone gave a byte-identical bundle.

## Known small debts
- `@types/express`, `tsx`, `esbuild` and the `clean` script (deletes `server.js`) served the removed server. Remove them in a lockfile-only PR.
- `LedgerSandbox.tsx`, `PricingCalculator.tsx`, `StrategicBrief.tsx` and `WorkflowDesigner.tsx` (about 1,500 lines) aren't rendered. `LedgerSandbox` maps `not_evaluated` to `passed`; fix or delete it before reusing any of them.
- The FEES table is duplicated in `App.tsx` and `LandingPage.tsx`.
