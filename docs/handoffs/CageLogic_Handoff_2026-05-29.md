# Cage Logic — Session Handoff (Chris ↔ Claude)

**Date:** 2026-05-29
**Purpose:** Ground truth for next session. Paste at top of next chat.
**Repo access:** Folder `C:\Users\cdena\OneDrive\Documents\GitHub\Cage-Logic` is connected and persists.

---

## 1. Operating canon (do not violate)

- **Frankie demo is the gating event.** Everything routes through "does Frankie see this in the demo?" If not, it parks.
- **Build target = the HTML prototype** (`docs/demo-package/CageLogic_Demo_Prototype.html`). The Next.js app is the data layer behind it (Profile + Comp Prep + Log render with populated demo account).
- **Demo data approach: simulated.** Separate populated demo account, persona = Chris D., ~26 sessions across 30 days. Spec: `Cage-Logic-Spec_Simulated-Demo-Account_v2_2026-05-28.docx`.
- **Frankie's profile is still the hero** in the Profile screen.
- **Pitch flow stays as written:** retention first (Day One → Coach), then upside (Athlete → Comp / Log → Technique Library). Ask: call Ricardo, 5 athletes in Vegas, son on wrestling.
- **Locked voice rules:** direct, dry, factual. No motivational language, no exclamation marks, no emojis, no "great job." Numbers over adjectives. Mirror, not megaphone.
- **Locked design tokens** (prototype HTML — confirmed present this session):
  - `--void: #050505`, `--panel: #111111`, `--raised: #1E1E1E`
  - `--brass: #C8943A`, `--amber: #FFB627`
  - `--offwhite: #F2EFE8`, `--secondary: #8E8577`
  - `--danger: #A43A2F`, `--green: #5C8A3C`, `--line: #2a2a2a`
  - Fonts: Anton (headers) / Bebas Neue (labels) / DM Mono (data)

---

## 2. Outstanding decisions

| Item | Status | Owner | Notes |
|---|---|---|---|
| **Canonical palette: locked tokens vs Warm Concrete** | **OPEN — NEW** | Patrick | Audit this session found 3 palettes live at once. Decision blocks the color refactor. Chris's vote: locked/prototype tokens. See drift report + brief. |
| Label font: Bebas Neue (prototype) vs Barlow Condensed (code) | OPEN — NEW | Patrick | Sub-item of palette decision. |
| Daily quotes — soften charter rule or keep absolute? | OPEN | Patrick | Brief #1 parked. Locked voice rules likely make this "keep absolute." |
| Criteria screen UX reframe (belt visual, kill all-done state) | OPEN | Patrick | May already be in flight. |
| BRS retake celebration moves to AFTER promotion-log event | OPEN | Patrick | Sub-item of criteria reframe. |
| 168 lb weight division for demo account — non-standard IBJJF | OPEN | Patrick | Confirm vs UFC BJJ Opens weight rules. |
| Taper conflict (−10/−20/−30% vs research framework) | RESOLVED in spec | Patrick to confirm in code | Awaiting demo-readiness answer. |

---

## 3. Patrick action items (sent / pending)

### Brief #2 — Demo readiness check (SENT — awaiting answers)
File: `outputs/Cage-Logic-Brief_Demo-Readiness-Check_2026-05-28.docx`
Sent with the demo account spec. **Awaiting Patrick's answers** — everything downstream depends on them:
1. Is Athlete Profile built and demo-able?
2. Is Comp Prep Hub built and demo-able?
3. Did the research-backed taper framework replace −10/−20/−30% in code?
4. Did "UFC BJJ Opens" land in `competition_type` enum + Aug 22 Vegas?
5. Bugs A (technique-entry Enter) + B (session edit not full edit) — landed or pending?

### Demo account spec (SENT with brief #2)
File: `outputs/Cage-Logic-Spec_Simulated-Demo-Account_v2_2026-05-28.docx`

### Design drift brief (NEW — READY TO SEND / committed + pushed)
Files: `outputs/CageLogic_Brief_Design-Drift-To-Patrick_2026-05-29.md` + `outputs/CageLogic_Design-Drift-Report_2026-05-29.docx`
Asks Patrick to pick the canonical palette and own the token refactor.

