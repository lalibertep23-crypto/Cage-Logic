'use client';

// ConsentForm — data licensing consent capture on final onboarding screen.
// Writes data_licensing_consent + data_consent_updated_at to athletes table.
// Consent is optional (default unchecked). Athlete can change in Settings.
// Voice: direct, dry, factual. No guilt. No pressure.

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export function ConsentForm({ athleteId }: { athleteId: string }) {
  const [consented, setConsented] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleContinue() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase
        .from('athletes')
        .update({
          data_licensing_consent: consented,
          data_consent_updated_at: new Date().toISOString(),
        })
        .eq('id', athleteId);

      router.push('/home');
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Consent block */}
      <div className="border border-white/10 rounded-lg p-4 flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Research — optional
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#C8943A]"
          />
          <span className="text-sm leading-relaxed text-muted-foreground">
            Help advance combat sports science. Your anonymized training data — never tied to your
            name — may be included in research studies and licensed datasets. You share in any
            revenue this generates. You can opt out anytime in Settings.
          </span>
        </label>
        <p className="text-xs text-muted-foreground/60 pl-7">
          Clinical instrument scores (BRS, mental assessments) are only included in research
          datasets at this consent tier. Your data is never sold individually. You own it.
        </p>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handleContinue}
        disabled={isPending}
      >
        {isPending ? 'Setting up...' : 'Continue'}
      </Button>
    </div>
  );
}
