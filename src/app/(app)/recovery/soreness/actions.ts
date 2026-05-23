'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// Step 9a — Daily soreness logging.
// Upsert into daily_soreness_logs (UNIQUE on athlete_id, log_date).

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

const Schema = z.object({
  overall: z.coerce
    .number({ invalid_type_error: 'Pick a value.' })
    .int()
    .min(0, 'Pick a value.')
    .max(10),
  regions: z.array(z.enum(REGIONS)).default([]),
  notes: z.string().max(500).optional(),
});

export type SorenessState = {
  error?: string;
  fieldErrors?: Partial<Record<'overall' | 'regions', string>>;
};

function localDateString(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function logSorenessAction(
  _prev: SorenessState,
  formData: FormData
): Promise<SorenessState> {
  const rawRegions = formData.getAll('regions').map((v) => v.toString());
  const cleanRegions = rawRegions.filter((r) =>
    (REGIONS as readonly string[]).includes(r)
  );

  const parsed = Schema.safeParse({
    overall: formData.get('overall'),
    regions: cleanRegions,
    notes: (formData.get('notes') as string) || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: SorenessState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<SorenessState['fieldErrors']>;
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

  const { error } = await supabase.from('daily_soreness_logs').upsert(
    {
      athlete_id: user.id,
      log_date: localDateString(new Date()),
      overall_soreness_0_10: parsed.data.overall,
      body_regions: parsed.data.regions,
      notes: parsed.data.notes,
    },
    { onConflict: 'athlete_id,log_date' }
  );

  if (error) return { error: error.message };
  revalidatePath('/home');
  redirect('/recovery');
}