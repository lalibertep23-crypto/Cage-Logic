// Server-only helper: loads everything the Home screen needs in one round-trip,
// computes Investment Score domains, weekly summary, training streak, and the
// contextual nudge.
// Updated 2026-05-22 to match CageLogic_InvestmentScore_Schema.docx (Chris Denardo).

import { differenceInCalendarDays, subDays } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import {
  computeInvestmentScore,
  consistencyPct,
  reflectionPct,
  mentalPct,
  recoveryPct,
  selfStudyPct,
  NUDGE_THRESHOLDS,
  type ScoreResult,
  type ReflectionEntry,
  type MentalWeek,
  type RecoveryDay,
  type SelfStudyDay,
} from './computeInvestmentScore';

export type HomeData = {
  athleteId:       string;
  displayName:     string | null;
  daysSinceSignup: number;
  score:           ScoreResult;
  today: {
    loggedToday:     boolean;
    sessionType:     string | null;
    durationMinutes: number | null;
  };
  weekly: {
    sessions:    number;
    reflections: number;
    rolls:       number;
    brsCheckins: number;
  };
  streaks: {
    training: number;
  };
  nudge: string;
};

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function loadHomeData(): Promise<HomeData | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch athlete — including training_frequency_per_week (migration 0012)
  const { data: athlete } = await supabase
    .from('athletes')
    .select('id, display_name, created_at, training_frequency_per_week')
    .eq('id', user.id)
    .maybeSingle();
  if (!athlete) return null;

  const today           = new Date();
  const todayStr        = isoDay(today);
  const created         = new Date(athlete.created_at as string);
  const daysSinceSignup = Math.max(0, differenceInCalendarDays(today, created));
  const monthCutoff     = subDays(today, 30);
  const monthCutoffStr  = isoDay(monthCutoff);
  const weekCutoff      = subDays(today, 7);
  const weekCutoffIso   = weekCutoff.toISOString();
  const weekCutoffStr   = isoDay(weekCutoff);

  // ── Parallel data load ────────────────────────────────────────────────────
  const [
    sessionsRes,
    reflectionsRes,
    brsRes,
    dailyPromptsRes,
    postLossRes,
    sorenessRes,
    customTechRes,
    rollsRes,
  ] = await Promise.all([
    supabase
      .from('training_sessions')
      .select('id, session_date, start_time, duration_minutes, session_type')
      .eq('athlete_id', athlete.id)
      .gte('session_date', monthCutoffStr)
      .order('session_date', { ascending: false }),

    // char_count from migration 0012 generated column
    supabase
      .from('session_reflections')
      .select('id, session_id, char_count, created_at, updated_at, follow_up_notes')
      .eq('athlete_id', athlete.id)
      .gte('created_at', monthCutoff.toISOString()),

    supabase
      .from('psych_assessments')
      .select('id, taken_at')
      .eq('athlete_id', athlete.id)
      .eq('instrument', 'BRS')
      .gte('taken_at', monthCutoff.toISOString()),

    supabase
      .from('psych_assessments')
      .select('id, taken_at')
      .eq('athlete_id', athlete.id)
      .eq('instrument', 'daily_prompt')
      .gte('taken_at', monthCutoff.toISOString()),

    // Post-loss Phase 1 completions (mental domain post-loss bonus)
    supabase
      .from('loss_phase_1_responses')
      .select('id, created_at')
      .eq('athlete_id', athlete.id)
      .gte('created_at', monthCutoff.toISOString()),

    // energy_0_10 from migration 0012
    supabase
      .from('daily_soreness_logs')
      .select('id, log_date, overall_soreness_0_10, energy_0_10')
      .eq('athlete_id', athlete.id)
      .gte('log_date', monthCutoffStr),

    supabase
      .from('custom_technique_submissions')
      .select('id, created_at')
      .eq('athlete_id', athlete.id)
      .gte('created_at', monthCutoff.toISOString()),

    supabase
      .from('roll_logs')
      .select('id, created_at')
      .eq('athlete_id', athlete.id)
      .gte('created_at', weekCutoffIso),
  ]);

  const sessions     = sessionsRes.data ?? [];
  const reflections  = reflectionsRes.data ?? [];
  const brs          = brsRes.data ?? [];
  const dailyPrompts = dailyPromptsRes.data ?? [];
  const postLoss     = postLossRes.data ?? [];
  const soreness     = sorenessRes.data ?? [];
  const customTechs  = customTechRes.data ?? [];
  const rolls        = rollsRes.data ?? [];

  // Technique tags: batch fetch for all sessions in window
  const sessionIds = sessions.map(s => s.id as string);
  const sessionTechData = sessionIds.length > 0
    ? (await supabase
        .from('session_techniques')
        .select('session_id, technique_id')
        .in('session_id', sessionIds)
      ).data ?? []
    : [];

  // ── Domain 1 — Consistency ────────────────────────────────────────────────
  const consistency = consistencyPct(
    sessions.map(s => new Date(s.session_date as string)),
    (athlete.training_frequency_per_week as number | null) ?? null,
    today,
  );

  // ── Domain 2 — Reflection ─────────────────────────────────────────────────
  // wasEdited: updated_at is > 5 minutes after created_at
  const reflectionEntries: ReflectionEntry[] = reflections.map(r => ({
    sessionId: r.session_id as string,
    charCount: (r.char_count as number | null) ?? null,
    wasEdited: r.updated_at && r.created_at
      ? (new Date(r.updated_at as string).getTime() - new Date(r.created_at as string).getTime()) > 5 * 60 * 1000
      : false,
  }));
  const reflection = reflectionPct(sessions.length, reflectionEntries);

  // ── Domain 3 — Mental ─────────────────────────────────────────────────────
  // 4 weekly buckets. Week 0 = most recent 7 days, week 3 = days 22–30.
  const mentalWeeks: MentalWeek[] = [0, 1, 2, 3].map(weekIndex => {
    const weekEnd   = subDays(today, weekIndex * 7);
    const weekStart = subDays(today, (weekIndex + 1) * 7);
    return {
      weekIndex,
      brsCompleted:  brs.some(b => {
        const t = new Date(b.taken_at as string);
        return t >= weekStart && t <= weekEnd;
      }),
      dailyPrompts: dailyPrompts.filter(p => {
        const t = new Date(p.taken_at as string);
        return t >= weekStart && t <= weekEnd;
      }).length,
      postLossBonus: postLoss.some(pl => {
        const t = new Date(pl.created_at as string);
        return t >= weekStart && t <= weekEnd;
      }),
    };
  });
  const mental = mentalPct(mentalWeeks);

  // ── Domain 4 — Recovery ───────────────────────────────────────────────────
  // One RecoveryDay per calendar day in the 30-day window.
  // Unlogged days included as logged=false — they pull the score down.
  const sorenessMap = new Map<string, typeof soreness[0]>();
  for (const s of soreness) sorenessMap.set(s.log_date as string, s);

  const recoveryDays: RecoveryDay[] = Array.from({ length: 30 }, (_, i) => {
    const dateStr = isoDay(subDays(today, i));
    const log     = sorenessMap.get(dateStr);
    return {
      ageDays:  i,
      logged:   !!log,
      energy:   log ? ((log.energy_0_10 as number | null) ?? null) : null,
      soreness: log ? ((log.overall_soreness_0_10 as number | null) ?? null) : null,
    };
  });
  const recovery = recoveryPct(recoveryDays);

  // ── Domain 5 — Self-Study ─────────────────────────────────────────────────
  // session → date map
  const sessionDateMap = new Map<string, string>();
  for (const s of sessions) sessionDateMap.set(s.id as string, s.session_date as string);

  // Technique tag counts per session
  const techPerSession = new Map<string, number>();
  for (const t of sessionTechData) {
    const sid = t.session_id as string;
    techPerSession.set(sid, (techPerSession.get(sid) ?? 0) + 1);
  }

  // Aggregate by calendar day
  const tagsByDay      = new Map<string, number>();
  const customByDay    = new Map<string, number>();
  const editsByDay     = new Map<string, number>();
  const followUpByDay  = new Map<string, number>();

  for (const [sid, count] of techPerSession) {
    const date = sessionDateMap.get(sid);
    if (date) tagsByDay.set(date, (tagsByDay.get(date) ?? 0) + count);
  }
  for (const ct of customTechs) {
    const date = isoDay(new Date(ct.created_at as string));
    customByDay.set(date, (customByDay.get(date) ?? 0) + 1);
  }
  for (const r of reflections) {
    const wasEdited = r.updated_at && r.created_at
      ? (new Date(r.updated_at as string).getTime() - new Date(r.created_at as string).getTime()) > 5 * 60 * 1000
      : false;
    if (wasEdited) {
      const date = isoDay(new Date(r.updated_at as string));
      editsByDay.set(date, (editsByDay.get(date) ?? 0) + 1);
    }
    if (r.follow_up_notes) {
      const date = isoDay(new Date(r.updated_at as string));
      followUpByDay.set(date, (followUpByDay.get(date) ?? 0) + 1);
    }
  }

  const selfStudyDays: SelfStudyDay[] = Array.from({ length: 30 }, (_, i) => {
    const dateStr = isoDay(subDays(today, i));
    return {
      ageDays:           i,
      techniqueTagCount: tagsByDay.get(dateStr) ?? 0,
      customTechCount:   customByDay.get(dateStr) ?? 0,
      returnEditCount:   editsByDay.get(dateStr) ?? 0,
      followUpCount:     followUpByDay.get(dateStr) ?? 0,
    };
  });
  const selfStudy = selfStudyPct(selfStudyDays);

  // ── Composite ─────────────────────────────────────────────────────────────
  const domains = { consistency, reflection, mental, recovery, selfStudy };
  const score   = computeInvestmentScore(Math.min(30, daysSinceSignup), domains);

  // ── Today's status ────────────────────────────────────────────────────────
  const todaySession = sessions.find(s => (s.session_date as string) === todayStr) ?? null;

  // ── Weekly counts ─────────────────────────────────────────────────────────
  const weekSessions    = sessions.filter(s => (s.session_date as string) >= weekCutoffStr).length;
  const weekReflections = reflections.filter(r => new Date(r.created_at as string) >= weekCutoff).length;
  const weekBrs         = brs.filter(b => new Date(b.taken_at as string) >= weekCutoff).length;
  const weekRolls       = rolls.length;

  // ── Training streak ───────────────────────────────────────────────────────
  const sessionDays = new Set(sessions.map(s => s.session_date as string));
  let trainingStreak       = 0;
  let startedFromYesterday = false;
  for (let i = 0; i < 60; i++) {
    const d = isoDay(subDays(today, i));
    if (sessionDays.has(d)) {
      trainingStreak++;
    } else if (i === 0) {
      startedFromYesterday = true;
      continue;
    } else if (startedFromYesterday && i === 1 && !sessionDays.has(d)) {
      break;
    } else {
      break;
    }
  }

  // ── Nudge — single weakest domain below threshold ─────────────────────────
  const NUDGE_COPY: Record<string, string> = {
    consistency: "Last session was a while ago. Get back on the mat.",
    reflection:  "Add a reflection to your most recent session.",
    mental:      "Three-minute BRS check-in moves the Mental score.",
    recovery:    "Log today's soreness. Five seconds.",
    selfStudy:   "Open last week's session. Add one follow-up note.",
  };

  let nudge = 'Log your first session. Score starts moving immediately.';
  if (sessions.length > 0) {
    const ranked = (Object.keys(NUDGE_THRESHOLDS) as Array<keyof typeof NUDGE_THRESHOLDS>)
      .filter(k => domains[k] < NUDGE_THRESHOLDS[k])
      .sort((a, b) => domains[a] - domains[b]);
    nudge = ranked.length > 0
      ? NUDGE_COPY[ranked[0]]
      : 'All domains on track. Keep it up.';
  } else if (daysSinceSignup === 0) {
    nudge = 'Onboarded today. Log your first session whenever you next train.';
  }

  return {
    athleteId:       athlete.id as string,
    displayName:     (athlete.display_name as string | null) ?? null,
    daysSinceSignup,
    score,
    today: {
      loggedToday:     !!todaySession,
      sessionType:     todaySession ? ((todaySession.session_type as string | null) ?? null) : null,
      durationMinutes: todaySession ? ((todaySession.duration_minutes as number | null) ?? null) : null,
    },
    weekly: {
      sessions:    weekSessions,
      reflections: weekReflections,
      rolls:       weekRolls,
      brsCheckins: weekBrs,
    },
    streaks: {
      training: trainingStreak,
    },
    nudge,
  };
}
