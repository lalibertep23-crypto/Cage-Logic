'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function deleteSessionAction(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return { error: 'Not signed in.' };

  const { error } = await supabase
    .from('training_sessions')
    .delete()
    .eq('id', id)
    .eq('athlete_id', user.id);

  if (error) return { error: error.message };

  redirect('/history');
}
