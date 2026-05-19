'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { encryptField } from '@/lib/crypto';

// Phase 2 — integration reflection. 24-72hr post-loss.
// 4 free-text fields encrypted. One short plaintext "one thing to drill"
// stored in its own column for surfacing later (it's a coaching cue, not journal).

const text = z
  .string()
  .trim()
  .max(2000, 'Keep it under 2000 characters.')
  .optional()
  .or(z.literal('').transform(() => undefined));

const Schema = z.object({
  eventId: z.string().uuid(),
  whatChanged: text,
  patternSeen: text,
  whatWasMine: text,
  oneThingToDrill: z
    .string()
    .trim()
    .max(200, 'Keep it short — one drillable thing.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export type Phase2State = {
  error?: string;
  fieldErrors?: Partial<
    Record<'whatChanged' | 'patternSeen' | 'whatWasMine' | 'oneThingToDrill', string>
  >;
};

function emptyToUndefined(v: FormDataEntryValue | null): string | undefined {
  const s = v?.toString().trim();
  return s && s.length > 0 ? s : undefined;
}

function wordCount(s: string | undefined): number {
  if (!s) return 0;
  return s.split(/\s+/).filter(Boolean).length;
}

export async function submitPhase2Action(
  _prev: Phase2State,
  formData: FormData
): Promise<Phase2State> {
  const parsed = Schema.safeParse({
    eventId: formData.get('eventId'),
    whatChanged: emptyToUndefined(formData.get('whatChanged')),
    patternSeen: emptyToUndefined(formData.get('patternSeen')),
    whatWasMine: emptyToUndefined(formData.get('whatWasMine')),
    oneThingToDrill: emptyToUndefined(formData.get('oneThingToDrill')),
  });

  if (!parsed.success) {
    const fieldErrors: Phase2State['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const path0 = issue.path[0];
      if (path0 === 'eventId') {
        return { error: 'Bad request — missing event id.' };
      }
      const k = path0 as keyof NonNullable<Phase2State['fieldErrors']>;
      fieldErrors[k] = issue.message;
    }
    return { fieldErrors };
  }

  const { eventId, whatChanged, patternSeen, whatWasMine, oneThingToDrill } =
    parsed.data;

  const totalWords =
    wordCount(whatChanged) +
    wordCount(patternSeen) +
    wordCount(whatWasMine) +
    wordCount(oneThingToDrill);

  if (totalWords === 0) {
    return { error: 'Answer at least one question.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) return { error: 'Not signed in.' };

  // Verify event ownership + that Phase 1 exists and is at least ~24hr old.
  const { data: phase1 } = await supabase
    .from('loss_phase_1_responses')
    .select('id, taken_at')
    .eq('loss_event_id', eventId)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!phase1) {
    return { error: 'Phase 1 must be completed first.' };
  }
  const phase1Time = new Date(phase1.taken_at as string).getTime();
  const hoursSince = (Date.now() - phase1Time) / (1000 * 60 * 60);
  if (hoursSince < 24) {
    return { error: `Phase 2 unlocks 24 hours after Phase 1. ${Math.ceil(24 - hoursSince)}h to go.` };
  }

  // Encrypt the 3 free-text fields together as a single JSON blob.
  let encrypted: string | null;
  try {
    encrypted = encryptField(
      JSON.stringify({ whatChanged, patternSeen, whatWasMine })
    );
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Encryption failed.' };
  }

  // one_thing_to_drill stays plaintext — it's a coaching cue meant to be
  // surfaced (e.g., as a session-log prompt or drill suggestion later).
  const { error } = await supabase.from('loss_phase_2_reflections').insert({
    loss_event_id: eventId,
    athlete_id: user.id,
    raw_responses_encrypted: encrypted,
    one_thing_to_drill: oneThingToDrill ?? null,
  });

  if (error) return { error: error.message };

  redirect(`/mental/post-loss/${eventId}`);
}
