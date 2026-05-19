// Step 10 — Data export.
// GET /api/export → JSON download of the athlete's training data.
// V1 scope: sessions, reflections, rolls, soreness, disciplines, profile basics.
// V1 explicitly excludes encrypted-content tables (psych, injury notes, post-loss).
// Full export with decryption ships in V1.5.

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function todayDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const [
    athleteRes,
    disciplinesRes,
    goalsRes,
    sessionsRes,
    reflectionsRes,
    rollsRes,
    sorenessRes,
    competitionsRes,
    matchesRes,
  ] = await Promise.all([
    supabase
      .from('athletes')
      .select(
        'display_name, sex, date_of_birth, height_cm, current_weight_kg, walking_weight_kg, dominant_side, day_job_category, day_job_hours_physical_per_day, start_date, created_at'
      )
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('athlete_disciplines')
      .select('discipline, rank, rank_color, stripes, start_date, is_primary')
      .eq('athlete_id', user.id),
    supabase
      .from('athlete_goals')
      .select('why_training, comp_status, belt_goal, notes')
      .eq('athlete_id', user.id)
      .maybeSingle(),
    supabase
      .from('training_sessions')
      .select(
        'id, session_date, start_time, duration_minutes, session_type, energy_1_10, intensity_1_10, notes, created_at'
      )
      .eq('athlete_id', user.id)
      .order('session_date', { ascending: false }),
    supabase
      .from('session_reflections')
      .select(
        'session_id, what_clicked, what_didnt, question_for_coach, follow_up_notes, created_at, updated_at'
      )
      .eq('athlete_id', user.id),
    supabase
      .from('roll_logs')
      .select(
        'session_id, round_number, partner_label, partner_relative_size, outcome, outcome_method, felt, created_at'
      )
      .eq('athlete_id', user.id),
    supabase
      .from('daily_soreness_logs')
      .select('log_date, overall_soreness_0_10, body_regions, created_at')
      .eq('athlete_id', user.id),
    supabase
      .from('competitions')
      .select('*')
      .eq('athlete_id', user.id),
    supabase
      .from('competition_matches')
      .select('*')
      .eq('athlete_id', user.id),
  ]);

  const payload = {
    cage_logic_export: {
      version: 1,
      exported_at: new Date().toISOString(),
      athlete_id: user.id,
      email: user.email ?? null,
      scope:
        'V1: training data only. Encrypted-content tables (psych assessments, injury notes, post-loss reflections, health baseline) are excluded. Full export ships in V1.5.',
    },
    profile: athleteRes.data ?? null,
    disciplines: disciplinesRes.data ?? [],
    goals: goalsRes.data ?? null,
    training_sessions: sessionsRes.data ?? [],
    session_reflections: reflectionsRes.data ?? [],
    roll_logs: rollsRes.data ?? [],
    daily_soreness_logs: sorenessRes.data ?? [],
    competitions: competitionsRes.data ?? [],
    competition_matches: matchesRes.data ?? [],
  };

  const body = JSON.stringify(payload, null, 2);
  const filename = `cage-logic-export-${user.id.slice(0, 8)}-${todayDate()}.json`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
