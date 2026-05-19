'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const Schema = z.object({
  sessionDate:       z.string().min(1),
  startTime:         z.string().optional(),
  sessionType:       z.string().min(1),
  durationMinutes:   z.coerce.number().int().min(1).max(600),
  energyLevel:       z.coerce.number().int().min(1).max(10),
  intensityLevel:    z.coerce.number().int().min(1).max(10),
  whatClicked:       z.string().max(2000).optional(),
  whatDidnt:         z.string().max(2000).optional(),
  questionForCoach:  z.string().max(500).optional(),
});

export type EditState = { error?: string; fieldErrors?: Record<string, string> };

export async function editSessionAction(
  id: string,
  _prev: EditState,
  formData: FormData
): Promise<EditState> {
  const parsed = Schema.safeParse({
    sessionDate:      formData.get('sessionDate'),
    startTime:        formData.get('startTime') || undefined,
    sessionType:      formData.get('sessionType'),
    durationMinutes:  formData.get('durationMinutes'),
    energyLevel:      formData.get('energyLevel'),
    intensityLevel:   formData.get('intensityLevel'),
    whatClicked:      formData.get('whatClicked') || undefined,
    whatDidnt:        formData.get('whatDidnt') || undefined,
    questionForCoach: formData.get('questionForCoach') || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return { error: 'Not signed in.' };

  const d = parsed.data;

  // Update core session
  const { error: sessErr } = await supabase
    .from('training_sessions')
    .update({
      session_date:      d.sessionDate,
      start_time:        d.startTime ?? null,
      session_type:      d.sessionType,
      duration_minutes:  d.durationMinutes,
      energy_1_10:       d.energyLevel,
      intensity_1_10:    d.intensityLevel,
    })
    .eq('id', id)
    .eq('athlete_id', user.id);

  if (sessErr) return { error: sessErr.message };

  // Upsert reflection (delete + insert is simplest given single-row pattern)
  await supabase.from('session_reflections').delete().eq('session_id', id);

  if (d.whatClicked || d.whatDidnt || d.questionForCoach) {
    const { error: reflErr } = await supabase.from('session_reflections').insert({
      session_id:         id,
      athlete_id:         user.id,
      what_clicked:       d.whatClicked ?? null,
      what_didnt:         d.whatDidnt ?? null,
      question_for_coach: d.questionForCoach ?? null,
    });
    if (reflErr) return { error: reflErr.message };
  }

  redirect(`/history/${id}`);
}
