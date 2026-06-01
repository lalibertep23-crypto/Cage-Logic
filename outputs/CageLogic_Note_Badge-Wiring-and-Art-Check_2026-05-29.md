# Cage Logic — Discipline Badge Art: Wiring + Accuracy Check

**From:** Chris
**Date:** 2026-05-29
**TL;DR:** The boxing/wrestling/MMA badges on the home screen show a generic placeholder because the per-level art exists in `public/` but isn't wired into `getDisciplineImage()`. This is a wiring fix, not new art.

---

## The problem

`src/app/(app)/home/page.tsx` → `getDisciplineImage()` maps BJJ and Muay Thai to their per-level art, but boxing, wrestling, and MMA just return a single generic `*-navigation-badge.png`. That generic badge is the placeholder showing on the demo. The real per-level art already sits in `public/` unused.

---

## For Patrick — wiring fix (your lane)

Mirror the BJJ/Muay-Thai pattern: map each discipline's rank key to its existing file. Rank keys below are what I found in the progression clients — confirm against the actual data model.

### Boxing (keys = tier names)
| rank key | file |
|---|---|
| foundation | `/C1-boxing-foundation.png` |
| technical | `/C2-boxing-technical.png` |
| pressure | `/C3-boxing-pressure.png` |
| combination | `/C4-boxing-combination.png` |
| contender | `/C5-boxing-contender.png` |
| elite | `/C6-boxing-elite.png` |
| fallback | `/boxing-navigation-badge.png` |

### MMA (keys = level_1…level_6)
| rank key | file |
|---|---|
| level_1 | `/D1-mma-fundamentals.png` |
| level_2 | `/D2-mma-ground-game.png` |
| level_3 | `/D3-mma-striking.png` |
| level_4 | `/D4-mma-control.png` |
| level_5 | `/D5-mma-elite.png` |
| level_6 | `/D5-mma-finisher.png` |
| fallback | `/mma-navigation-badge.png` |

> **Flag:** both elite and finisher files use the `D5-` prefix. Confirm whether MMA is 5 levels or 6, and which file is the top rank, before mapping level_5/level_6.

### Wrestling (keys = tier names — confirm; client also references level_1…6)
| rank key | file |
|---|---|
| foundation | `/foundation-wrestling.png` |
| pressure | `/pressure-badge-wrestling.png` |
| scramble | `/scramble-badge-wrestling.png` |
| competitor | `/competitor-badge-wrestling.png` |
| elite | `/elite-badge-wrestling.png` |
| fallback | `/wrestling-navigation-badge.png` |

> **Flag:** wrestling shows both named tiers and `level_1…6` in the client. Confirm which key scheme the data uses so the map keys match. Extra files `chain-wrestling-wrestling.png` and `ncaa-wrestler.png` are unmapped — ignore or place intentionally.

Once wired, the demo home screen shows real per-level art instead of the generic badge.

---

## For Chris — cultural-accuracy checklist (run once it's wired and visible)

Eyeball each badge on screen. Flag only what misses — don't re-spec art that's already right.

**Boxing**
- Hand wraps and boxing gloves (not MMA gloves)
- Orthodox/southpaw stance reads as boxing, not kickboxing
- No gi, no belt

**Wrestling**
- Singlet and ear guards / headgear
- Mat or circle, folkstyle/freestyle posture
- No gi, no belt

**MMA**
- 4 oz open-finger MMA gloves (not boxing gloves)
- Cage / octagon context
- Mixed stance, not pure striking or pure grappling

**All three**
- Matches brand aesthetic: concrete, brass/amber, industrial — consistent with the BJJ belt and Muay Thai prajied art already in use
- No motivational/hype styling

If any badge fails the check, that one gets a redo spec — but only that one.

---

## Why this order

Wire first, review second. We won't know which (if any) art actually needs redoing until the real per-level images are on screen instead of the placeholder.
