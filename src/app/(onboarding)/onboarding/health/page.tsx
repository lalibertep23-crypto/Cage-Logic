// Onboarding Screen 8 of 9 — Health baseline.
// Three text fields are AES-256-GCM-encrypted before storage.
// Explicit consent required (per V1 hard rule on health data).

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { decryptField } from '@/lib/crypto';
import { HealthForm } from './health-form';

export const dynamic = 'force-dynamic';

export default async function HealthBaselinePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: existing } = await supabase
    .from('athlete_health_baseline')
    .select(
      'past_injuries_encrypted, current_injuries_encrypted, conditions_encrypted, pt_status'
    )
    .eq('athlete_id', user.id)
    .maybeSingle();

  let prefill = {
    pastInjuries: '',
    currentInjuries: '',
    conditions: '',
    ptStatus: 'none',
  };

  if (existing) {
    try {
      prefill = {
        pastInjuries:
          decryptField(
            typeof existing.past_injuries_encrypted === 'string'
              ? existing.past_injuries_encrypted
              : null
          ) ?? '',
        currentInjuries:
          decryptField(
            typeof existing.current_injuries_encrypted === 'string'
              ? existing.current_injuries_encrypted
              : null
          ) ?? '',
        conditions:
          decryptField(
            typeof existing.conditions_encrypted === 'string'
              ? existing.conditions_encrypted
              : null
          ) ?? '',
        ptStatus:
          typeof existing.pt_status === 'string' ? existing.pt_status : 'none',
      };
    } catch {
      // Decryption failed — likely the encryption key changed since last save.
      // Show a blank form rather than crashing.
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight">HEALTH BASELINE</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Step 8 of 9
          </p>
        </div>

        <HealthForm defaults={prefill} />
      </div>
    </main>
  );
}
