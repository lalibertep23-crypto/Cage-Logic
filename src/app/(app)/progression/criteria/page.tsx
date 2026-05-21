// Criteria page — shows promotion checklist for current → next rank.
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { IRON_ARMY_GYM_ID } from '@/lib/constants';
import { CriteriaClient } from './criteria-client';

export const dynamic = 'force-dynamic';

const C = {
  bg:     '#1A1713',
  border: 'rgba(245,240,232,0.13)',
  text:   '#F5F0E8',
  dimmer: 'rgba(245,240,232,0.35)',
  amber:  '#D4922E',
};

type CriteriaJson = {
  min_classes?: number;
  min_days?: number;
  must_show?: string[];
  coach_signoff?: boolean;
  notes?: string;
};

export default async function CriteriaPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const params = await searchParams;
  const fromRank = params.from ?? '';

  // Fetch criteria for this rank transition at Iron Army
  const { data: criteriaRows } = await supabase
    .from('promotion_criteria')
    .select('from_rank, to_rank, criteria_json')
    .eq('gym_id', IRON_ARMY_GYM_ID)
    .eq('discipline', 'bjj')
    .eq('from_rank', fromRank)
    .eq('is_default', true)
    .limit(1);

  const row = criteriaRows?.[0];
  const criteria = (row?.criteria_json ?? {}) as CriteriaJson;
  const toRank   = (row?.to_rank as string | null) ?? '';

  // Fallback: derive from_rank from athlete's own data if param missing
  const displayFrom = fromRank || 'current rank';

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 20, letterSpacing: '0.08em' }}>CRITERIA</span>
        </div>
        <Link href="/progression" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>← BELT</Link>
      </div>

      <div style={{ padding: '24px 22px 0' }}>

        {!row ? (
          <div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dimmer }}>
              No criteria defined for <strong style={{ color: C.text }}>{displayFrom}</strong> yet.
            </p>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dimmer, marginTop: 8 }}>
              Chris and Frankie are working on it. Check back after Iron Army confirms the requirements.
            </p>
          </div>
        ) : (
          <CriteriaClient
            fromRank={fromRank}
            toRank={toRank}
            criteria={criteria}
            gymName="Iron Army"
          />
        )}

        {/* Reference note */}
        <div style={{ marginTop: 32, padding: '12px 14px 10px', border: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em', color: C.dimmer, marginBottom: 5 }}>
            ABOUT THESE CRITERIA
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.02em', lineHeight: 1.7, color: C.dimmer, margin: 0 }}>
            Based on the Iron Army 90-day framework. Validated by Frankie Edgar May 2026.
            Chris Denardo reviews and refines specific criteria. Check-offs here are self-assessment only.
          </p>
        </div>

      </div>
    </main>
  );
}
