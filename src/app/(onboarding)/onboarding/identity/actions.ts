'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { IRON_ARMY_GYM_ID } from '@/lib/constants';

const Schema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Required.')
    .max(60, 'Keep it under 60 characters.'),
});

export type IdentityState = {
  error?: string;
  fieldErrors?: { displayName?: string };
};

/**
 * Onboarding Step 3 — Identity.
 * Upserts the athlete row (id = auth user id, gym = Iron Army, display_name).
 * Upsert (not insert) so a mid-onboarding reload doesn't break.
 */
export async function saveIdentityAction(
  _prev: IdentityState,
  formData: FormData
): Promise<IdentityState> {
  const parsed = Schema.safeParse({
    displayName: formData.get('displayName'),
  });

  if (!parsed.success) {
    const fieldErrors: IdentityState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === 'displayName') {
        fieldErrors.displayName = issue.message;
      }
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

  const { error } = await supabase.from('athletes').upsert({
    id: user.id,
    display_name: parsed.data.displayName,
    gym_id: IRON_ARMY_GYM_ID,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/onboarding/combat');
}
