// Onboarding Screen 4 of 9 — Combat background.
// Captures primary discipline, belt color, stripes, and approximate start date.
// Writes to athlete_disciplines (is_primary = true).

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CombatForm } from './combat-form';

export const dynamic = 'force-dynamic';

export default async function CombatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: existing } = await supabase
    .from('athlete_disciplines')
    .select('discipline, rank_color, stripes, start_date')
    .eq('athlete_id', user.id)
    .eq('is_primary', true)
    .maybeSingle();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight">YOUR BACKGROUND</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Step 4 of 9
          </p>
        </div>

        <CombatForm
          defaults={{
            discipline: (typeof existing?.discipline === 'string' ? existing.discipline : 'bjj'),
            rankColor: (typeof existing?.rank_color === 'string' ? existing.rank_color : 'white'),
            stripes: (typeof existing?.stripes === 'number' ? existing.stripes : 0),
            startDate: (typeof existing?.start_date === 'string' ? existing.start_date : ''),
          }}
        />
      </div>
    </main>
  );
}
