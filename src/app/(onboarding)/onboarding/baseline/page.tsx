// Onboarding Screen 6 of 9 — Physical baseline.
// UI in imperial (ft/in, lbs); DB stores metric.
// Updates the existing athletes row.

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BaselineForm } from './baseline-form';

export const dynamic = 'force-dynamic';

const LB_PER_KG = 2.2046226218;
const CM_PER_IN = 2.54;

function cmToFeetInches(cm: number): { ft: number; inches: number } {
  const totalInches = cm / CM_PER_IN;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - ft * 12);
  return { ft, inches };
}

function kgToLb(kg: number): number {
  return +(kg * LB_PER_KG).toFixed(1);
}

export default async function BaselinePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: athlete } = await supabase
    .from('athletes')
    .select(
      'sex, date_of_birth, height_cm, current_weight_kg, walking_weight_kg, dominant_side'
    )
    .eq('id', user.id)
    .maybeSingle();

  const heightCm = typeof athlete?.height_cm === 'number' ? athlete.height_cm : null;
  const heightDefaults =
    heightCm !== null ? cmToFeetInches(heightCm) : { ft: '' as const, inches: '' as const };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight">PHYSICAL BASELINE</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Step 6 of 9
          </p>
        </div>

        <BaselineForm
          defaults={{
            sex: typeof athlete?.sex === 'string' ? athlete.sex : 'prefer_not',
            dateOfBirth: typeof athlete?.date_of_birth === 'string' ? athlete.date_of_birth : '',
            heightFeet: heightDefaults.ft,
            heightInches: heightDefaults.inches,
            currentWeightLb:
              typeof athlete?.current_weight_kg === 'number'
                ? kgToLb(athlete.current_weight_kg)
                : '',
            walkingWeightLb:
              typeof athlete?.walking_weight_kg === 'number'
                ? kgToLb(athlete.walking_weight_kg)
                : '',
            dominantSide: typeof athlete?.dominant_side === 'string' ? athlete.dominant_side : 'right',
          }}
        />
      </div>
    </main>
  );
}
