# Cage Logic — Handoff to Patrick

**From:** Chris · **Date:** 2026-05-22 · **Re:** getting the demo ready for Frankie + Ricardo

Got your update doc — Investment Score, bug log, and style guide all landed. This is what I need from you next.

---

## The priority

Single-user demo (me) for **Frankie + Ricardo**: my profile + Comp Prep set to **UFC BJJ Opens, Aug 22** + a real logged training week. The demo is the data, not the polish. Multi-athlete onboarding stays V1.5 — not part of this.

## #1 — The one thing I need answered

**Are these two screens actually built and demo-able right now?**

- **Athlete Profile** — fixed fields, competition record + unverified badge, game-style tags, clip link, visibility tiers
- **Comp Prep Hub** — tournament entry, daily weight log, taper plan, stop-doing list

Your migration list didn't mention either, so I need a straight read: **what exists vs. what's net-new?** That answer decides whether the demo is days away or needs a build sprint first. Everything else depends on it.

## Decisions from my side (act on these)

1. **Taper — resolved.** Use the research-backed framework (file: `CageLogic_Taper_Framework_Research`). It **replaces both** your −10/−20/−30% table and the old "volume stays normal" note — we're deferring to expert consensus (Mujika + BJJ peaking sources). Short version: hold volume until ~2 weeks out, then progressive cut; intensity peaks ~2 weeks out then drops the final week; no new techniques inside 2 weeks; rest the day before.
2. **UFC BJJ Opens — before Aug 22.** Add "UFC BJJ Opens" to the `competition_type` enum + make Aug 22 Las Vegas selectable. You already flagged this in your pending list — confirming it's a go.
3. **Stop-doing list — validated, build this for the final-week surface:**

| Stop doing | When | Why |
|---|---|---|
| Heavy / hard sparring rounds | 2–3 days out (BJJ). **MMA: defer to experts — not set** | Recovery; hard rounds already banked |
| Learning / debuting new techniques | From 2 weeks out | Trust your A-game |
| Max-effort lifting | During the taper / comp week | Practitioner's call, but holds during a taper — fresh, not sore |
| Diet experiments / new foods | Comp week | Don't surprise your gut |
| New supplements | Comp week | Unknown reactions at the worst time |
| Cramming extra training | Final week | The work's done; comp week is the reward |

(BJJ list is locked. MMA-specific taper/stop-doing stays deferred to expert input — consistent with MMA taper being a later build.)

## Bugs

- I'll **verify the roll-log save fix and the Mental daily-read fix (#8)** in real use and flag anything off.
- **Bug #7** (roll "felt" textarea 2 → 4 rows): yes, please ship it — I'll be writing real reflections.

### New — from tonight's session (2026-05-22)

**Bug A — Technique entry: Enter key kicks to homepage and loses input**
- **Screen:** Log Session → technique entry field
- **Issue:** While typing a technique, pressing **Enter** navigates back to the homepage and does not log the entry. Going back to the session lets me resume, but whatever I typed before pressing Enter is gone — not saved.
- **Expected:** Enter should confirm/add the technique (or do nothing) — never navigate away or discard typed text.
- **For Patrick:** Enter is triggering a form submit / default navigation and dropping the in-progress input. Intercept Enter in the technique input (add-as-tag or no-op), block the navigation, and preserve typed text.

**Bug B — Editing a saved session doesn't allow a full edit**
- **Screen:** Session edit / roll edit
- **Issue:** Editing an already-logged session doesn't give a full edit. Editing a previously logged **roll** just reopens the original log page rather than loading the saved roll to edit. Can't actually modify what was saved.
- **Expected:** Full edit of all session fields — including techniques and rolls — with existing data pre-loaded and editable.
- **For Patrick:** Looks like the same root as the earlier report (techniques & roll comments locked / inaccessible in edit mode). Edit mode should hydrate the saved roll + technique data into editable fields, not present a fresh re-log page.

## Don't spend time on these for the demo

- **Log + History screens:** leave on the current palette for now — I'm fine with them as-is, not migrating for the demo.
- **Grey list — don't build:** C-WAR backend, position pathways, wrestling, mental conditioning drills, stripe/belt screen, coach roster, crisis flag, legends library, instructor demo mode.
- **Investment Score:** built and good — but I'm keeping it out of the UFC BJJ demo as IP leverage, so no demo work needed there.

## What I'm doing in parallel

- Logging my own real sessions daily, starting now (the data foundation).
- Validating the stop-doing list and sending it back.

---

**Bottom line for you:** tell me if Profile + Comp Prep are built, ship the UFC BJJ Opens comp type, and use the new taper table. That's the critical path to the demo.
