'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// Manual self-log of a promotion. V1: athlete logs their own.
// Coach-verified promotions are V1.5+.
// Writes a progression_events row AND syncs the matching athlete_disciplines
// row so /profile reflects current rank.

const EVENT_TYPES = ['stripe', 'belt', 'rank_other'] as const;

const Schema = z
  .object({
    disciplineId: z.string().uuid(),
    eventType: z.enum(EVENT_TYPES),
    awardedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date.'),
    stripeCount: z.coerce.number().int().min(1).max(4).optional(),
    beltRank: z.string().trim().min(1).max(50).optional(),
    otherRank: z.string().trim().min(1).max(100).optional(),
    notes: z
      .string()
      .trim()
      .max(1000, 'Keep it under 1000 characters.')
      .optional()
      .or(z.literal('').transform(() => undefined)),
  })
  .refine(
    (d) =>
      (d.eventType === 'stripe' && d.stripeCount != null) ||
      (d.eventType === 'belt' && d.beltRank && d.beltRank.length > 0) ||
      (d.eventType === 'rank_other' && d.otherRank && d.otherRank.length > 0),
    { message: 'Pick the rank that matches the event type.' }
  );

export type PromotionState = {
  error?: string;
  fieldErrors?: Partial<
    Record<
      | 'disciplineId'
      | 'eventType'
      | 'awardedOn'
      | 'stripeCount'
      | 'beltRank'
      | 'otherRank'
      | 'notes',
      string
    >
  >;
};

function emptyToUndefined(v: FormDataEntryValue | null): string | undefined {
  const s = v?.toString().trim();
  return s && s.length > 0 ? s : undefined;
}

export async function logPromotionAction(
  _prev: PromotionState,
  formData: FormData
): Promise<PromotionState> {
  const parsed = Schema.safeParse({
    disciplineId: formData.get('disciplineId'),
    eventType: formData.get('eventType'),
    awardedOn: formData.get('awardedOn'),
    stripeCount: emptyToUndefined(formData.get('stripeCount')),
    beltRank: emptyToUndefined(formData.get('beltRank')),
    otherRank: emptyToUndefined(formData.get('otherRank')),
    notes: emptyToUndefined(formData.get('notes')),
  });

  if (!parsed.success) {
    const fieldErrors: PromotionState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<PromotionState['fieldErrors']>;
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

  // Verify the discipline belongs to this athlete + grab discipline name + gym_id.
  const { data: disc } = await supabase
    .from('athlete_disciplines')
    .select('id, discipline')
    .eq('id', parsed.data.disciplineId)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!disc) return { error: 'Discipline not found for this athlete.' };

  const { data: athleteRow } = await supabase
    .from('athletes')
    .select('gym_id')
    .eq('id', user.id)
    .maybeSingle();
  const gym_id = (athleteRow?.gym_id as string | null) ?? null;

  // Compute to_rank text + discipline-row patch based on event type.
  let toRank: string;
  let disciplinePatch: Record<string, unknown>;
  if (parsed.data.eventType === 'stripe') {
    const n = parsed.data.stripeCount!;
    toRank = `${n} stripe${n === 1 ? '' : 's'}`;
    disciplinePatch = { stripes: n };
  } else if (parsed.data.eventType === 'belt') {
    toRank = parsed.data.beltRank!;
    disciplinePatch = { rank_color: toRank, stripes: 0 };
  } else {
    toRank = parsed.data.otherRank!;
    disciplinePatch = { rank: toRank };
  }

  // Insert progression_events.
  const { error: evErr } = await supabase.from('progression_events').insert({
    athlete_id: user.id,
    gym_id,
    discipline: disc.discipline as string,
    event_type: parsed.data.eventType,
    to_rank: toRank,
    awarded_at: new Date(parsed.data.awardedOn + 'T12:00:00Z').toISOString(),
    notes: parsed.data.notes ?? null,
  });
  if (evErr) return { error: evErr.message };

  // Update athlete_disciplines so /profile reflects current rank.
  const { error: discErr } = await supabase
    .from('athlete_disciplines')
    .update(disciplinePatch)
    .eq('id', parsed.data.disciplineId)
    .eq('athlete_id', user.id);
  if (discErr) {
    return { error: `Promotion saved but discipline didn't sync: ${discErr.mes