// Server-only helper: loads everything the Home screen needs in one round-trip,
// computes Investment Score domains, weekly summary, training streak, and the
// contextual nudge.

import { differenceInCalendarDays, subDays } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import {
  computeInvestmentScore,
  consistencyPct,
  reflectionPct,
  mentalPct,
  recoveryPct,
  selfStudyPct,
  type ScoreResult,
} from './computeInvestmentScore';

export type HomeData = {
  athleteId: string;
  displayName: string | null;
  daysSinceSignup: number;
  score: ScoreResult;
  today: {
    loggedToday: boolean;
    sessionType: string | null;
    durationMinutes: number | null;
  };
  weekly: {
    sessions: number;
    reflections: number;
    rolls: number;
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: athlete } = await supabase
    .from('athletes')
    .select('id, display_name, created_at')
    .eq('id', user.id)
    .maybeSingle();
  if (!athlete) return null;

  const today = new Date();
  const todayStr = isoDay(today);
  const created = new Date(athlete.created_at as string);
  const daysSinceSignup = Math.max(0, differenceInCalendarDays(today, created));
  const monthCutoff = subDays(today, 30);
  const monthCutoffStr = isoDay(monthCutoff);
  const weekCutoff = subDays(today, 7);
  const weekCutoffIso = weekCutoff.toISOString();
  const weekCutoffStr = isoDay(weekCutoff);

  // Parallel data load
  const [
    sessionsRes,
    reflectionsRes,
    brsRes,
    dailyPromptsRes,
    sorenessRes,
    customTagsRes,
    followUpsRes,
    rollsRes,
  ] = await Promise.all([
    supabase
      .from('training_sessions')
      .select('id, session_date, start_time, duration_minutes, session_type')
      .eq('athlete_id', athlete.id)
      .gte('session_date', monthCutoffStr)
      .order('session_date', { ascending: false }),
    supabase
      .from('session_reflections')
      .select('id, created_at, word_count')
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
    supabase
      .from('daily_soreness_logs')
      .select('id, log_date')
      .eq('athlete_id', athlete.id)
      .gte('log_date', monthCutoffStr),
    supabase
      .from('technique_tags')
      .select('id, created_at')
      .eq('created_by', user.id)
      .gte('created_at', monthCutoff.toISOString()),
    supabase
      .from('session_reflections')
      .select('id, follow_up_notes, updated_at')
      .eq('athlete_id', athlete.id)
      .not('follow_up_notes', 'is', null)
      .gte('updated_at', monthCutoff.toISOString()),
    supabase
      .from('roll_logs')
      .select('id, created_at')
      .eq('athlete_id', athlete.id)
      .gte('created_at', weekCutoffIso),
  ]);

  const sessions = sessionsRes.data ?? [];
  const reflections = reflectionsRes.data ?? [];
  const brs = brsRes.data ?? [];
  const dailyPrompts = dailyPromptsRes.data ?? [];
  const soreness = sorenessRes.data ?? [];
  const customTags = customTagsRes.data ?? [];
  const followUps = followUpsRes.data ?? [];
  const rolls = rollsRes.data ?? [];

  // Domain pcts
  const domains = {
    consistency: consistencyPct(
      sessions.map((s) => new Date(s.session_date as string)),
      today
    ),
    reflection: reflectionPct(
      sessions.length,
      reflections.map((r) => ({ wordCount: (r.word_count as number) ?? 0 }))
    ),
    mental: mentalPct(brs.length, dailyPrompts.length),
    recovery: recoveryPct(soreness.length),
    selfStudy: selfStudyPct(followUps.length, customTags.length),
  };

  const score = computeInvestmentScore(Math.min(30, daysSinceSignup), domains);

  // Today's status
  const todaySession =
    sessions.find((s) => (s.session_date as string) === todayStr) ?? null;

  // Weekly counts
  const weekSessions = sessions.filter(
    (s) => (s.session_date as string) >= weekCutoffStr
  ).length;
  const weekReflections = reflections.filter(
    (r) => new Date(r.created_at as string) >= weekCutoff
  ).length;
  const weekBrs = brs.filter(
    (b) => new Date(b.taken_at as string) >= weekCutoff
  ).length;
  const weekRolls = rolls.length;

  // Training streak: consecutive days with a session, starting from today
  // (or yesterday if today not logged yet — don't penalize early-day check-ins).
  const sessionDays = new Set(sessions.map((s) => s.session_date as string));
  let trainingStreak = 0;
  let startedFromYesterday = false;
  for (let i = 0; i < 60; i++) {
    const d = isoDay(subDays(today, i));
    if (sessionDays.has(d)) {
      trainingStreak++;
    } else if (i === 0) {
      // today not logged yet — allow; start counting from yesterday
      startedFromYesterday = true;
      continue;
    } else if (startedFromYesterday && i === 1 && !sessionDays.has(d)) {
      // yesterday also not logged. streak = 0.
      break;
    } else {
      break;
    }
  }

  // Nudge — weakest domain, or "log first session" if none.
  let nudge = 'Log your first session. Score starts moving immediately.';
  if (sessions.length > 0) {
    const ranked = [
      { v: domains.consistency, msg: 'Last session was a while ago. Get back on the mat.' },
      { v: domains.reflection, msg: 'Add a reflection to your most recent session.' },
      { v: domains.mental, msg: 'Three-minute BRS check-in moves the Mental score.' },
      { v: domains.recovery, msg: 'Log today’s soreness. Five seconds.' },
      { v: domains.selfStudy, msg: 'Open last week’s reflection. Add one follow-up note.' },
    ];
    ranked.sort((a, b) => a.v - b.v);
    nudge = ranked[0].msg;
  } else if (daysSinceSignup === 0) {
    nudge = 'Onboarded today. Log your first session whenever you next train.';
  }

  return {
    athleteId: athlete.id as string,
    displayName: (athlete.display_name as string | null) ?? null,
    daysSinceSignup,
    score,
    today: {
      loggedToday: !!todaySession,
      sessionType: todaySession ? ((todaySession.session_type as string | null) ?? null) : null,
      durationMinutes: todaySession ? ((todaySession.duration_minutes as number | null) ?? null) : null,
    },
    weekly: {
      sessions: weekSessions,
      reflections: weekReflections,
      rolls: weekRolls,
      brsCheckins: weekBrs,
    },
    streaks: {
      training: trainingStreak,
    },
    nudge,
  };
}
