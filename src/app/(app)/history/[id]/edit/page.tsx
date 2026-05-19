// Session edit — tap EDIT from session detail, change fields, save.

import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EditForm } from './edit-form';

export const dynamic = 'force-dynamic';

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: session } = await supabase
    .from('training_sessions')
    .select('id, session_date, start_time, duration_minutes, session_type, energy_1_10, intensity_1_10')
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();

  if (!session) notFound();

  const { data: reflRows } = await supabase
    .from('session_reflections')
    .select('what_clicked, what_didnt, question_for_coach')
    .eq('session_id', id)
    .maybeSingle();

  return (
    <EditForm
      id={id}
      session={{
        session_date:     session.session_date as string,
        start_time:       (session.start_time as string | null) ?? '',
        session_type:     (session.session_type as string | null) ?? 'gi',
        duration_minutes: (session.duration_minutes as number | null) ?? 60,
        energy_1_10:      (session.energy_1_10 as number | null) ?? 5,
        intensity_1_10:   (session.intensity_1_10 as number | null) ?? 5,
      }}
      reflection={{
        what_clicked:       (reflRows?.what_clicked as string | null) ?? '',
        what_didnt:         (reflRows?.what_didnt as string | null) ?? '',
        question_for_coach: (reflRows?.question_for_coach as string | null) ?? '',
      }}
    />
  );
}
