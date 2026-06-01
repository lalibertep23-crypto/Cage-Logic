// Onboarding Screen 5 of 9 — Goals.
// Captures why_training, comp_status, belt_goal.
// Writes to athlete_goals.

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { GoalsForm } from './goals-form';

export const dynamic = 'force-dynamic';

export default async function GoalsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const [goalsRes, athleteRes] = await Promise.all([
    supabase
      .from('athlete_goals')
      .select('why_training, comp_status, belt_goal')
      .eq('athlete_id', user.id)
      .maybeSingle(),
    supabase
      .from('athletes')
      .select('training_frequency_per_week')
      .eq('id', user.id)
      .maybeSingle(),
  ]);
  const existing = goalsRes.data;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight">YOUR GOALS</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Step 5 of 9
          </p>
        </div>

        <GoalsForm
          defaults={{
            trainingFrequency: typeof athleteRes.data?.training_frequency_per_week === 'number' ? athleteRes.data.training_frequency_per_week : '',
            whyTraining: typeof existing?.why_training === 'string' ? existing.why_training : '',
            compStatus: typeof existing?.comp_status === 'string' ? existing.comp_status : 'occasional',
            beltGoal: typeof existing?.belt_goal === 'string' ? existing.belt_goal : '',
          }}
        />
      </div>
    </main>
  );
}
