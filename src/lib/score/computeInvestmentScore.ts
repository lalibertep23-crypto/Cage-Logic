// Investment Score — V1 deterministic computation.
// Source of truth: CageLogic_InvestmentScore_Schema.docx (Chris Denardo, 2026-05-22)
// Weights: Consistency 25 / Reflection 20 / Mental 20 / Recovery 20 / Self-Study 15.
// Ramping: Days 1–29 score is null. First real score on Day 30.
// Zero AI. Rules + computed data only.

export const DOMAIN_WEIGHTS = {
  consistency: 0.25,
  reflection:  0.20,
  mental:      0.20,
  recovery:    0.20,
  selfStudy:   0.15,
} as const;

export const RAMPING_DAYS = 30;

export type DomainPcts = {
  consistency: number; // 0..100
  reflection:  number;
  mental:      number;
  recovery:    number;
  selfStudy:   number;
};

export type ScoreResult = {
  isRamping:  boolean;
  daysOfData: number;
  score:      number | null; // 0..100, null if ramping
  domains:    DomainPcts;
};

export function weightedScore(d: DomainPcts): number {
  return Math.round(
    d.consistency * DOMAIN_WEIGHTS.consistency +
    d.reflection  * DOMAIN_WEIGHTS.reflection  +
    d.mental      * DOMAIN_WEIGHTS.mental      +
    d.recovery    * DOMAIN_WEIGHTS.recovery    +
    d.selfStudy   * DOMAIN_WEIGHTS.selfStudy
  );
}

export function computeInvestmentScore(
  daysOfData: number,
  domains: DomainPcts,
): ScoreResult {
  const isRamping = daysOfData < RAMPING_DAYS;
  return {
    isRamping,
    daysOfData,
    score: isRamping ? null : weightedScore(domains),
    domains,
  };
}

// ─── Recency decay ────────────────────────────────────────────────────────────
// 4 discrete tiers per spec. Used by Consistency, Mental, Recovery, Self-Study.
function decayMultiplier(ageDays: number): number {
  if (ageDays <= 7)  return 1.00;
  if (ageDays <= 14) return 0.75;
  if (ageDays <= 21) return 0.50;
  return 0.25; // 22–30 days
}

// ─── Domain 1 — Consistency (25%) ────────────────────────────────────────────
// Measures sessions against the athlete's own declared training frequency.
// A 2x/week athlete who hits their target scores the same as a 5x/week athlete who hits theirs.
// declaredWeeklyFrequency comes from athletes.training_frequency_per_week (migration 0012).
// Null = onboarding not yet updated to store this field → default 3x/week.
export function consistencyPct(
  sessionDates: Date[],
  declaredWeeklyFrequency: number | null,
  today = new Date(),
): number {
  const freq = declaredWeeklyFrequency ?? 3;
  const targetSessions = freq * 4.3; // 30-day equivalent
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - 30);

  const weighted = sessionDates
    .filter(d => d >= cutoff && d <= today)
    .reduce((acc, d) => {
      const ageDays = (today.getTime() - d.getTime()) / 86_400_000;
      return acc + decayMultiplier(ageDays);
    }, 0);

  return Math.min(100, Math.round((weighted / targetSessions) * 100));
}

// ─── Domain 2 — Reflection (20%) ─────────────────────────────────────────────
// Character count tiers per session. Sessions with no reflection score 0 and are
// averaged in — the domain penalises not reflecting, not just rewards reflecting.
// Return-edit bonus: +15, capped at session max of 100.
// char_count comes from session_reflections.char_count (migration 0012 generated column).
export type ReflectionEntry = {
  sessionId: string;
  charCount: number | null; // null = no reflection written
  wasEdited: boolean;       // updated_at > created_at + 5 min
};

function reflectionTierScore(charCount: number | null): number {
  if (!charCount || charCount === 0) return 0;
  if (charCount < 50)  return 10;
  if (charCount < 200) return 60;
  return 100;
}

export function reflectionPct(
  totalSessionsInWindow: number,
  reflections: ReflectionEntry[],
): number {
  if (totalSessionsInWindow === 0) return 0;

  // Score each session that has a reflection
  const bySession = new Map<string, number>();
  for (const r of reflections) {
    const base  = reflectionTierScore(r.charCount);
    const bonus = r.wasEdited ? 15 : 0;
    bySession.set(r.sessionId, Math.min(100, base + bonus));
  }

  // Sum scored sessions + 0 for every session with no reflection
  let total = 0;
  for (const v of bySession.values()) total += v;
  // Sessions without a reflection contribute 0 — already zero so just divide

  return Math.round(total / totalSessionsInWindow);
}

