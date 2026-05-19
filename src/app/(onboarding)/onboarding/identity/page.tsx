// Onboarding Screen 3 of 9 — Identity.
// V1: display name only. Photo upload deferred to V1.5 (requires Supabase
// Storage bucket setup; not on the critical path for the daily-flow validation
// V1 exists to prove).

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { IdentityForm } from './identity-form';

export const dynamic = 'force-dynamic';

export default async function IdentityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Resume support: prefill if the athlete row already exists.
  const { data: athlete } = await supabase
    .from('athletes')
    .select('display_name')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight">WHO ARE YOU</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Step 3 of 9
          </p>
        </div>

        <IdentityForm
          defaultName={
            typeof athlete?.display_name === 'string' ? athlete.display_name : undefined
          }
        />
      </div>
    </main>
  );
}
