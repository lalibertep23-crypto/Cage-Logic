# Cage Logic — Frankie Profile Card: Build Spec

**From:** Chris
**Date:** 2026-05-29
**For:** Patrick — to render Frankie's card on the demo-account Athlete Profile.
**Build target:** the athlete profile view (`a-profile`). Photo is already embedded in the prototype as base64 (`frankie-edgar-profile.jpg`). For the demo, all fields below are hardcoded to the demo account.
**Status:** content is Frankie-confirmed and complete. No open content questions.

---

## Hero card — fixed fields

| Field | Value |
|---|---|
| Name | Frankie "The Answer" Edgar |
| Photo | `frankie-edgar-profile.jpg` (already in prototype) |
| Primary discipline | MMA (Wrestling + BJJ base) |
| Weight class | Lightweight (155) — also Featherweight (145) & Bantamweight (135) |
| Belt | **BJJ Black Belt — verified by Ricardo Almeida** |
| Gym / lineage | Iron Army Academy, Toms River NJ · Ricardo Almeida / RA BJJ |
| Years training | 25+ (wrestling from youth; pro MMA debut 2005) |
| Location | Toms River, New Jersey |
| MMA record | 23–11–1 |

The belt line is the pitch hinge: it's verified by Ricardo Almeida — the person we pitch next. Surface "verified by Ricardo Almeida" prominently, not buried.

## Record detail (scouting block)

- By method: Wins — 6 (T)KO, 4 submission, 13 decision · Losses — 5 (T)KO, 6 decision
- **Never been submitted** (4–0 by submission, 0 submission losses) — lead with this line; it's the standout scouting signal.

## Credentials (render on the record)

- Former UFC Lightweight Champion (def. BJ Penn, UFC 112, Apr 10 2010; 687-day reign — 3rd-longest in LW history)
- Multiple-time Featherweight title challenger
- Only fighter to beat BJ Penn three times
- UFC Hall of Famer

## Customizable fields

- **Game-style tags:** Wrestler Base · Pressure Fighter · Relentless Pace · Boxing + Footwork · Takedowns & Scrambles · Elite Cardio
- **Favorite techniques:** single/double leg entries · level-change into boxing · scramble to the back
- **Bio (~200 char):** "UFC Hall of Famer and former Lightweight Champion. The only fighter to beat BJ Penn three times. Division I wrestler, BJJ black belt under Ricardo Almeida. Forged in Toms River."
- **Quote:** skipped
- **Social:** Instagram — @frankieedgar

## Highlight reel — clip cards

These are **link-out cards** (tap opens the page/clip), not inline players.

> Why link-out, not embed: YouTube embeds throw "error 153" on a local file and several videos block embedding. Also: the BJ Penn fight-clip links from the prior spec were unofficial UFC-footage uploads and are now dead (tested 2026-05-29). Only stable, official sources go on the card.

**Stable sources (use these — confirmed):**

| Label | URL | Status |
|---|---|---|
| UFC official athlete page | https://www.ufc.com/athlete/frankie-edgar | Works |
| Instagram — @frankieedgar | https://instagram.com/frankieedgar | Stable (his own) |

**Optional fight-clip links — Chris must tap-test, keep only what plays:**

| Label | URL |
|---|---|
| Top Finishes: Frankie Edgar | https://www.youtube.com/watch?v=atKhoDoO3X0 |
| Every Frankie Edgar UFC Finish | https://www.youtube.com/watch?v=ZneNpWXFGOU |

Do not put any link on the demo card that Chris hasn't personally confirmed plays. A dead link in front of Frankie is worse than fewer links.

## Build notes for Patrick

- All fields hardcoded to the demo account for the demo. The "Promoted by" + optional lineage note field (V1.5) is not needed here — Frankie's lineage is fixed text.
- Profile is the hero screen — match the prototype athlete view layout (baseball-card / scouting-card feel).
- Confirm the profile screen supports clip-link cards.

## Open items

- Patrick: confirm the Next.js Profile screen is built and renders this card for the demo account.
- Chris: tap-test the four highlight links.
