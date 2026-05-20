// Day-of Timeline detail — reverse-engineered schedule from weigh-in or first match time.
// Bracket releases Thursday before the event — first match time entered manually.
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TimesForm } from './times-form';
import { DayOfTimeline } from './timeline';

export const dynamic = 'force-dynamic';

export default async function DayOfPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: comp } = await supabase
    .from('competitions')
    .select('id, name, comp_date, weigh_in_time, first_match_time')
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!comp) notFound();

  const compName = comp.name as string;
  const weighInTime = (comp.weigh_in_time as string | null) ?? null;
  const firstMatchTime = (comp.first_match_time as string | null) ?? null;

  const hasAnyTime = !!(weighInTime || firstMatchTime);

  const C = {
    bg:      '#1A1713',
    surface: '#252118',
    border:  'rgba(245,240,232,0.5)',
    text:    '#F5F0E8',
    dim:     'rgba(245,240,232,0.38)',
    dimmer:  'rgba(245,240,232,0.22)',
    amber:   '#D4922E',
    amberLow:'rgba(201,130,42,0.35)',
  };

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>DAY-OF</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginTop: 2 }}>
              {compName.toUpperCase()}
            </div>
          </div>
        </div>
        <Link href={`/competitions/${id}`} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          ← BACK
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* Time entry */}
        <div style={{ marginTop: 24, background: C.surface, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.dimmer, marginBottom: 6 }}>
            SET TIMES
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 12px' }}>
            Enter what you know. The timeline updates automatically. Add first match time when the bracket drops Thursday.
          </p>
          <TimesForm compId={id} weighInTime={weighInTime} firstMatchTime={firstMatchTime} />
        </div>

        {/* Computed timeline */}
        {hasAnyTime ? (
          <div style={{ marginTop: 16 }}>
            <DayOfTimeline weighInTime={weighInTime} firstMatchTime={firstMatchTime} />
          </div>
        ) : (
          <div style={{ marginTop: 16, background: C.surface, padding: '14px 14px' }}>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', color: C.dimmer }}>
              No times set yet. Enter weigh-in or first match time above to generate the timeline.
            </p>
          </div>
        )}

        {/* Breathwork cue */}
        <div style={{ marginTop: 16, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 10 }}>
            PRE-MATCH BREATH PROTOCOL
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Nasal breathe. 4 in, 6 out. Slow and deliberate.',
              'CAP clench: jaw set, hands closed. Activate 5 seconds before first engage.',
              "Between matches: reset with slow exhale. Don't chase the heart rate down — let it fall.",
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.amber }}>·</span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>{item}</span>
              </div>
            ))}
          </div>
          <Link
            href="/breathwork"
            style={{ display: 'inline-block', marginTop: 12, fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.16em', color: C.amber, textDecoration: 'none' }}
          >
            FULL BREATHWORK PROTOCOL →
          </Link>
        </div>

      </div>
    </main>
  );
}
