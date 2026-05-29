# Cage Logic — Brief to Patrick: Design Drift

**From:** Chris
**Date:** 2026-05-29
**Lane:** Design system / brand identity (yours). This is the evidence; the call and the refactor are yours to drive.
**Attached:** `CageLogic_Design-Drift-Report_2026-05-29.docx` (full file-by-file table in its appendix)

---

## The message

Patrick — ran a color/font/voice audit across the demo surface and the full app. We have a palette problem that will show in the Frankie demo. Summary below, full breakdown in the attached report.

**One decision I need from you:** which palette is canonical — the locked tokens from the prototype, or the Warm Concrete theme now in the code? Everything else follows from that one answer. My vote is the locked/prototype tokens, since the prototype is the agreed demo target.

---

## What the audit found

- **Three color systems are live at once.** Of 78 screens that hardcode colors: 50 use Warm Concrete, 19 use the locked/prototype palette, 6 mix both in one file, 3 use only off-palette colors.
- **The demo surface is inconsistent.** Log = locked palette (on theme). Comp Prep + all prep screens = Warm Concrete (amber `#D4922E`, bg `#1A1713`, green `#3D8B55`). Profile = steel-blue `#8A9BAE`, in neither palette. Move between the three and the amber, green, and background all shift.
- **Root cause:** the theme tokens in `globals.css` exist, but zero of the 78 screens reference them. Every screen pastes raw hex inline instead of pulling `var(--primary)`. No single source of truth, so each screen drifted on its own.
- **Fonts:** prototype uses Bebas Neue for labels; app uses Barlow Condensed. Anton + DM Mono match. Pick one label font.
- **Voice: clean.** No exclamation marks, no emojis, no motivational copy on the demo screens.

## Palette conflict, side by side

| Role | Locked (prototype) | Warm Concrete (code) |
|---|---|---|
| Background | `#050505` | `#1A1713` |
| Panel / card | `#111111` / `#1E1E1E` | `#252118` |
| Amber (primary) | `#FFB627` / `#C8943A` | `#D4922E` |
| Green | `#5C8A3C` | `#3D8B55` |
| Off-white (text) | `#F2EFE8` | `#F5F0E8` |
| Danger / red | `#A43A2F` | `#A83030` / `#8B3A1E` |

## What I'm asking you to decide / do

1. Pick the canonical palette (my vote: locked/prototype tokens).
2. Make `globals.css` tokens the single source of truth.
3. Replace hardcoded hex with the token variables, starting with the three demo screens so the demo is consistent first.
4. Standardize on one label font (Bebas Neue if prototype wins).

Steps 2–4 are your lane. I'm not touching the theme. Tell me the palette call and I'll align prototype/content to match.
