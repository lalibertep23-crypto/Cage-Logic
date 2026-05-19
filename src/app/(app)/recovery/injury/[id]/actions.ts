'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Mark an injury resolved. Sets resolved_on to today + stage to 'resolved'.
// Used by the Mark resolved button on the injury detail page.

function localDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function markInjuryResolvedAction(formData: FormData): Promise<void> {
  const injuryId = formData.get('injuryId')?.toString();
  if (!injuryId) {
    redirect('/recovery');
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  await supabase
    .from('injury_reports')
    .update({ resolved_on: localDateString(), stage: 'resolved' })
    .eq('id', injuryId as string)
    .eq('athlete_id', user.id);

  redirect('/recovery');
}
