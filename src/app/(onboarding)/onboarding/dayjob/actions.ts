'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const DAYJOB_CATEGORIES = [
  'desk',
  'light',
  'moderate',
  'heavy',
  'shift_or_variable',
  'not_working',
] as const;

const Schema = z.object({
  dayJobCategory: z.enum(DAYJOB_CATEGORIES),
  hoursPhysicalPerDay: z.coerce
    .number()
    .min(0, 'Must be 0 or more.')
    .max(16, 'Capped at 16.'),
});

export type DayjobState = {
  error?: string;
  fieldErrors?: Partial<
    Record<'dayJobCategory' | 'hoursPhysicalPerDay', string>
  >;
};

/**
 * Onboarding Step 7 — Day job category + physical hours/day.
 * Day-job load is a first-class input to the future recovery/training factor.
 */
export async function saveDayjobAction(
  _prev: DayjobState,
  formData: FormData
): Promise<DayjobState> {
  const parsed = Schema.safeParse({
    dayJobCategory: formData.get('dayJobCategory'),
    hoursPhysicalPerDay: formData.get('hoursPhysicalPerDay'),
  });

  if (!parsed.success) {
    const fieldErrors: DayjobState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<DayjobState['fieldErrors']>;
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

  const { error } = await supabase
    .from('athletes')
    .update({
      day_job_category: parsed.data.dayJobCategory,
      day_job_hours_physical_per_day: parsed.data.hoursPhysicalPerDay,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  redirect('/onboarding/health');
}
