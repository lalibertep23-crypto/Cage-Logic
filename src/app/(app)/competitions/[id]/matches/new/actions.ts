'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const RESULTS = ['win', 'loss', 'draw', 'dq', 'no_contest'] as const;
const METHODS = ['submission', 'points', 'advantage', 'decision', 'ko_tko', 'dq', 'time', 'other'] as const;

const Schema = z.object({
  competitionId: z.string().uuid(),
  roundLabel: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  opponentLabel: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  result: z.enum(RESULTS),
  method: z.enum(METHODS).optional().or(z.literal('').transform(() => undefined)),
  durationMin: z.coerce.number().int().min(0).max(120).optional(),
  durationSec: z.coerce.number().int().min(0).max(59).optional(),
  notes: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export type MatchState = {
  error?: string;
  fieldErrors?: Partial<
    Record<
      | 'roundLabel'
      | 'opponentLabel'
      | 'result'
      | 'method'
      | 'durationMin'
      | 'durationSec'
      | 'notes',
      string
    >
  >;
};

function emptyToUndefined(v: FormDataEntryValue | null): string | undefined {
  const s = v?.toString().trim();
  return s && s.length > 0 ? s : undefined;
}

export async function addMatchAction(
  _prev: MatchState,
  formData: FormData
): Promise<MatchState> {
  const parsed = Schema.safeParse({
    competitionId: formData.get('competitionId'),
    roundLabel: emptyToUndefined(formData.get('roundLabel')),
    opponentLabel: emptyToUndefined(formData.get('opponentLabel')),
    result: formData.get('result'),
    method: emptyToUndefined(formData.get('method')),
    durationMin: emptyToUndefined(formData.get('durationMin')),
    durationSec: emptyToUndefined(formData.get('durationSec')),
    notes: emptyToUndefined(formData.get('notes')),
  });

  if (!parsed.success) {
    const fieldErrors: MatchState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const path0 = issue.path[0];
      if (path0 === 'competitionId') {
        return { error: 'Bad request — missing competition id.' };
      }
      const k = path0 as keyof NonNullable<MatchState['fieldErrors']>;
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

  // Ownership check on the competition.
  const { data: comp } = await supabase
    .from('competitions')
    .select('id')
    .eq('id', parsed.data.competitionId)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!comp) return { error: 'Competition not found.' };

  // Compute duration in seconds if any duration values provided.
  const minVal = parsed.data.durationMin ?? null;
  const secVal = parsed.data.durationSec ?? null;
  const durationSeconds =
    minVal != null || secVal != null
      ? (minVal ?? 0) * 60 + (secVal ?? 0)
      : null;

  const { error } = await supabase.from('competition_matches').insert({
    competition_id: parsed.data.competitionId,
    athlete_id: user.id,
    round_label: parsed.data.roundLabel ?? null,
    opponent_label: parsed.data.opponentLabel ?? null,
    result: parsed.data.result,
    method: parsed.data.method ?? null,
    duration_seconds: durationSeconds,
    notes: parsed.data.notes ?? null,
  });

  if (error) return { error: error.message };

  redirect(`/competitions/${parsed.data.competitionId}`);
}
