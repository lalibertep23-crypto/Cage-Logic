# Cage Logic — Logging UX: Make It Fast, Not Homework

**From:** Chris
**Date:** 2026-05-29
**For:** Patrick (implementation — app code / your lane)
**File:** `src/app/(app)/log/log-form.tsx` (sections 01–06)
**Guiding rule:** Quick by default, depth on demand. A student logs a real session in ~2 taps, and *chooses* to go deeper.

---

## The problem

Logging feels like homework. Three specific causes (not the whole form):

1. **Everything renders expanded.** All six sections are visible on every log, so even the OPTIONAL ones (Rolls, Reflection, Focus) get scrolled past every time. Long scroll reads as a checklist.
2. **Reflection is five separate text boxes** (skills executed, what clicked, what to fix, question for coach, follow-up notes). Five blank boxes = an assignment.
3. **Each Roll is heavy** — partner, belt, stripes, weight, outcome, "what it felt like," plus submission chain. Six rounds = a wall of inputs.

## What's already good (keep these)

Tap segments (session type, outcome), 1–10 tap scales (energy/intensity), technique chips, partner autocomplete, draft autosave, OPTIONAL flags. The bones are solid — this is about disclosure and defaults, not a rebuild.

---

## The fix — all UI/disclosure, no data removed

**Decision: hide, don't cut.** Every field that exists today stays and is still stored. We're changing *when* fields appear, not *what* is captured. Score inputs unchanged. No schema or scoring changes.

### 1. Quick log = ~2 taps (do first)
- Default session type to **last-used** (not always GI). Date/time/duration already auto-fill.
- With optional sections collapsed (below), the bottom **LOG SESSION** button becomes a true quick save: open → confirm type → save.

### 2. Collapse the optional sections (do first — biggest feel win, zero data risk)
- Sections **03 Rolls, 05 Reflection, 06 Current Focus** start collapsed behind a single tap: "+ Add rolls", "+ Add reflection", "+ Add focus."
- Out of sight = not homework. Same fields, same data when expanded.

### 3. Reflection: one box by default
- Default to a single **Notes** textarea.
- The structured prompts (`skillsExecuted`, `whatClicked`, `whatDidnt`, `questionForCoach`, `followUpNotes`) become **tap-to-add chips** — revealed only if the athlete wants the structure. All five fields still exist and still save when used; they're just not shown by default.
- Comp-prep athletes tap to expand the full set; the Tuesday-night student writes one line or nothing.

### 4. Rolls: lightweight by default
- A new roll defaults to **partner (autocomplete) + outcome (tap)** only.
- Belt, stripes, weight, "what it felt like," and submission chain all hide behind a per-roll **"+ detail"** tap.
- Most nights a roll is two taps; the detail is there when it matters.

### 5. Voice-to-text on text fields (recommended add)
- Add a **mic button** to the free-text fields (Notes / reflection / "what it felt like").
- Biggest single "not homework" lever — talk 20 seconds instead of typing. Browser speech-to-text or a documented reliance on native keyboard dictation; your call on approach.

### 6. Recent-first technique picker, curriculum-linked
- Open the picker to **"This week's class"** (from the Iron Army 14-week curriculum map already in the repo) + **"Recently logged"** — not an empty search box.
- This is MyFitnessPal's "recent foods" pattern: most logs become one tap because you train the same positions week to week. Strongest single idea borrowed from MFP.

### 7. Repeat last session
- One tap clones the last session (type, duration, instructor) to edit — MFP's "saved meals." Recurring training is most logs.

### 8. Tap-to-count rolls (recommended — changes data input, your call)
- The closest BJJ apps (BJJ Notes, RollData) sell "log a roll in seconds" by making rolls one-tap **countable events** — tapped them / got tapped / swept / passed — and *deriving* metrics, instead of asking for prose.
- Recommend shifting roll capture toward tap-counts with free text optional. This changes what's stored, so it's a data-model call on your end.

> **Informed by:** MyFitnessPal (recent-first, saved meals, voice, never-a-blank-box) and BJJ Notes / RollData (log in seconds via tap-to-count). Deliberately **not** copying their leaderboards / social scoreboards / streak gamification — that violates the "mirror, not megaphone" charter. We take their input speed, not their scoreboard.

---

## Suggested build order

1. Collapse optional sections + last-used session-type default (UI only — ship this alone and it already fixes most of the feeling).
2. Recent-first / curriculum-linked picker + repeat-last-session (biggest speed wins after #1).
3. Reflection → one box + optional prompt chips.
4. Rolls → partner+outcome default, rest behind "+ detail."
5. Voice input on text fields.
6. Tap-to-count rolls (data-model call).

## Phase 2 — make logging *worth it* (analytics layer — your lane)

Speed gets them to log; payoff keeps them logging. Right now the reward for filling fields is invisible, which is half of why it feels like a chore. These are analytics-layer ideas (your lane), and every one must obey the charter — mirror, not megaphone; factual, no celebration:

- **One factual insight after each log** — e.g. "3rd session this week" or "8 knee cuts logged this month, 0 escapes." Turns logging into a mirror with an immediate payoff.
- **Coach-question inbox** — the "question for coach" entries collect into a list to bring to class. Gives that field a real purpose.
- **Confidence-file payoff** — surface "skills executed well" as a comp-prep tally ("wins banked for Aug 22"), tying logging to the Comp Prep layer.
- **Post-class capture nudge** — optional reminder ~30 min after your usual class time → one-tap quick log while memory's fresh.

Near-term = Phase 1 (speed). Phase 2 = the payoff loop, once Phase 1 ships.

## Out of scope (revisit later)

No fields removed, no scoring/data-model changes. If after a few weeks of use some fields are clearly dead weight, we cut them then — together. For now everything is preserved, just progressively disclosed.

## Open question for Patrick

Voice input — feasible in the current stack without heavy lift, or better as a fast-follow? Flag if it changes the build order.
