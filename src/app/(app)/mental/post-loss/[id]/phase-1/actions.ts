'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { encryptField } from '@/lib/crypto';

// Phase 1 — acute post-loss reflection.
// 5 free-text questions. Encrypted before insert. Word count computed for "did they write?"
// but not yet persisted (schema doesn't have word_count column on loss_phase_1_responses —
// follow-up migration to add it. Principle is recorded in §3 of the reconciled-state doc).
// Phase 2 (24–72hr integration) is V1.5+, not built here.

const text = z
  .string()
  .trim()
  .max(2000, 'Keep it under 2000 characters.')
  .optional()
  .or(z.literal('').transform(() => undefined));

const Schema = z.object({
  eventId: z.string().uuid(),
  event: text,
  body: text,
  head: text,
  wins: text,
  next24: text,
});

export type Phase1State = {
  error?: string;
  fieldErrors?: Partial<
    Record<'event' | 'body' | 'head' | 'wins' | 'next24', string>
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

export async function submitPhase1Action(
  _prev: Phase1State,
  formData: FormData
): Promise<Phase1State> {
  const parsed = Schema.safeParse({
    eventId: formData.get('eventId'),
    event: emptyToUndefined(formData.get('event')),
    body: emptyToUndefined(formData.get('body')),
    head: emptyToUndefined(formData.get('head')),
    wins: emptyToUndefined(formData.get('wins')),
    next24: emptyToUndefined(formData.get('next24')),
  });

  if (!parsed.success) {
    const fieldErrors: Phase1State['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const path0 = issue.path[0];
      if (path0 === 'eventId') {
        return { error: 'Bad request — missing event id.' };
      }
      const k = path0 as keyof NonNullable<Phase1State['fieldErrors']>;
      fieldErrors[k] = issue.message;
    }
    return { fieldErrors };
  }

  const { eventId, event, body, head, wins, next24 } = parsed.data;

  const totalWords =
    wordCount(event) +
    wordCount(body) +
    wordCount(head) +
    wordCount(wins) +
    wordCount(next24);

  if (totalWords === 0) {
    return { error: 'Answer at least one question.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) return { error: 'Not signed in.' };

  // Ownership check on the event.
  const { data: ev } = await supabase
    .from('loss_events')
    .select('id')
    .eq('id', eventId)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!ev) return { error: 'Event not found.' };

  // Encrypt raw responses.
  let encrypted: string | null;
  try {
    encrypted = encryptField(
      JSON.stringify({ event, body, head, wins, next24 })
    );
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Encryption failed.' };
  }

  // rebound_index stays null in V1 — Cage-Logic-original composite, computed later.
  const { error } = await supabase.from('loss_phase_1_responses').insert({
    loss_event_id: eventId,
    athlete_id: user.id,
    raw_responses_encrypted: encrypted,
  });

  if (error) return { error: error.message };

  redirect(`/mental/post-loss/${eventId}`);
}
