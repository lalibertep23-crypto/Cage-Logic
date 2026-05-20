'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const Schema = z.object({
  weekly_lifting_days: z.coerce.number().int().min(0).max(7),
  lifting_intensity: z.enum(['heavy', 'moderate', 'light', 'none']),
});

export type ActivityProfileState = {
  error?: string;
  success?: boolean;
};

export async function saveActivityProfileAction(
  _prev: ActivityProfileState,
  formData: FormData
): Promise<ActivityProfileState> {
  const parsed = Schema.safeParse({
    weekly_lifting_days: formData.get('weekly_lifting_days'),
    lifting_intensity: formData.get('lifting_intensity'),
  });

  if (!parsed.success) {
    return { error: 'Check your inputs.' };
  }

  const supabase = await createClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return { error: 'Not signed in.' };

  const { error } = await supabase
    .from('athletes')
    .update({
      weekly_lifting_days: parsed.data.weekly_lifting_days,
      lifting_intensity: parsed.data.lifting_intensity,
    })
    .eq('id', user.id);

  if (error) return { error: 'Save failed.' };

  return { success: true };
}
