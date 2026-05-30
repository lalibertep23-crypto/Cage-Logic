# Cage Logic — Session Handoff (Chris ↔ Claude)

**Date:** 2026-05-29 (session 3)
**Purpose:** Ground truth for next session. Paste at top of next chat.
**Repo access:** Folder `C:\Users\cdena\OneDrive\Documents\GitHub\Cage-Logic` is connected and persists.

---

## 1. Operating canon (do not violate)

- **Frankie demo is the gating event.** Everything routes through "does Frankie see this in the demo?"
- **Build target = the HTML prototype** (`docs/demo-package/CageLogic_Demo_Prototype.html`). Next.js app is the data layer behind it.
- **Demo data: simulated.** Frankie = hero profile; Chris's real logs power Session Log + Comp Prep.
- **Pitch flow:** retention first (Day One → Coach), then upside (Athlete → Comp / Log → Technique Library). Asks: call Ricardo, 5 athletes in Vegas, son on wrestling.
- **Locked voice:** direct, dry, factual. No motivational filler, no exclamation marks, no emojis. Mirror, not megaphone.
- **Locked design tokens (canonical — Patrick confirmed):** void `#050505`, panel `#111111`, raised `#1E1E1E`, brass `#C8943A`, amber `#FFB627`, offwhite `#F2EFE8`, secondary `#8E8577`, danger `#A43A2F`, green `#5C8A3C`. Fonts: Anton (headers) / Bebas Neue (labels) / DM Mono (data).
- **Lanes:** palette/schema/app-code = Patrick. BJJ content, demo/instructor design, Frankie/Iron Army relationships = Chris.
- **Push protocol:** Chris cleared to build unbuilt screens; tells Patrick when pushing.

---

## 2. Standing decisions (from Patrick, still in force)

- Palette: locked/prototype tokens canonical. Next.js app drift = refactor (Patrick + Claude, screen by screen).
- Label font: Bebas Neue.
- Daily quotes: kept, strict curation (Frankie/Danaher, lineage-specific, novel). Charter line "no motivational filler." Chris owns implementation.
- Criteria screen reframe: greenlit (belt-cloth visual, kill all-done + "ready to talk to your coach," celebrate after promotion-log event). Chris owns.

---

## 3. What was completed this session

- **Stripe-content review** of all 25 BJJ criteria entries in `src/app/(app)/progression/criteria/page.tsx`. Committed + pushed:
  - Readiness moved to **stripe 4** for all belts. Added `purple_4` (Brown Belt Readiness) + `brown_4` (Black Belt Readiness); reworked `purple_3` (Defined and Known) + `brown_3` (The Complete Game) into skill phases. Fixed the 4th-stripe fallback bug (was showing stripe-0 content).
  - `black_4`: 13 → **14 years** (IBJJF degree schedule).
  - `brown_4`: brown→black minimum corrected to **1 year** (IBJJF).
  - Blue kneebar/ankle lock labeled **Coach's Discretion** (matches Iron Army practice — leg locks to some blue belts at coach discretion).
  - "Finding your game" duplicate phase confirmed intentional (recurring theme) — left as is.
- **Frankie profile card spec finalized** (`outputs/CageLogic_Spec_Frankie-Profile-Card_2026-05-29.md`). All four highlight cards (UFC athlete page, IG, two fight clips) tap-tested and confirmed working. No open link questions. Patrick clear to build the card.

(Prior session, already pushed: Coach view RECENT CANCELS placeholder; Technique Library cut to single Hip Toss tile with real Iron Army footage; demo-clips added; Patrick handoff.)

---

## 4. Open items / what's next

### Chris's lane
1. **Rank badge art** — 2×2 discipline cards on home screen need cultural accuracy (gi texture, hand wraps, headgear). Placeholders currently show on the demo. Heavier task — likely needs real images / a designer. NOT YET STARTED. Likely next session's first move.
2. **Purple→brown class count** — `purple_4` requirement currently says "Coach Tracked" (no number). Drop in Iron Army's figure when known.
3. **Capture more Iron Army clips** when ready — drop in `docs/demo-package/demo-clips/`, named to match prototype refs.

### Patrick's lane / in flight
- Palette migration in Next.js app (Patrick + Claude, screen by screen).
- Profile page redesign (baseball-card layout) — build the Frankie card from the finalized spec.
- Criteria screen reframe (belt-cloth visual etc.) — note the criteria content now goes to stripe 4 per belt.
- Badge system design (43 badges drafted).
- Legal docs drafted (Privacy Policy, ToS, Security Summary).
- **Brief #2 demo-readiness answers still pending:** Profile built? Comp Prep built? Taper framework in code? `competition_type` enum + Aug 22 Vegas? Bugs A (technique-entry Enter) + B (session edit)?
- **RECENT CANCELS data source** — no membership/cancellation data in model; placeholder for demo; needs CRM/Smoothcomp decision for real.

---

## 5. Known repo cruft (clean up when convenient)

- `docs/demo-package/__wtest` — empty test file (OneDrive blocked deletion).
- `docs/demo-package/demo-clips/demo-clips/` — empty nested folder.
- Unused clips in `demo-clips/`: `tech-1`–`tech-8` (18-sec snippets), `tech-2` corrupt. Nothing references them; only `hip-toss.mp4` + `frankie-welcome.mp4` are in use.
- Comp screen countdown hardcoded "92 DAYS OUT" (anchored to May 22) — should compute from event date when Comp goes live.

---

## 6. Push protocol note

If `index.lock` blocks a commit again: close GitHub Desktop, run in PowerShell —
`Remove-Item "C:\Users\cdena\OneDrive\Documents\GitHub\Cage-Logic\.git\index.lock" -Force` — reopen, commit.
Sandbox git can lag Chris's live machine; GitHub Desktop is the source of truth for what pushes.

---

## 7. Voice / behavior reminders for next-session Claude

- Operator mode. One step at a time unless asked. Multiple-choice with recommendation.
- Flag drift with "PAUSE." Lane check before answering — app code/schema/palette is Patrick's.
- Calibrated truthfulness: verify in-session; don't invent Iron Army standards (e.g., class counts) — flag for Chris to set.
- Charter rule: "No daily quotes of the generic kind, no leaderboards, no celebrations of mediocrity / no motivational filler."

— End of handoff —
