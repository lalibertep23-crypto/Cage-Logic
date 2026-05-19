'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { encryptField } from '@/lib/crypto';

// Step 9d — I-PRRS submission.
// 6 items, 0-100 scale in increments of 10. Score = sum / 10 (range 0-60).
// Inserts psych_assessments row with instrument='I-PRRS' + raw responses encrypted.
// Updates injury_reports.i_prrs_score with the latest score.
// NOT clinical clearance. Framing handled in UI.

const item = z.coerce
  .number({ invalid_type_error: 'Pick a value.' })
  .int()
  .min(0, 'Pick a value.')
  .max(100)
  .refine((n) => n % 10 === 0, { message: 'Use increments of 10.' });

const Schema = z.object({
  injuryId: z.string().uuid(),
  q1: item,
  q2: item,
  q3: item,
  q4: item,
  q5: item,
  q6: item,
});

export type IPrrsState = {
  error?: string;
  fieldErrors?: Partial<
    Record<'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6', string>
  >;
};

export async function submitIPrrsAction(
  _prev: IPrrsState,
  formData: FormData
): Promise<IPrrsState> {
  const parsed = Schema.safeParse({
    injuryId: formData.get('injuryId'),
    q1: formData.get('q1'),
    q2: formData.get('q2'),
    q3: formData.get('q3'),
    q4: formData.get('q4'),
    q5: formData.get('q5'),
    q6: formData.get('q6'),
  });

  if (!parsed.success) {
    const fieldErrors: IPrrsState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const path0 = issue.path[0];
      if (path0 === 'injuryId') {
        return { error: 'Bad request — missing injury id.' };
      }
      const k = path0 as keyof NonNullable<IPrrsState['fieldErrors']>;
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

  // Confirm the injury belongs to this user.
  const { data: injury } = await supabase
    .from('injury_reports')
    .select('id')
    .eq('id', parsed.data.injuryId)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!injury) return { error: 'Injury not found.' };

  const { q1, q2, q3, q4, q5, q6 } = parsed.data;
  const score = (q1 + q2 + q3 + q4 + q5 + q6) / 10; // 0–60

  let encrypted: string | null = null;
  try {
    encrypted = encryptField(JSON.stringify({ q1, q2, q3, q4, q5, q6 }));
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : 'Encryption failed.',
    };
  }

  const { error: assessErr } = await supabase.from('psych_assessments').insert({
    athlete_id: user.id,
    instrument: 'I-PRRS',
    raw_responses_encrypted: encrypted,
    score,
  });
  if (assessErr) return { error: assessErr.message };

  const { error: updErr } = await supabase
    .from('injury_reports')
    .update({ i_prrs_score: score })
    .eq('id', parsed.data.injuryId)
    .eq('athlete_id', user.id);
  if (updErr) return { error: updErr.message };

  redirect(`/recovery/injury/${parsed.data.injuryId}`);
}
