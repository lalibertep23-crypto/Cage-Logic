// Onboarding Screen 7 of 9 — Day job category + physical hours/day.
// Day-job load is a first-class factor in future recovery/training calculations.

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DayjobForm } from './dayjob-form';

export const dynamic = 'force-dynamic';

export default async function DayjobPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: athlete } = await supabase
    .from('athletes')
    .select('day_job_category, day_job_hours_physical_per_day')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight">YOUR DAY JOB</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Step 7 of 9
          </p>
        </div>

        <DayjobForm
          defaults={{
            dayJobCategory:
              typeof athlete?.day_job_category === 'string'
                ? athlete.day_job_category
                : 'moderate',
            hoursPhysicalPerDay:
              typeof athlete?.day_job_hours_physical_per_day === 'number'
                ? athlete.day_job_hours_physical_per_day
                : '',
          }}
        />
      </div>
    </main>
  );
}
