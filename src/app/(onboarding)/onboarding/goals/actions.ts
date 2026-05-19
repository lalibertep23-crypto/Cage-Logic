'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const COMP_STATUSES = ['never', 'occasional', 'regular', 'pro'] as const;

const Schema = z.object({
  whyTraining: z
    .string()
    .trim()
    .max(500, 'Keep it under 500 characters.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  compStatus: z.enum(COMP_STATUSES),
  beltGoal: z
    .string()
    .trim()
    .max(120, 'Keep it under 120 characters.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export type GoalsState = {
  error?: string;
  fieldErrors?: Partial<Record<'whyTraining' | 'compStatus' | 'beltGoal', string>>;
};

/**
 * Onboarding Step 5 — Goals.
 * Upserts one athlete_goals row per athlete (V1 expects 0 or 1 row).
 */
export async function saveGoalsAction(
  _prev: GoalsState,
  formData: FormData
): Promise<GoalsState> {
  const parsed = Schema.safeParse({
    whyTraining: formData.get('whyTraining'),
    compStatus: formData.get('compStatus'),
    beltGoal: formData.get('beltGoal'),
  });

  if (!parsed.success) {
    const fieldErrors: GoalsState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<GoalsState['fieldErrors']>;
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

  const { data: existing } = await supabase
    .from('athlete_goals')
    .select('id')
    .eq('athlete_id', user.id)
    .maybeSingle();

  const payload = {
    athlete_id: user.id,
    why_training: parsed.data.whyTraining ?? null,
    comp_status: parsed.data.compStatus,
    belt_goal: parsed.data.beltGoal ?? null,
  };

  const { error } = existing
    ? await supabase
        .from('athlete_goals')
        .update(payload)
        .eq('id', existing.id as string)
    : await supabase.from('athlete_goals').insert(payload);

  if (error) {
    return { error: error.message };
  }

  redirect('/onboarding/baseline');
}
