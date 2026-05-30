# Cage Logic — Session Handoff (Chris ↔ Claude)

**Date:** 2026-05-29 (session 2)
**Purpose:** Ground truth for next session. Paste at top of next chat.
**Repo access:** Folder `C:\Users\cdena\OneDrive\Documents\GitHub\Cage-Logic` is connected and persists.

---

## 1. Operating canon (do not violate)

- **Frankie demo is the gating event.** Everything routes through "does Frankie see this in the demo?"
- **Build target = the HTML prototype** (`docs/demo-package/CageLogic_Demo_Prototype.html`). Next.js app is the data layer behind it.
- **Demo data: simulated.** Frankie = hero profile; Chris's real logs power Session Log + Comp Prep.
- **Pitch flow:** retention first (Day One → Coach), then upside (Athlete → Comp / Log → Technique Library). Asks: call Ricardo, 5 athletes in Vegas, son on wrestling.
- **Locked voice rules:** direct, dry, factual. No motivational filler (charter line updated this session), no exclamation marks, no emojis. Mirror, not megaphone.
- **Locked design tokens (canonical — Patrick confirmed this session):**
  - `--void: #050505`, `--panel: #111111`, `--raised: #1E1E1E`
  - `--brass: #C8943A`, `--amber: #FFB627`
  - `--offwhite: #F2EFE8`, `--secondary: #8E8577`, `--danger: #A43A2F`, `--green: #5C8A3C`
  - Fonts: Anton (headers) / Bebas Neue (labels) / DM Mono (data)
- **Lanes:** palette/schema/app-code = Patrick. BJJ content, demo/instructor design, Frankie/Iron Army relationships = Chris.
- **Push protocol:** Chris is cleared to build unbuilt screens; must tell Patrick when pushing.

---

## 2. Decisions resolved this session (Patrick reply, 2026-05-29)

- **Palette: locked/prototype tokens are canonical.** Prototype is correct; Next.js app drifted (Patrick + Claude refactor it screen by screen). Chris aligns prototype content to locked tokens.
- **Label font: Bebas Neue** (over Barlow Condensed).
- **Daily quotes: KEPT** with strict curation — Frankie/Danaher only, lineage-specific, novel. Charter line now "no motivational filler." Chris owns implementation.
- **Criteria screen reframe: GREENLIT** — kill all-done state + "READY TO TALK TO YOUR COACH" copy; belt-cloth visual where stripes accumulate; reframe as map of the journey; celebration moves to after promotion-log event. Chris owns the change.

---

## 3. Open items / what's next

### Chris's lane (demo-gating, in order)
1. **Rank badge art** — 2×2 discipline cards on home screen need cultural accuracy (gi texture, hand wraps, headgear). Placeholders currently show on the demo. Heavier task — likely needs real images / designer.
2. **Frankie profile card** — spec is DONE (`outputs/CageLogic_Spec_Frankie-Profile-Card_2026-05-29.md`). Patrick builds it into the Next.js Profile screen for the demo account.
3. **White belt stripe-content review** — beyond the committed white_2 knee-cut reframe, walk remaining criteria content for errors.
4. **Tap-test Frankie highlight links** — UFC athlete page works; IG stable; two optional official fight-clip links to verify (`atKhoDoO3X0`, `ZneNpWXFGOU`). Only keep links that play. The 3 prior BJ Penn clip links are DEAD (unofficial UFC uploads, pulled).
5. **Capture more Iron Army clips** when ready — drop in `docs/demo-package/demo-clips/`, named to match prototype refs.

### Patrick's lane / in flight
- Palette migration in Next.js app (Patrick + Claude, screen by screen)
- Profile page redesign (baseball-card layout, matches prototype athlete view)
- Badge system design (43 badges drafted)
- Legal docs drafted (Privacy Policy, ToS, Security Summary)
- **Brief #2 demo-readiness answers still pending:** Profile built? Comp Prep built? Taper framework in code? `competition_type` enum + Aug 22 Vegas? Bugs A (technique-entry Enter) + B (session edit)?
- **RECENT CANCELS data source** — no membership/cancellation data in model; placeholder for demo; needs CRM/Smoothcomp decision for real.

---

## 4. What was completed this session

- Ran design drift audit → report + brief to Patrick (committed earlier). Patrick resolved palette in his reply.
- **Coach view:** added RECENT CANCELS section (SAMPLE placeholder) between At-Risk and Stripe Review.
- **Technique Library:** rebuilt from generic placeholders → cut to a single **HIP TOSS** tile wired to real Iron Army footage (`hip-toss.mp4`, Bobby Johnson, 89s). Tried YouTube embeds first — failed (error 153 on local file + embed locks); reverted. Then used Chris's own Drive clip.
- Pulled 9 demo clips from Chris's Drive into `demo-clips/`; `frankie-welcome.mp4` (Day One) + `hip-toss.mp4` (Library) are the two in use.
- Built `CageLogic_Demo_for_Patrick.zip` (prototype + 2 clips) for review.
- Drafted Patrick handoff + Frankie profile build spec (both in `outputs/`).
- Pushed the demo work (15 files). Resolved a `.git/index.lock` commit failure (Chris deleted the lock via PowerShell).

---

## 5. Known repo cruft (clean up when convenient)

- `docs/demo-package/__wtest` — empty test file (OneDrive blocked deletion).
- `docs/demo-package/demo-clips/demo-clips/` — empty nested folder from a misplaced drop.
- Unused clips in `demo-clips/`: `tech-1`–`tech-8` (18-sec snippets), `tech-2` is corrupt. Nothing references them.
- Comp screen countdown is hardcoded "92 DAYS OUT" (anchored to May 22) — should compute from event date when Comp goes live.

---

## 6. Voice / behavior reminders for next-session Claude

- Operator mode. Not brainstorm partner. One step at a time unless asked.
- Multiple-choice with recommendation, not open-ended.
- Flag drift with "PAUSE." Lane check before answering — app code/schema/palette is Patrick's.
- Calibrated truthfulness: verify in-session; the sandbox git view can lag Chris's live machine (caused a 76-vs-15 file-count scare this session — GitHub Desktop was correct).
- Charter rule: "No daily quotes of the generic kind, no leaderboards, no celebrations of mediocrity / no motivational filler."

— End of handoff —
