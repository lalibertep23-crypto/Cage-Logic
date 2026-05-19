'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Tough-loss gate — creates a loss_events row based on feel:
//   Fine     → no DB write, return to /mental.
//   Stings   → loss_events.severity = 'tough', return to /mental.
//   Tough one → loss_events.severity = 'rough', open Phase 1.

const CONTEXTS = ['competition', 'rolling', 'other'] as const;
const FEELS = ['fine', 'stings', 'tough_one'] as const;

const Schema = z.object({
  context: z.enum(CONTEXTS),
  feel: z.enum(FEELS),
});

export type GateState = {
  error?: string;
  fieldErrors?: Partial<Record<'context' | 'feel', string>>;
};

export async function createLossEventAction(
  _prev: GateState,
  formData: FormData
): Promise<GateState> {
  const parsed = Schema.safeParse({
    context: formData.get('context'),
    feel: formData.get('feel'),
  });

  if (!parsed.success) {
    const fieldErrors: GateState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<GateState['fieldErrors']>;
      fieldErrors[k] = issue.message;
    }
    return { fieldErrors };
  }

  // Fine → acknowledge, no log, return.
  if (parsed.data.feel === 'fine') {
    redirect('/mental');
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) return { error: 'Not signed in.' };

  // Map feel → loss_events.severity ('tough' / 'rough' / 'crushing').
  const severity = parsed.data.feel === 'stings' ? 'tough' : 'rough';

  const { data: inserted, error } = await supabase
    .from('loss_events')
    .insert({
      athlete_id: user.id,
      context: parsed.data.context,
      severity,
    })
    .select('id')
    .single();

  if (error || !inserted) {
    return { error: error?.message ?? 'Failed to log event.' };
  }

  if (parsed.data.feel === 'tough_one') {
    redirect(`/mental/post-loss/${inserted.id as string}/phase-1`);
  }

  // Stings — logged, no protocol.
  redirect('/mental');
}
