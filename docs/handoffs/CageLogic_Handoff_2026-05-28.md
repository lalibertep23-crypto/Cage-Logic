# Cage Logic — Session Handoff (Chris ↔ Claude)

**Date:** 2026-05-28
**Purpose:** Ground truth for next session. Paste at top of next chat.
**Repo access:** Folder `C:\Users\cdena\OneDrive\Documents\GitHub\Cage-Logic` is connected and persists — Claude will have access without re-connecting.

---

## 1. Operating canon (do not violate)

- **Frankie demo is the gating event.** Everything routes through "does Frankie see this in the demo?" If not, it parks.
- **Build target = the HTML prototype** (`docs/demo-package/CageLogic_Demo_Prototype.html`). The Next.js app is the data layer behind it (Profile + Comp Prep + Log render with populated demo account).
- **Demo data approach: simulated.** Reversed the 5/22 "Approach A" (Chris's real log). New: separate populated demo account, persona = Chris D. (loose model of Chris), ~26 sessions across 30 days. Spec finalized in `Cage-Logic-Spec_Simulated-Demo-Account_v2_2026-05-28.docx`.
- **Frankie's profile is still the hero** in the Profile screen. That didn't change.
- **Pitch flow stays as written in the walkthrough script:** retention first (Day One → Coach), then upside (Athlete → Comp / Log → Technique Library). Ask: call Ricardo, 5 athletes in Vegas, son on wrestling.
- **Locked voice rules** (from Readiness Tracker §5): direct, dry, factual. No motivational language, no exclamation marks, no emojis, no "great job." Numbers over adjectives. Mirror, not megaphone.
- **Locked design tokens** (Readiness Tracker §5 — these are now in the prototype HTML):
  - `--void: #050505`, `--panel: #111111`, `--raised: #1E1E1E`
  - `--brass: #C8943A`, `--amber: #FFB627`
  - `--offwhite: #F2EFE8`, `--secondary: #8E8577`
  - `--danger: #A43A2F` (score-red brick `#8B3A1E`)
  - Fonts: Anton (headers) / Bebas Neue (labels) / DM Mono (data)

---

## 2. Outstanding decisions

| Item | Status | Owner | Notes |
|---|---|---|---|
| Daily quotes — soften charter rule or keep absolute? | OPEN | Patrick | Brand-cultural brief #1 still parked. Locked voice rules in the Readiness Tracker may make this answer obvious (keep absolute). Revisit before sending brief #1. |
| Criteria screen UX — kill all-done state, replace counter with belt visual, reframe as "map of journey" | OPEN | Patrick | Tied to brief #1. May already be in flight per Chris ("Patrick may already be working on something like this"). |
| BRS retake celebration — moves to AFTER promotion-log event, not checkbox-complete | OPEN | Patrick | Sub-item of criteria screen reframe. |
| "Chris D." persona is close to real-Chris — could confuse Frankie about real vs simulated data | RESOLVED | Chris | Chris is not worried. Frankie just wants to see if it works. Keep "Chris D." |
| 168 lb weight division for demo account — non-standard IBJJF | OPEN | Patrick | Confirm against actual UFC BJJ Opens weight rules. Substitute if needed. |
| Taper conflict (Patrick's −10/−20/−30% vs research-backed framework) | RESOLVED in spec | Patrick to confirm in code | Awaiting status in demo-readiness brief. |

---

## 3. Patrick action items (questions sent / pending)

### Brief #1 — Brand-cultural review (PARKED — do not send yet)
File: `outputs/Cage-Logic-Brief_Brand-Cultural-Review_2026-05-28.docx`
**Why parked:** softening "no daily quotes" may contradict the LOCKED voice rules from the Readiness Tracker. Revisit before sending.

### Brief #2 — Demo readiness check (READY TO SEND)
File: `outputs/Cage-Logic-Brief_Demo-Readiness-Check_2026-05-28.docx`
**Asks Patrick to answer:**
1. Is Athlete Profile built and demo-able?
2. Is Comp Prep Hub built and demo-able?
3. Did the research-backed taper framework replace −10/−20/−30% in code?
4. Did "UFC BJJ Opens" land in `competition_type` enum + Aug 22 Vegas?
5. Bugs A (technique-entry Enter) + B (session edit not full edit) — landed or pending?

Also confirms simulated demo account plan + prototype-as-demo plan.

### Demo account spec (READY TO SEND with brief #2)
File: `outputs/Cage-Logic-Spec_Simulated-Demo-Account_v2_2026-05-28.docx`
30-day data spec for the populated demo account.

---

## 4. What was completed this session

- Connected the Cage-Logic repo to Claude's file access. Persists across sessions.
- Read CLAUDE.md, AGENTS.md, README.
- Surveyed the codebase. Confirmed Next.js + Tailwind + shadcn + Supabase stack. Onboarding flow exists (9 steps). Criteria screen exists with substantive content (not placeholder as briefing claimed).
- Walked white belt stripe content (white_0 → white_4). All confirmed. white_2 had a wrong objective (knee cut pass is not a side control escape) — committed fix. Re-framed as "Building a Top Game."
- Identified daily quotes feature on home screen as charter violation. Drafted brief #1 to Patrick. Parked after realignment with Readiness Tracker locked voice.
- Read the full demo package (10 docs) Chris dropped in. Restructured task list to match canonical plan.
- Saved demo package to `Cage-Logic/docs/demo-package/`.
- Drafted demo-readiness brief #2 + simulated demo account spec v2. Both ready to send.

---

## 5. What's next (in order)

1. **Send Patrick brief #2 + demo spec.** Wait for his answers. Everything downstream depends on them.
2. **In parallel (while waiting on Patrick):** reconcile brief #1 with locked voice rules. Decide if daily quotes are killed (charter wins) or kept (Chris's read). Send or delete.
3. **When Patrick answers:** route his answers into next moves —
   - If Profile + Comp Prep built → demo account population can start
   - If not → build sprint required first
   - If taper not corrected in code → block on that
   - If bugs A/B still open → block live log demo
4. **Parked, post-demo:** blue belt → black belt stripe walkthrough (blue_0 was open when we pivoted). Full criteria screen UX reframe.

---

## 6. Files generated this session (in `outputs/`)

- `Cage-Logic-Brief_Brand-Cultural-Review_2026-05-28.docx` — PARKED
- `Cage-Logic-Brief_Demo-Readiness-Check_2026-05-28.docx` — READY
- `Cage-Logic-Spec_Simulated-Demo-Account_v2_2026-05-28.docx` — READY
- `CageLogic_Handoff_2026-05-28.md` — this file

## Files committed to repo

- `src/app/(app)/progression/criteria/page.tsx` — white_2 phase reframe (commit message: `fix: white_2 stripe — reframe as Building a Top Game (was Foundation Survival, mismatched objective)`)
- `docs/demo-package/` — full May 22 demo package added to repo

(Neither has been pushed yet — use GitHub Desktop to commit + push when ready.)

---

## 7. Task list state (carry into next session)

**In-flight / waiting:**
- #12 Confirm Profile + Comp Prep build status with Patrick
- #13 Bug A — technique-entry Enter
- #14 Bug B — session edit full edit
- #17 Simulated 30-day demo account — content design (spec done; awaiting Patrick build)

**Parked (post-demo):**
- Blue belt → black belt stripe walkthrough
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
- Charter rule that almost got softened today: **"No daily quotes, no leaderboards, no celebrations of mediocrity."** Treat as locked unless Patrick explicitly overrides.

— End of handoff —
