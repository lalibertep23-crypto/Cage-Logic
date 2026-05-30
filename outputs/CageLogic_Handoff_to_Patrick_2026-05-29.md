# Cage Logic — Handoff to Patrick

**From:** Chris
**Date:** 2026-05-29
**Re:** Demo prototype changes (not yet pushed) + decisions on your side

---

## What this is

I made a round of changes to the demo prototype this session. Sending you the full working demo to review before I push. Once you've looked, I'll push to the repo and ping you per our protocol.

**Attached:** `CageLogic_Demo_for_Patrick.zip` — the prototype plus the two clips it uses.
To view: unzip first (extracting matters — videos won't play from inside the zip), then open `CageLogic_Demo_Prototype.html` in a browser. Plays offline, no setup. Day One plays the welcome clip; Technique Library plays the full Hip Toss clip.

---

## What changed in the prototype this session

1. **Coach view — added a RECENT CANCELS section.** Sits between At-Risk and Stripe Review. Marked SAMPLE. It's a placeholder — see the open decision below on where that data comes from.
2. **Technique Library — rebuilt.** Was generic INSTRUCTIONAL 1-8 placeholders. Now a single tile: **Hip Toss**, wired to real Iron Army footage (Bobby Johnson, 89s). I cut it down to one clip on purpose for the demo. Other clips and the category filter chips were removed.
3. **demo-clips/ folder added** to `docs/demo-package/` with the video files. ~19 MB. Fine for the repo, just a slower commit.

Voice/fonts unchanged. Everything else in the demo (Profile, Comp Prep, Log) is untouched.

---

## Decisions on your side (your lane)

| # | Item | What I need |
|---|---|---|
| 1 | **Canonical palette** — locked tokens vs Warm Concrete | See the design drift report (`CageLogic_Design-Drift-Report_2026-05-29.docx`). 78 screens hardcode color, none use the tokens, 3 palettes live at once. My vote: locked/prototype tokens. Your call, then the token refactor is yours. |
| 2 | **Label font** — Bebas Neue (prototype) vs Barlow Condensed (code) | Pick one. Sub-item of #1. |
| 3 | **Demo-readiness (brief #2)** still open | Is Profile built/demo-able? Comp Prep built/demo-able? Did the research taper framework replace −10/−20/−30% in code? Did "UFC BJJ Opens" land in the `competition_type` enum + Aug 22 Vegas? Bugs A (technique-entry Enter) + B (session edit) — landed or pending? |
| 4 | **RECENT CANCELS data source** | No membership/cancellation data exists in the model. For the demo it's a placeholder. For real, it needs a CRM/membership source — ties to the Smoothcomp question. Your lane. |
| 5 | **Comp countdown is hardcoded** ("92 DAYS OUT") | Static, anchored to May 22. Should compute from the event date when it goes live. Flagging for whenever the live Comp screen gets wired. |

---

## Protocol

You cleared me to build unbuilt screens as long as I tell you when I push. This is that heads-up — reviewing with you first, then I push the prototype + demo-clips. Nothing is pushed yet.

---

## Repo note

A couple of stray empty items (`__wtest`, a nested `demo-clips/demo-clips/` folder) are sitting in `docs/demo-package/` from file moves. Harmless; I'll clean them before the push.
