'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const RULE_SETS = ['gi', 'no_gi', 'submission_only', 'mma', 'boxing', 'muay_thai', 'other'] as const;

const Schema = z.object({
  name: z.string().trim().min(1, 'Name the event.').max(200),
  organization: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  compDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date.'),
  weightClass: z
    .string()
    .trim()
    .max(50)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  ruleSet: z.enum(RULE_SETS).optional().or(z.literal('').transform(() => undefined)),
});

export type CompetitionState = {
  error?: string;
  fieldErrors?: Partial<
    Record<'name' | 'organization' | 'compDate' | 'weightClass' | 'ruleSet', string>
  >;
};

function emptyToUndefined(v: FormDataEntryValue | null): string | undefined {
  const s = v?.toString().trim();
  return s && s.length > 0 ? s : undefined;
}

export async function createCompetitionAction(
  _prev: CompetitionState,
  formData: FormData
): Promise<CompetitionState> {
  const parsed = Schema.safeParse({
    name: formData.get('name'),
    organization: emptyToUndefined(formData.get('organization')),
    compDate: formData.get('compDate'),
    weightClass: emptyToUndefined(formData.get('weightClass')),
    ruleSet: emptyToUndefined(formData.get('ruleSet')),
  });

  if (!parsed.success) {
    const fieldErrors: CompetitionState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<CompetitionState['fieldErrors']>;
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

  const { data: inserted, error } = await supabase
    .from('competitions')
    .insert({
      athlete_id: user.id,
      name: parsed.data.name,
      organization: parsed.data.organization ?? null,
      comp_date: parsed.data.compDate,
      weight_class: parsed.data.weightClass ?? null,
      rule_set: parsed.data.ruleSet ?? null,
    })
    .select('id')
    .single();

  if (error || !inserted) {
    return { error: error?.message ?? 'Failed to save competition.' };
  }

  redirect(`/competitions/${inserted.id as string}`);
}
