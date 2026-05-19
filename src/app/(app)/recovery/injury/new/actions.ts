'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { encryptField } from '@/lib/crypto';

// Step 9b — Report a new injury.
// Inserts injury_reports with stage='acute'. Notes are encrypted.

const REGIONS = [
  'head',
  'neck',
  'shoulder',
  'elbow',
  'wrist_hand',
  'ribs',
  'upper_back',
  'low_back',
  'hip_groin',
  'knee',
  'ankle_foot',
  'other',
] as const;

const SIDES = ['left', 'right', 'bilateral', 'axial', 'na'] as const;

const Schema = z.object({
  region: z.enum(REGIONS),
  side: z.enum(SIDES),
  mechanism: z
    .string()
    .trim()
    .max(1000, 'Keep it under 1000 characters.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  pain: z.coerce
    .number({ invalid_type_error: 'Pick a value.' })
    .int()
    .min(0, 'Pick a value.')
    .max(10),
  occurredOn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date.'),
  notes: z
    .string()
    .trim()
    .max(2000, 'Keep it under 2000 characters.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export type InjuryState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof Schema>, string>>;
};

function emptyToUndefined(v: FormDataEntryValue | null): string | undefined {
  const s = v?.toString().trim();
  return s && s.length > 0 ? s : undefined;
}

export async function reportInjuryAction(
  _prev: InjuryState,
  formData: FormData
): Promise<InjuryState> {
  const parsed = Schema.safeParse({
    region: formData.get('region'),
    side: formData.get('side'),
    mechanism: emptyToUndefined(formData.get('mechanism')),
    pain: formData.get('pain'),
    occurredOn: formData.get('occurredOn'),
    notes: emptyToUndefined(formData.get('notes')),
  });

  if (!parsed.success) {
    const fieldErrors: InjuryState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<InjuryState['fieldErrors']>;
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

  let encryptedNotes: string | null = null;
  try {
    encryptedNotes = encryptField(parsed.data.notes);
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : 'Encryption failed.',
    };
  }

  const { data: inserted, error } = await supabase
    .from('injury_reports')
    .insert({
      athlete_id: user.id,
      body_region: parsed.data.region,
      side: parsed.data.side,
      mechanism: parsed.data.mechanism ?? null,
      pain_at_report_0_10: parsed.data.pain,
      occurred_on: parsed.data.occurredOn,
      stage: 'acute',
      notes_encrypted: encryptedNotes,
    })
    .select('id')
    .single();

  if (error || !inserted) {
    return { error: error?.message ?? 'Failed to save injury.' };
  }

  redirect(`/recovery/injury/${inserted.id as string}`);
}
