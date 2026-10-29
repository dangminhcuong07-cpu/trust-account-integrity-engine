# Lessons (read before changing the demo)

One line per lesson: **what happened → the rule → where it's handled.** The engine's own lessons are in the core repo's `docs/LESSONS.md`.

## Data comes from the engine
- **`src/data.ts` and `public/exception_report.pdf` were a 26 July run with 11 rules** while the engine shipped 13 → after any engine change, rerun `python run.py --config trust_domain/config/coastal_law.toml --as-at 2026-06-25` in the core repo and copy `output/coastal_law/data.ts` and `exception_report.pdf` here (README "Updating the demo data").
- **Rule counts were typed by hand in 6 places** ("7-rule", "Eleven", "11 rules") → use `complianceChecks.length` (`RULE_COUNT` in `App.tsx`); never type a count. The landing page's `RULES` table is still a hand-kept list: check it against the engine's `RULE_METADATA`.
- **R14 showed as "passed" when it never ran**, and after core PR #8 the new status would have shown as a red FAIL → the `ComplianceCheck.status` union includes `'not_evaluated'`, rendered as a grey N/A with a note. Any new engine status needs a type plus a badge here before the data is regenerated.
- **Merge order:** engine PRs first, then regenerate data here, then merge the frontend.

## Layout and interaction
- **The impeccable critique (29 Oct) found bugs that "0 FAIL" from the taste inspector missed:** the live check called unreadable input clean; the report's detail panel ignored the filter; on phones the detail scrolled under the top bar; a minus sign split from its amount at 768px. Click-test states (bad input, filter change, phone tap), not only screenshots. Money is wrapped in `.money` (no wrap).
- **Direction B, "the printed report" (approved mockup, 29 Oct 2026), replaced the taste-skill look.** Serif titles, sans interface, ink on paper on a desk tone, red only for critical. Before merging a UI change run impeccable `detect` on `/` and `/#report` (needs `IMPECCABLE_BROWSER` pointed at a no-sandbox Chrome in a cloud session) and the click-through in the PR; 0 findings is the floor.
- **Every figure is computed from `data.ts`** (`src/lib/rules.ts`); `src/lib/plain.ts` turns the engine's log-style evidence into sentences by parsing it, so a new check needs a `PLAIN_NAME` and a `plainEvidence` case or it shows raw text. The live check (`src/lib/r01.ts`) treats unreadable or empty amounts as **Not run**, never as a pass.
- **On a 390px phone the 264px sidebar left a 126px content column** (one word per line) → below 760px the report's sidebar folds into a 48px top bar with a Menu sheet, and wide tables scroll inside their own card (`.ap-*` in `index.css`). Measure the content column width; "no horizontal overflow" alone missed this, because the column clipped.
- **Inline styles can't express `:active`, `:hover` or `:focus-visible`** → all styling is in `index.css` classes (`.btn`, `.lp-*` for the overview, `.ap-*` for the report, `.ui` for product fragments). No inline colours.
- **The focus ring was clipped on scrolling navs** (outline drawn outside an `overflow` box) → nav buttons use `outline-offset: -2px`.
- **The scroll reset only ran on tab change**, so entering the demo from the bottom of the landing page kept the scroll position → the effect depends on `[tab, showLanding]`.
- **Two predictions in the apple-design work were wrong:** removing unused font families didn't reduce font downloads (browsers only fetch faces in use), and "tab keeps old scroll" didn't reproduce. Write the prediction down before changing anything, then measure.

## What the page claims
- **Hidden prices still shipped**: `SHOW_PRICING = false` hid the table, but `$199/$349/$499` stayed readable in the public JS bundle → anything that must not be public is deleted from source, not hidden; check with `grep` on `dist/assets/*.js` after `npm run build`.
- **"Formatted for the NZLS Inspectorate" and "Authority · NZLS Inspectorate" implied the regulator set the format or backs the product** → say "to help you prepare for an inspection"; never name the Inspectorate as an authority for the product.
- **Name the product once: TrustSentry** (the name the engine's PDF already uses). The page, the report screen and the title all say TrustSentry.
- **A Gemini SDK dependency in a "no AI in the calculation" product** invites the wrong question → removed with the other unused packages. Removing them alone gave a byte-identical bundle.

## Known small debts
- `@types/express`, `tsx`, `esbuild` and the `clean` script (deletes `server.js`) served the removed server. Remove them in a lockfile-only PR.
- The four unrendered components (`LedgerSandbox`, `PricingCalculator`, `StrategicBrief`, `WorkflowDesigner`) and `sandbox_data.ts` were deleted in the redesign; restore from git history if needed.
- `lucide-react` is no longer imported; remove it in a lockfile-only PR.
