'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function saveDayOfTimes(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const compId = formData.get('comp_id') as string;
  const weighInTime = (formData.get('weigh_in_time') as string) || null;
  const firstMatchTime = (formData.get('first_match_time') as string) || null;

  if (!compId) return;

  await supabase
    .from('competitions')
    .update({
      weigh_in_time: weighInTime,
      first_match_time: firstMatchTime,
    })
    .eq('id', compId)
    .eq('athlete_id', user.id);

  redirect(`/competitions/${compId}/prep/day-of`);
}