// ─── Domain 3 — Mental (20%) ──────────────────────────────────────────────────
// Per-week formula (spec):
//   weekScore = min(100, (BRS?100:0 + daily_prompts×20 capped 100) / 2 + postLossBonus?20:0)
// Then decay-weighted across the 4 weeks in the 30-day window.
export type MentalWeek = {
  weekIndex:     number;  // 0 = most recent week, 3 = oldest
  brsCompleted:  boolean;
  dailyPrompts:  number;  // count of daily_prompt completions this week
  postLossBonus: boolean; // Phase 1 post-loss reflection completed this week
};

export function mentalPct(weeks: MentalWeek[]): number {
  if (weeks.length === 0) return 0;

  let weightedSum = 0;
  let weightTotal = 0;

  for (const w of weeks) {
    const decay       = decayMultiplier(w.weekIndex * 7);
    const brsScore    = w.brsCompleted ? 100 : 0;
    const promptScore = Math.min(100, w.dailyPrompts * 20);
    const weekScore   = Math.min(100, (brsScore + promptScore) / 2 + (w.postLossBonus ? 20 : 0));
    weightedSum += weekScore * decay;
    weightTotal += decay;
  }

  return weightTotal === 0 ? 0 : Math.round(weightedSum / weightTotal);
}

// ─── Domain 4 — Recovery (20%) ────────────────────────────────────────────────
// 50% logging behavior + 50% actual state (energy + soreness tier table).
// energy_0_10 comes from daily_soreness_logs.energy_0_10 (migration 0012).
// Null energy = not yet captured in UI → estimate from soreness alone.
export type RecoveryDay = {
  ageDays:  number;
  logged:   boolean;
  energy:   number | null; // 0–10, null until soreness form UI updated
  soreness: number | null; // overall_soreness_0_10
};

function recoveryStateScore(energy: number | null, soreness: number | null): number {
  if (energy === null) {
    // Energy not available yet — estimate from soreness alone
    if (soreness === null)  return 50;
    if (soreness <= 3)      return 100;
    if (soreness <= 6)      return 70;
    if (soreness <= 7)      return 40;
    return 15;
  }
  // Both available — spec table
  const s = soreness ?? 5; // assume neutral if somehow missing
  if (energy >= 7 && s <= 4) return 100;
  if (energy >= 5 && s <= 6) return 70;
  if (energy >= 3 && s <= 7) return 40;
  return 15;
}

export function recoveryPct(days: RecoveryDay[]): number {
  if (days.length === 0) return 0;

  let weightedSum = 0;
  let weightTotal = 0;

  for (const d of days) {
    const decay      = decayMultiplier(d.ageDays);
    const logScore   = d.logged ? 100 : 0;
    const stateScore = d.logged ? recoveryStateScore(d.energy, d.soreness) : 0;
    const dayScore   = logScore * 0.5 + stateScore * 0.5;
    weightedSum += dayScore * decay;
    weightTotal += decay;
  }

  return weightTotal === 0 ? 0 : Math.round(weightedSum / weightTotal);
}

// ─── Domain 5 — Self-Study (15%) ─────────────────────────────────────────────
// Point system per day, normalized to 100:
//   technique tags: 5 pts each, max 30/session (capped at 6 tags)
//   custom technique added: 25 pts
//   return edit to a reflection: 20 pts
//   follow-up note added: 15 pts
// Decay-weighted across 30 days.
export type SelfStudyDay = {
  ageDays:           number;
  techniqueTagCount: number; // unique tags on sessions logged this day
  customTechCount:   number; // custom techniques added this day
  returnEditCount:   number; // reflections edited (return visits) this day
  followUpCount:     number; // follow-up notes added this day
};

export function selfStudyPct(days: SelfStudyDay[]): number {
  if (days.length === 0) return 0;

  const NORM = 100; // theoretical daily max ≈ 95, normalised to 100
  let weightedSum = 0;
  let weightTotal = 0;

  for (const d of days) {
    const decay       = decayMultiplier(d.ageDays);
    const tagPts      = Math.min(30, d.techniqueTagCount * 5);
    const customPts   = d.customTechCount > 0 ? 25 : 0;
    const editPts     = d.returnEditCount > 0 ? 20 : 0;
    const followUpPts = d.followUpCount > 0 ? 15 : 0;
    const dayScore    = Math.min(100, ((tagPts + customPts + editPts + followUpPts) / NORM) * 100);
    weightedSum += dayScore * decay;
    weightTotal += decay;
  }

  return weightTotal === 0 ? 0 : Math.round(weightedSum / weightTotal);
}

// ─── Nudge thresholds ─────────────────────────────────────────────────────────
// Used by loadHomeData to fire the single weakest-domain nudge.
// Same domain cannot nudge more than once every 5 days (enforced in nudge_log).
export const NUDGE_THRESHOLDS = {
  consistency: 40,
  reflection:  35,
  mental:      40,
  recovery:    35,
  selfStudy:   30,
} as const;
