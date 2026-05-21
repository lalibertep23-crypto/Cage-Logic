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
    .select('id, session_date, start_time, duration_minutes, session_type, instructor_name, energy_1_10, intensity_1_10')
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();

  if (!session) notFound();

  const { data: reflRows } = await supabase
    .from('session_reflections')
    .select('what_clicked, what_didnt, question_for_coach')
    .eq('session_id', id)
    .maybeSingle();

  // Load all available technique tags
  const { data: allTagRows } = await supabase
    .from('technique_tags')
    .select('id, label, position')
    .order('position', { ascending: true })
    .order('label', { ascending: true });

  // Load currently selected technique IDs for this session
  const { data: selectedTagRows } = await supabase
    .from('session_techniques')
    .select('technique_id')
    .eq('session_id', id);

  // Load rolls for this session
  const { data: rollRows } = await supabase
    .from('roll_logs')
    .select('id, round_number, partner_label, felt')
    .eq('session_id', id)
    .order('round_number', { ascending: true, nullsFirst: false });

  return (
    <EditForm
      id={id}
      session={{
        session_date:      session.session_date as string,
        start_time:        (session.start_time as 