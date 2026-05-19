'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { encryptField } from '@/lib/crypto';

// Step 7 — BRS check-in.
// 6-item Brief Resilience Scale (Smith et al., 2008).
// Items 2, 4, 6 are reverse-scored. Total = sum / 6, range 1.00–5.00.
// Bands: 1.00–2.99 low, 3.00–4.30 normal, 4.31–5.00 high.
// Raw responses are AES-256-GCM-encrypted before insert.

const item = z.coerce
  .number({ invalid_type_error: 'Pick a value.' })
  .int()
  .min(1, 'Pick a value.')
  .max(5);

const Schema = z.object({
  q1: item,
  q2: item,
  q3: item,
  q4: item,
  q5: item,
  q6: item,
});

export type BrsState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof Schema>, string>>;
};

export async function submitBrsAction(
  _prev: BrsState,
  formData: FormData
): Promise<BrsState> {
  const parsed = Schema.safeParse({
    q1: formData.get('q1'),
    q2: formData.get('q2'),
    q3: formData.get('q3'),
    q4: formData.get('q4'),
    q5: formData.get('q5'),
    q6: formData.get('q6'),
  });

  if (!parsed.success) {
    const fieldErrors: BrsState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<BrsState['fieldErrors']>;
      fieldErrors[k] = issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return { error: 'Not signed in.' };
  }

  const raw = parsed.data;
  // Reverse-score items 2, 4, 6 (new = 6 - original).
  const total =
    (raw.q1 + (6 - raw.q2) + raw.q3 + (6 - raw.q4) + raw.q5 + (6 - raw.q6)) / 6;
  const score = Math.round(total * 100) / 100;

  let encrypted: string | null;
  try {
    encrypted = encryptField(JSON.stringify(raw));
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Encryption failed.' };
  }

  const { error } = await supabase.from('psych_assessments').insert({
    athlete_id: user.id,
    instrument: 'BRS',
    raw_responses_encrypted: encrypted,
    score,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/mental/result');
}
