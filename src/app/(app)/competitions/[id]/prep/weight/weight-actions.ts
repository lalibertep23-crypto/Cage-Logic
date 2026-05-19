'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function logWeight(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const compId = formData.get('comp_id') as string;
  const weightRaw = formData.get('weight_lbs') as string;
  const weightLbs = parseFloat(weightRaw);

  if (!compId || isNaN(weightLbs) || weightLbs <= 0) return;

  const { error } = await supabase.from('comp_weight_logs').upsert(
    {
      athlete_id: user.id,
      comp_id: compId,
      logged_date: new Date().toISOString().split('T')[0],
      weight_lbs: weightLbs,
    },
    { onConflict: 'athlete_id,comp_id,logged_date' }
  );

  if (error) {
    console.error('[logWeight] Supabase error:', error.message, error.code);
    throw new Error(error.message);
  }

  revalidatePath(`/competitions/${compId}/prep/weight`);
}

export async function saveWeighInDetails(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const compId = formData.get('comp_id') as string;
  const targetWeight = formData.get('target_weight_lbs') as string;
  const weighInType = formData.get('weigh_in_type') as string | null;

  if (!compId) return;

  const { error } = await supabase
    .from('competitions')
    .update({
      target_weight_lbs: targetWeight ? parseFloat(targetWeight) : null,
      weigh_in_type: weighInType || null,
    })
    .eq('id', compId)
    .eq('athlete_id', user.id);

  if (error) {
    console.error('[saveWeighInDetails] Supabase error:', error.message, error.code);
    throw new Error(error.message);
  }

  revalidatePath(`/competitions/${compId}/prep/weight`);
}
