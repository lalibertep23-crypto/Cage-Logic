# Cage Logic — Final-Week Stop-Doing List (FINAL)

**Status: LOCKED (BJJ).** For Patrick — build this as the final-week checklist surface in the Comp Prep Hub.
**Date:** 2026-05-22 · Validated by Chris.

## The list

| Stop doing | When it activates | Why |
|---|---|---|
| Learning / debuting new techniques | 2 weeks out | Trust your A-game. New techniques aren't reliable under pressure yet. |
| Heavy / hard sparring rounds | 2–3 days out | Recovery before the real thing — the hard rounds are already banked. |
| Max-effort lifting | During the taper / comp week | Holds during a taper — be fresh, not sore. (Practitioner can adjust outside taper.) |
| Diet experiments / new foods | Comp week | Don't surprise your gut before you compete. |
| New supplements | Comp week | Unknown reactions at the worst possible time. |
| Cramming extra training | Final week | The work is already done. Comp week is the reward, not the catch-up. |

## Display & behavior

- Surfaces in the Comp Prep Hub as a **checklist the athlete can review and tick off** — framed as things to trust and protect, not restrictions.
- Each item appears/activates based on its timing relative to competition date (computed, same as the taper).
- The "new techniques" item ties to the taper's 2-week "no new techniques" flag — same trigger.
- Coach can override or add gym-specific items.

## Voice

Dry, factual. "No max-effort lifting this week." not "Avoid overtraining — you've got this!" Mirror, not megaphone.

## Scope note

This list is **BJJ, final.** The MMA-specific stop-doing list and taper are **deferred to expert input** and are a later build — do not generate an MMA version from this.

## Data

Part of `competition_plans` (V1.5). Items are config (label + activation offset), not hardcoded, so the list can be edited without a code change.
