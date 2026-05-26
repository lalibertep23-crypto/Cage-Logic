'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function updateConsentAction(consent: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('athletes')
    .update({
      data_licensing_consent: consent,
      data_consent_updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);
}
