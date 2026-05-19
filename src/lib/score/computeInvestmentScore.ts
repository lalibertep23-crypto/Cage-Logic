// Investment Score — V1 deterministic computation.
// Source of truth: docs/cageside-v1-cowork-starter.md ("Investment Score computation").
// Weights: Consistency 25 / Reflection 20 / Mental 20 / Recovery 20 / Self-Study 15.
// Ramping: days 1-29 score is null; first real score forms on day 30.

export const DOMAIN_WEIGHTS = {
  consistency: 0.25,
  reflection: 0.20,
  mental: 0.20,
  recovery: 0.20,
  selfStudy: 0.15,
} as const;

export const RAMPING_DAYS = 30;

export type DomainPcts = {
  consistency: number;  // 0..100
  reflection: number;
  mental: number;
  recovery: number;
  selfStudy: number;
};

export type ScoreResult = {
  isRamping: boolean;
  daysOfData: number;
  score: number | null;          // 0..100, null if ramping
  domains: DomainPcts;
};

export function weightedScore(d: DomainPcts): number {
  const s =
    d.consistency * DOMAIN_WEIGHTS.consistency +
    d.reflection  * DOMAIN_WEIGHTS.reflection  +
    d.mental      * DOMAIN_WEIGHTS.mental      +
    d.recovery    * DOMAIN_WEIGHTS.recovery    +
    d.selfStudy   * DOMAIN_WEIGHTS.selfStudy;
  return Math.round(s * 10) / 10;
}

export function computeInvestmentScore(
  daysOfData: number,
  domains: DomainPcts
): ScoreResult {
  const isRamping = daysOfData < RAMPING_DAYS;
  return {
    isRamping,
    daysOfData,
    score: isRamping ? null : weightedScore(domains),
    domains,
  };
}

// ---------------------------------------------------------------------------
// Per-domain percent calculators (V1 skeletons; real inputs wired in screen work)
// ---------------------------------------------------------------------------

/**
 * Consistency: sessions logged in last 30 days, recency-weighted.
 * Target: 12 sessions/30 days = 100%. Linear up to that cap.
 */
export function consistencyPct(sessionDates: Date[], today = new Date()): number {
  const TARGET = 12;
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - 30);
  const weighted = sessionDates
    .filter((d) => d >= cutoff && d <= today)
    .reduce((acc, d) => {
      const ageDays = (today.getTime() - d.getTime()) / 86400000;
      const recency = 1 - ageDays / 30; // newer = closer to 1
      return acc + Math.max(0.4, recency); // floor at 0.4 so old still count
    }, 0);
  return Math.min(100, (weighted / TARGET) * 100);
}

/**
 * Reflection: reflections written, weighted by length.
 * Target: ≥80% of sessions reflected on, avg ≥30 words = 100%.
 */
export function reflectionPct(
  sessionsCount: number,
  reflections: { wordCount: number }[]
): number {
  if (sessionsCount === 0) return 0;
  const coverage = Math.min(1, reflections.length / sessionsCount);
  const avgWords =
    reflections.length === 0
      ? 0
      : reflections.reduce((s, r) => s + r.wordCount, 0) / reflections.length;
  const depth = Math.min(1, avgWords / 30);
  return Math.round(coverage * depth * 100);
}

/**
 * Mental: BRS check-ins + daily prompt completion in last 30 days.
 * Target: 1 BRS + 20 daily prompts = 100%.
 */
export function mentalPct(brsCount: number, dailyPromptCount: number): number {
  const brs = Math.min(1, brsCount); // at least one BRS check-in
  const prompts = Math.min(1, dailyPromptCount / 20);
  return Math.round((brs * 0.4 + prompts * 0.6) * 100);
}

/**
 * Recovery: V1 = manual soreness + weight logging adherence.
 * Target: soreness logged 20/30 days = 100%.
 */
export function recoveryPct(sorenessLogDays: number): number {
  return Math.min(100, Math.round((sorenessLogDays / 20) * 100));
}

/**
 * Self-Study: follow-up edits to old reflections + technique notes added.
 * Target: 5 follow-ups OR 5 technique notes in 30 days = 100%.
 */
export function selfStudyPct(followUpCount: number, techniqueNoteCount: number): number {
  return Math.min(100, Math.round(((followUpCount + techniqueNoteCount) / 5) * 100));
}