### Brief #1 — Brand-cultural review (PARKED — do not send yet)
File: `outputs/Cage-Logic-Brief_Brand-Cultural-Review_2026-05-28.docx`
**Why parked:** softening "no daily quotes" may contradict locked voice rules. Revisit before sending.

---

## 4. What was completed this session

- Ran a full color / font / voice audit across the demo surface and the whole Next.js app.
- **Key finding:** 3 color systems live at once. Of 78 screens that hardcode colors — 50 use the "Warm Concrete" theme (`#D4922E` amber, `#1A1713` bg, `#3D8B55` green), 19 use the locked/prototype palette (`#C8943A`, `#050505`, `#F2EFE8`), 6 mix both, 3 are off-palette.
- **Root cause:** `globals.css` defines theme tokens, but ZERO of the 78 screens reference them — every screen hardcodes raw hex. No single source of truth.
- **Demo surface specifically:** Log = locked palette (on theme); Comp Prep + prep screens = Warm Concrete; Profile = off-palette steel-blue `#8A9BAE`. Three screens, three looks.
- **Voice: clean.** No exclamation marks, no emojis (✓/✗ are UI glyphs), no motivational copy on demo screens.
- **Fonts:** prototype Bebas Neue vs code Barlow Condensed for labels; Anton + DM Mono match.
- Produced drift report `.docx` (validated) + a single markdown brief to Patrick. Both saved to `outputs/`, committed, and pushed.

---

## 5. What's next (in order)

1. **Wait on Patrick — two threads:** (a) brief #2 demo-readiness answers, (b) canonical palette decision.
2. **When palette is decided:** Patrick owns the token refactor (move palette into `globals.css` tokens, replace hardcoded hex starting with the 3 demo screens). Chris aligns prototype/content; does NOT touch the theme unilaterally.
3. **When Patrick answers brief #2:** route into next moves —
   - Profile + Comp Prep built → start demo account population
   - Not built → build sprint first
   - Taper not corrected in code → block on that
   - Bugs A/B still open → block live log demo
4. **In parallel:** reconcile brief #1 with locked voice rules — kill or send.
5. **Parked, post-demo:** blue → black belt stripe walkthrough; full criteria screen UX reframe.

---

## 6. Files generated this session (in `outputs/`)

- `CageLogic_Design-Drift-Report_2026-05-29.docx` — full audit, file-by-file appendix. Committed + pushed.
- `CageLogic_Brief_Design-Drift-To-Patrick_2026-05-29.md` — cover brief + the one decision. Committed + pushed.
- `CageLogic_Handoff_2026-05-29.md` — this file.

---

## 7. Task list state (carry into next session)

**In-flight / waiting:**
- Patrick: brief #2 demo-readiness answers
- Patrick: canonical palette decision (+ label font)
- #12 Confirm Profile + Comp Prep build status with Patrick
- #13 Bug A — technique-entry Enter
- #14 Bug B — session edit full edit
- #17 Simulated 30-day demo account — content design (spec done; awaiting Patrick build)

**Parked (post-demo):**
- Color token refactor (Patrick-led, after palette decision)
- Blue → black belt stripe walkthrough
- Criteria screen UX reframe
- Daily quotes decision

---

## 8. Voice / behavior reminders for next-session Claude

- Operator mode. Not brainstorm partner.
- One step at a time unless asked for more.
- Multiple-choice with recommendation, not open-ended.
- Flag drift with "PAUSE." Do not wait for Chris to ask.
- Read canonical docs first (this handoff + `docs/demo-package/START_HERE_Patrick.md` + `CageLogic_Demo_Readiness_Tracker.md`) before doing anything new.
- Calibrated truthfulness: don't claim a feature is built without checking the code.
- Lane check: palette/token/design-system decisions are Patrick's lane. Chris provides evidence and aligns content; does not rewrite the theme.
- Charter rule still locked: **"No daily quotes, no leaderboards, no celebrations of mediocrity."**

— End of handoff —
