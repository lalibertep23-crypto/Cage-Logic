'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { encryptField } from '@/lib/crypto';

// Daily injury progress log — pain, function, did_modified_training, encrypted notes.
// Writes injury_progress_logs row.

const Schema = z.object({
  injuryId: z.string().uuid(),
  pain: z.coerce
    .number({ invalid_type_error: 'Pick a value.' })
    .int()
    .min(0, 'Pick a value.')
    .max(10),
  fn: z.coerce
    .number({ invalid_type_error: 'Pick a value.' })
    .int()
    .min(0, 'Pick a value.')
    .max(10),
  didModified: z.coerce.boolean().optional(),
  notes: z
    .string()
    .trim()
    .max(2000, 'Keep it under 2000 characters.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export type ProgressState = {
  error?: string;
  fieldErrors?: Partial<Record<'pain' | 'fn' | 'notes', string>>;
};

function emptyToUndefined(v: FormDataEntryValue | null): string | undefined {
  const s = v?.toString().trim();
  return s && s.length > 0 ? s : undefined;
}

export async function logProgressAction(
  _prev: ProgressState,
  formData: FormData
): Promise<ProgressState> {
  const didModifiedRaw = formData.get('didModified');
  const parsed = Schema.safeParse({
    injuryId: formData.get('injuryId'),
    pain: formData.get('pain'),
    fn: formData.get('fn'),
    didModified: didModifiedRaw === 'on' || didModifiedRaw === 'true',
    notes: emptyToUndefined(formData.get('notes')),
  });

  if (!parsed.success) {
    const fieldErrors: ProgressState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const path0 = issue.path[0];
      if (path0 === 'injuryId') {
        return { error: 'Bad request — missing injury id.' };
      }
      const k = path0 as keyof NonNullable<ProgressState['fieldErrors']>;
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

  // Confirm injury belongs to this athlete.
  const { data: inj } = await supabase
    .from('injury_reports')
    .select('id')
    .eq('id', parsed.data.injuryId)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!inj) return { error: 'Injury not found.' };

  let encryptedNotes: string | null = null;
  try {
    encryptedNotes = encryptField(parsed.data.notes);
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : 'Encryption failed.',
    };
  }

  const { error } = await supabase.from('injury_progress_logs').insert({
    injury_id: parsed.data.injuryId,
    athlete_id: user.id,
    pain_0_10: parsed.data.pain,
    function_0_10: parsed.data.fn,
    did_modified_training: parsed.data.didModified ?? false,
    notes_encrypted: encryptedNotes,
  });

  if (error) return { error: error.message };

  redirect(`/recovery/injury/${parsed.data.injuryId}`);
}
