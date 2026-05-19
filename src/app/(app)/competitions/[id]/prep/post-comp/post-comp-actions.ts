'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { encryptField } from '@/lib/crypto';

function wordCount(s: string | null | undefined): number {
  if (!s) return 0;
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export async function savePostCompReflection(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const compId = formData.get('comp_id') as string;

  const whatWorked = (formData.get('what_worked') as string) || null;
  const whatBroke = (formData.get('what_broke') as string) || null;
  const whatSurprised = (formData.get('what_surprised') as string) || null;

  const drillPriority1 = (formData.get('drill_priority_1') as string) || null;
  const drillPriority2 = (formData.get('drill_priority_2') as string) || null;

  const injuryFlag = formData.get('injury_flag') === 'true';
  const fatigueLevel = (formData.get('fatigue_level') as string) || null;
  const mentalStatePre = (formData.get('mental_state_pre') as string) || null;
  const mentalStateDuring = (formData.get('mental_state_during') as string) || null;
  const nextCompPlanned = formData.get('next_comp_planned') === 'true';

  await supabase.from('comp_post_reflections').upsert(
    {
      athlete_id: user.id,
      comp_id: compId,
      what_worked_encrypted: encryptField(whatWorked),
      what_worked_word_count: wordCount(whatWorked),
      what_broke_encrypted: encryptField(whatBroke),
      what_broke_word_count: wordCount(whatBroke),
      what_surprised_encrypted: encryptField(whatSurprised),
      what_surprised_word_count: wordCount(whatSurprised),
      drill_priority_1: drillPriority1,
      drill_priority_2: drillPriority2,
      injury_flag: injuryFlag,
      fatigue_level: fatigueLevel,
      mental_state_pre: mentalStatePre,
      mental_state_during: mentalStateDuring,
      next_comp_planned: nextCompPlanned,
    },
    { onConflict: 'athlete_id,comp_id' }
  );

  redirect(`/competitions/${compId}/prep/post-comp`);
}
