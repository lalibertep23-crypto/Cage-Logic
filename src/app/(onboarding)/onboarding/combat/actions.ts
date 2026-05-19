'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const DISCIPLINES = ['bjj', 'mma', 'boxing', 'muay_thai', 'wrestling'] as const;
const BELT_COLORS = ['white', 'blue', 'purple', 'brown', 'black'] as const;

const Schema = z.object({
  discipline: z.enum(DISCIPLINES),
  rankColor: z.enum(BELT_COLORS),
  stripes: z.coerce.number().int().min(0).max(4),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a valid date.')
    .optional(),
});

export type CombatState = {
  error?: string;
  fieldErrors?: Partial<
    Record<'discipline' | 'rankColor' | 'stripes' | 'startDate', string>
  >;
};

/**
 * Onboarding Step 4 — Combat background.
 * Upserts the athlete's primary discipline row.
 */
export async function saveCombatAction(
  _prev: CombatState,
  formData: FormData
): Promise<CombatState> {
  const rawStart = formData.get('startDate')?.toString();
  const parsed = Schema.safeParse({
    discipline: formData.get('discipline'),
    rankColor: formData.get('rankColor'),
    stripes: formData.get('stripes'),
    startDate: rawStart && rawStart.length > 0 ? rawStart : undefined,
  });

  if (!parsed.success) {
    const fieldErrors: CombatState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<CombatState['fieldErrors']>;
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

  const stripeWord = parsed.data.stripes === 1 ? 'stripe' : 'stripes';
  const rankLabel =
    parsed.data.stripes > 0
      ? `${parsed.data.rankColor} belt ${parsed.data.stripes} ${stripeWord}`
      : `${parsed.data.rankColor} belt`;

  const { data: existing } = await supabase
    .from('athlete_disciplines')
    .select('id')
    .eq('athlete_id', user.id)
    .eq('is_primary', true)
    .maybeSingle();

  const payload = {
    athlete_id: user.id,
    discipline: parsed.data.discipline,
    rank: rankLabel,
    rank_color: parsed.data.rankColor,
    stripes: parsed.data.stripes,
    start_date: parsed.data.startDate ?? null,
    is_primary: true,
  };

  const { error } = existing
    ? await supabase
        .from('athlete_disciplines')
        .update(payload)
        .eq('id', existing.id as string)
    : await supabase.from('athlete_disciplines').insert(payload);

  if (error) {
    return { error: error.message };
  }

  redirect('/onboarding/goals');
}
