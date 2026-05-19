'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const SEXES = ['male', 'female', 'other', 'prefer_not'] as const;
const SIDES = ['left', 'right', 'ambi'] as const;

const Schema = z.object({
  sex: z.enum(SEXES),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a valid date.'),
  heightFeet: z.coerce.number().int().min(3, 'Too short.').max(8, 'Too tall.'),
  heightInches: z.coerce.number().int().min(0).max(11, '0–11 inches.'),
  currentWeightLb: z.coerce.number().positive('Required.').max(800),
  walkingWeightLb: z.coerce.number().positive().max(800).optional(),
  dominantSide: z.enum(SIDES),
});

export type BaselineState = {
  error?: string;
  fieldErrors?: Partial<
    Record<
      | 'sex'
      | 'dateOfBirth'
      | 'heightFeet'
      | 'heightInches'
      | 'currentWeightLb'
      | 'walkingWeightLb'
      | 'dominantSide',
      string
    >
  >;
};

const LB_PER_KG = 2.2046226218;
const CM_PER_IN = 2.54;

/**
 * Onboarding Step 6 — Physical baseline.
 * Updates the athletes row (already created in Step 3).
 * UI is imperial (ft/in, lbs); DB stores metric.
 */
export async function saveBaselineAction(
  _prev: BaselineState,
  formData: FormData
): Promise<BaselineState> {
  const rawWalk = formData.get('walkingWeightLb')?.toString();
  const parsed = Schema.safeParse({
    sex: formData.get('sex'),
    dateOfBirth: formData.get('dateOfBirth'),
    heightFeet: formData.get('heightFeet'),
    heightInches: formData.get('heightInches'),
    currentWeightLb: formData.get('currentWeightLb'),
    walkingWeightLb: rawWalk && rawWalk.length > 0 ? rawWalk : undefined,
    dominantSide: formData.get('dominantSide'),
  });

  if (!parsed.success) {
    const fieldErrors: BaselineState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<BaselineState['fieldErrors']>;
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

  const totalInches = parsed.data.heightFeet * 12 + parsed.data.heightInches;
  const heightCm = +(totalInches * CM_PER_IN).toFixed(2);
  const currentWeightKg = +(parsed.data.currentWeightLb / LB_PER_KG).toFixed(2);
  const walkingWeightKg = +(
    (parsed.data.walkingWeightLb ?? parsed.data.currentWeightLb) / LB_PER_KG
  ).toFixed(2);

  const { error } = await supabase
    .from('athletes')
    .update({
      sex: parsed.data.sex,
      date_of_birth: parsed.data.dateOfBirth,
      height_cm: heightCm,
      current_weight_kg: currentWeightKg,
      walking_weight_kg: walkingWeightKg,
      dominant_side: parsed.data.dominantSide,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  redirect('/onboarding/dayjob');
}
