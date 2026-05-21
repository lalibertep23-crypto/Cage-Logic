'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function logBreathworkSession(pattern: string, durationMin: number, comfortRating?: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { error } = await (supabase.from as any)('breathwork_sessions').insert({
    athlete_id: user.id,
    pattern,
    duration_min: durationMin,
    ...(comfortRating != null ? { comfort_0_10: comfortRating } : {}),
  });

  if (error) {
    console.error('[logBreathworkSession]', error.message);
    // Don't throw — logging failure shouldn't break the session
  }
}

export async function getBreathworkSessions(athleteId: string) {
  const supabase = await createClient();

  const { count: totalCount } = await supabase
    .from('breathwork_sessions' as any)
    .select('id', { count: 'exact', head: true })
    .eq('athlete_id', athleteId);

  const { count: phase1Count } = await supabase
    .from('breathwork_sessions' as any)
    .select('id', { count: 'exact', head: true })
    .eq('pattern', 'phase_1');

  return {
    total: totalCount ?? 0,
    phase1: phase1Count ?? 0,
  };
}
