# Cage Logic — Minimum Viable Demo Readiness Tracker

**Demo = single-user (you), V1 app + real data.** Shown to UFC BJJ (Claudia Gadelha / Ricardo Almeida via Frankie). Sources: `CageLogic_MinViableDemo_BuildList` + Patrick's `chris-update-2026-05-22`.
**Out of scope:** multi-athlete onboarding (V1.5), anything in the Grey list.
**Last updated:** 2026-05-22 — synced to Patrick's update doc.

### Status legend

- ✅ Done / fixed
- 🟠 Fixed in code — verify on device
- 🟡 Build item — pending / confirm with Patrick
- 🔵 Your job — real data or validation
- ⛔ Explicitly NOT in the demo
- ⚠️ Conflict / decision needed

---

## 1. Bugs (per Patrick's update)

| Item | Status | Notes |
|---|---|---|
| Roll-log save + partner name (Critical/P1) | ✅ Fixed (per you) | Not restated in Patrick's doc — **verify in real use** |
| Roll "felt" textarea too small (#7) | 🟡 Pending | Going 2 → 4 rows. Next session. |
| Mental check-in / daily-read (#8) | 🟠 Fixed in code | Not device-verified — check it logs |
| BRS retake button always on (#13) | ✅ Fixed | 25-day window; "RETAKE IN X DAYS" as plain text |
| Soreness notes field (#15) | ✅ Not a bug | Column live, form works |
| **Technique entry — Enter kicks to homepage + loses input** (new, tonight) | 🟡 Reported to Patrick | Demo-relevant — breaks session logging flow. Possibly same family as the roll-save fix |
| **Session edit — no full edit; roll edit reopens log page** (new, tonight) | 🟡 Reported to Patrick | Likely same root as old "edit mode locked" report |

---

## 2. Layer 1 — Athlete Profile (your profile)

| Item | Canon | Status |
|---|---|---|
| Fixed fields (name/photo/gym/belt+coach-verified/weight class/years/location/discipline) | V1.5 | 🟡 confirm built |
| Competition record + "Unverified" badge + "Record: Private" | V1.5 | 🟡 |
| Game style tags (5–8 + custom) | V1.5 | 🟡 |
| Bio (200 char) + quote | V1.5 | 🟡 |
| Training/competition clip — URL + label + card | V1.5 | 🟡 |
| Visibility tiers + per-field override | V1.5 | 🟡 |
| Renders cleanly on mobile | — | 🟡 |

> Profile isn't in Patrick's migration list — confirm whether it's built at all yet, since it's V1.5-class.

---

## 3. Layer 2 — Comp Prep Hub (UFC BJJ Opens)

| Item | Status | Notes |
|---|---|---|
| "UFC BJJ Opens" in `competition_type` enum | 🟡 Pending | Patrick: "before Aug 22 deadline" |
| Tournament date — Aug 22, Las Vegas | 🟡 | |
| Daily weight log + trend chart | 🟡 | V1.5-class |
| Weight-cut tier + color indicator | 🟡 | V1.5-class |
| Taper framework from date | ⚠️ Conflict | **See below** |
| Stop-doing list surface | 🔵 Validate | Patrick's draft list — confirm (item 4C) |

> ⚠️ **Taper conflict — you must resolve.** Patrick built the taper table as **−10% / −20% / −30%** by week. Your own `Chris_Validation` says **volume stays NORMAL until comp week** (Wednesday hard day, Thursday off). These contradict. Nothing comp-prep ships until you give Patrick the correct table (his validation item 4A).

---

## 4. Layer 3 — Session Log

| Item | Status | Notes |
|---|---|---|
| 4-step flow, end to end | ✅ likely — verify | Roll save fixed |
| Technique tags autocomplete (67-tag IA library) + custom | 🟡 confirm | |
| Roll log — partner/outcome/duration/notes | ✅ fixed — verify | |
| Reflection — no char limit | 🟡 | "felt" textarea still 2 rows until #7 ships |
| Session history — 30 days + detail | 🟡 confirm | History screen exists |
| Intensity + energy 1–10 | 🟡 | Energy slider not in soreness form yet (separate) |

---

## 5. Demo Style — applies to every demo page

**Identity:** "Elite underground combat performance operating system." Not wellness, not a gym tracker.
**Voice (locked):** direct, dry, factual. No motivational language, no exclamation marks, no emojis, no "great job." Numbers over adjectives. "Score moved. +3 this week." Mirror, not megaphone.

**Locked color tokens** (use these — old brand-doc palette is dead):

| Role | Hex |
|---|---|
| Background — void black | `#050505` |
| Panel | `#111111` |
| Raised surface | `#1E1E1E` |
| Primary accent — burnt brass | `#C8943A` |
| Active glow — neon amber | `#FFB627` |
| Primary text — off white | `#F2EFE8` |
| Secondary text | `#8E8577` |
| Danger / injury / red | `#A43A2F` (score-red brick `#8B3A1E`) |

Gold = energy/earned status, never decorative. Red = danger only. Type: **Anton** headers / **Bebas Neue** labels / **DM Mono** data — "fight poster meets military dossier." Panels embedded, not floating cards. The octagon is structural. Full spec: `docs/cage-logic-visual-constitution.md`.

### ⚠️ Style migration — the demo's biggest visual gap

Only **Home** and **Landing** are on the new locked palette. These demo-relevant screens are **still on the OLD palette**:

| Screen | In demo? | Migrated? |
|---|---|---|
| Home (score) | maybe | ✅ |
| Log form (Layer 3) | **yes** | ❌ old palette |
| History (Layer 3) | **yes** | ❌ old palette |
| Comp Prep (Layer 2) | **yes** | not listed — confirm |
| Progression | no | ❌ |
| Mental / Recovery / Health | no | ❌ |

**Implication:** if you walk Claudia/Ricardo through the Session Log, those screens won't match the locked style yet. Migrating Log + History (and confirming Comp Prep/Profile) to the new tokens is a demo-readiness item, not just polish.

---

## 6. Real data — YOUR job (logging works now)

| Item | Status |
|---|---|
| Your complete profile — real photo, belt, gym, coach-verified | 🔵 (needs profile built) |
| UFC BJJ Opens Aug 22 active + 7+ days weight entries | 🔵 (needs weight log) |
| 3–5 real sessions from past 2 weeks — tags, reflections, roll partners | 🔵 **start today** |
| 1+ training clip URL on profile | 🔵 |
| Game style tags accurate to how you fight | 🔵 |

---

## 7. Validation items only you can answer (from Patrick §4)

- **A. Taper % table** — reconcile with your validated framework (see §3 conflict). Blocks comp prep.
- **C. Final-week stop-doing list** — confirm/add.
- **B. Post-comp drill field naming** — "position" vs "situation/sequence/game"?
- **D/E. Stripe criteria + first-stripe threshold** — V1.5, with Frankie.
- **F. Coach score-override** — V1.5 design input.
- **G. Post-comp debrief 3+3 rewrite** — deferred until after your first comp.

---

## 8. Explicitly NOT in the demo (Grey)

⛔ C-WAR backend · **Investment Score display** (built + running, but grey-listed for the UFC BJJ demo as IP leverage — your call whether to show Home/score) · Position Pathways web · Wrestling · Mental Conditioning drills · Stripe/belt screen · Coach roster · Crisis flag · Legends Library · Instructor Demo Mode

---

## Next moves

1. **Resolve the taper conflict** — send Patrick your real taper table (§3). It blocks comp prep.
2. **Decide:** migrate Log + History to the new style for the demo? Confirm Profile/Comp Prep build status with Patrick.
3. **Start logging real sessions today** (§6) — your own training.
4. **Confirm "UFC BJJ Opens" comp type** gets built before Aug 22.
