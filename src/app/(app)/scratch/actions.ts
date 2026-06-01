'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type ScratchState = { error?: string; ok?: boolean };

export async function saveScratchPadAction(
  _prev: ScratchState,
  formData: FormData
): Promise<ScratchState> {
  const content = (formData.get('content') as string) ?? '';

  const supabase = await createClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return { error: 'Not signed in.' };

  const { error } = await supabase
    .from('athletes')
    .update({ scratch_pad: content || null })
    .eq('id', user.id);

  if (error) return { error: error.message };
  return { ok: true };
}

export async function clearScratchPadAction(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('athletes').update({ scratch_pad: null }).eq('id', user.id);
  redirect('/scratch');
}
