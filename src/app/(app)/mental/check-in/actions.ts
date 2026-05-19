'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Daily mental check-in. 1–5 scale. Writes psych_assessments with
// instrument='daily_prompt'. Feeds the Mental domain via dailyPromptCount.

const Schema = z.object({
  mood: z.coerce
    .number({ invalid_type_error: 'Pick a value.' })
    .int()
    .min(1, 'Pick a value.')
    .max(5),
  notes: z.string().max(2000).optional(),
});

export type CheckInState = {
  error?: string;
  fieldErrors?: Partial<Record<'mood', string>>;
};

export async function submitCheckInAction(
  _prev: CheckInState,
  formData: FormData
): Promise<CheckInState> {
  const parsed = Schema.safeParse({
    mood: formData.get('mood'),
    notes: formData.get('notes') || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: CheckInState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<CheckInState['fieldErrors']>;
      fieldErrors[k] = issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) return { error: 'Not signed in.' };

  const { error } = await supabase.from('psych_assessments').insert({
    athlete_id: user.id,
    instrument: 'daily_prompt',
    score: parsed.data.mood,
    raw_responses_encrypted: parsed.data.notes ?? null,
  });

  if (error) return { error: error.message };

  redirect('/home');
}
