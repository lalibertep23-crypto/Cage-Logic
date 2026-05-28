# Cage Logic — Comp Prep: Taper Section Schema

**For Patrick · 2026-05-22 · Research-backed (defer to expert consensus).**
Supersedes the −10/−20/−30% draft and the "volume stays normal" note. Source detail: `CageLogic_Taper_Framework_Research`.

## Overview

The taper section lives inside the Comp Prep Hub. Once the athlete enters a tournament date, the app generates a taper framework counting back from competition day, shows the current phase, and surfaces the final-week stop-doing list. It is a **framework, not a mandate** — the coach can override any element.

## Inputs

| Input | Source | Used for |
|---|---|---|
| Tournament date | Comp Prep setup | Calculates weeks-out, drives phase generation |
| Competition day-of-week | Derived from date | Anchors the final-week schedule |
| Comp-week feel (personalization) | One question at setup (below) | Adjusts taper aggressiveness |
| Declared training frequency | Athlete profile (onboarding) | Scales the baseline the taper reduces from |

## Generated framework (default — Saturday competition)

| Time out | Volume | Intensity / sparring | App-surfaced note |
|---|---|---|---|
| 4+ weeks | Baseline | Full, building | "Hard block. This is where the work is banked." |
| ~2 weeks | Baseline, begin slight trim | Peaks (~RPE 8), full sparring | "Last hard block. No new techniques from here — trust your A-game." |
| Comp week Mon–Wed | Reduced ~40–50% | High-intensity, low-volume, shorter; safety > intensity | "Sharp, short rounds. Stop early." |
| Comp week Thu–Fri | Light | Technical/positional only (below ~RPE 6) | "Hard sparring is done. Stay sharp, stay fresh." |
| Day before | Rest / ~15 min light drill | None | "Rest. Sleep and food are the work today." |
| Comp day | — | Compete | — |

Principles encoded: progressive (non-linear) volume cut, hold intensity until ~2 weeks then drop in final week, no new techniques inside 2 weeks, full rest day before, prioritize sleep + nutrition.

## Personalization question (at setup)

> "How do you typically feel the week of competition?"
> - I need more rest than usual → more aggressive volume reduction
> - I keep my normal routine until 2–3 days out → standard framework
> - I stay active right up to comp day → lighter reduction, more technical sharpness

Answer shifts the final-week aggressiveness only. Coach can override at any time.

## Display (on the Comp Prep Hub)

- Countdown: days until competition.
- Current phase card: which phase the athlete is in today + that phase's note.
- Full framework table, scrollable.
- "No new techniques" flag activates automatically at the 2-week mark.
- Final-week stop-doing list surfaces as a checklist (separate section — see stop-doing list).

## Voice

Dry, factual, framework-not-mandate. No motivational language. "Volume down. Intensity holds." not "Time to peak!" The taper presents the consensus; the coach and athlete decide.

## Architecture note for Patrick

- Taper is **computed from tournament date** — not a stored plan per day. Phase = function of (today, competition_date, personalization_answer).
- Lives in the `competition_plans` table (canon: designed, V1.5). Fields: `competition_id`, `competition_date`, `comp_week_feel` enum, `coach_overrides` (JSON, per-phase), `taper_framework_version`.
- Framework values are config, not hardcoded — so the table can be updated without a code change as the research is refined.
- Present as default; `coach_overrides` always wins on display.

## Sources

Mujika & Padilla (precompetition tapering); Breaking Muscle (peaking rules); Grapplearts (grappling peaking); JiuJitsu.com (BJJ peaking).
