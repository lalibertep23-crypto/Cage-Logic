// Session edit — tap EDIT from session detail, change fields, save.

import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EditForm } from './edit-form';
import { BrandNav } from '@/components/ui/brand-nav';

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
        start_time:        (session.start_time as string) ?? null,
        duration_minutes:  (session.duration_minutes as number) ?? null,
        session_type:      (session.session_type as string) ?? null,
        instructor_name:   (session.instructor_name as string) ?? null,
        energy_1_10:       (session.energy_1_10 as number) ?? null,
        intensity_1_10:    (session.intensity_1_10 as number) ?? null,
        what_clicked:      (reflRows?.what_clicked as string) ?? null,
        what_didnt:        (reflRows?.what_didnt as string) ?? null,
        question_for_coach:(reflRows?.question_for_coach as string) ?? null,
      }}
      allTags={(allTagRows ?? []).map((t) => ({
        id:       t.id as string,
        label:    t.label as string,
        position: (t.position as string) ?? null,
      }))}
      selectedTagIds={(selectedTagRows ?? []).map((r) => r.technique_id as string)}
      rolls={(rollRows ?? []).map((r) => ({
        id:            r.id as string,
        round_number:  (r.round_number as number) ?? null,
        partner_label: (r.partner_label as string) ?? null,
        felt:          (r.felt as string) ?? null,
      }))}
    />
  );
}