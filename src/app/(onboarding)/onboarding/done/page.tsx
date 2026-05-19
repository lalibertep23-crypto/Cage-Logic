// Onboarding Screen 9 of 9 — Final.
// Voice: direct, dry, factual. No motivational. No emojis.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function OnboardingDonePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: athlete } = await supabase
    .from('athletes')
    .select('display_name')
    .eq('id', user.id)
    .maybeSingle();

  const name = typeof athlete?.display_name === 'string' ? athlete.display_name : null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-10 text-center">
        <div>
          <h1 className="text-5xl font-black tracking-tight">YOU&apos;RE IN.</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Step 9 of 9
          </p>
        </div>

        <div className="space-y-2">
          {name && (
            <p className="text-lg font-medium">{name}.</p>
          )}
          <p className="text-sm text-muted-foreground">
            Onboarding done. Log your first session when you next train. Your score starts ramping at session one and reveals after 30 days.
          </p>
        </div>

        <Button asChild size="lg" className="w-full">
          <Link href="/home">Continue</Link>
        </Button>
      </div>
    </main>
  );
}
