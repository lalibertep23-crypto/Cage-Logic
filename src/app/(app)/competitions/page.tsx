// Competitions hub — past + upcoming events for this athlete.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { parseISO, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const C = {
  bg:      '#050505',
  surface: '#111111',
  border:  'rgba(242,239,232,0.10)',
  text:    '#F2EFE8',
  dim:     'rgba(242,239,232,0.45)',
  dimmer:  'rgba(242,239,232,0.28)',
  amber:   '#C8943A',
  amberLow:'rgba(200,148,58,0.25)',
  green:   '#5C8A3C',
};

const RULE_LABELS: Record<string, string> = {
  gi: 'GI', no_gi: 'NO-GI', submission_only: 'SUB ONLY',
  mma: 'MMA', boxing: 'BOXING', muay_thai: 'MUAY THAI', other: 'OTHER',
};

function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

type Comp = {
  id:           string;
  name:         string;
  organization: string | null;
  comp_date:    string;
  weight_class: string | null;
  rule_set:     string | null;
};

export default async function CompetitionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: rows } = await supabase
    .from('competitions')
    .select('id, name, organization, comp_date, weight_class, rule_set')
    .eq('athlete_id', user.id)
    .order('comp_date', { ascending: false });

  const comps: Comp[] = (rows ?? []).map((r) => ({
    id:           r.id as string,
    name:         r.name as string,
    organization: (r.organization as string | null) ?? null,
    comp_date:    r.comp_date as string,
    weight_class: (r.weight_class as string | null) ?? null,
    rule_set:     (r.rule_set as string | null) ?? null,
  }));

  const today    = localDateString(new Date());
  const upcoming = comps.filter((c) => c.comp_date >= today).reverse();
  const past     = comps.filter((c) => c.comp_date < today);

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Hero — image + title merged ───────────────────────────── */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        {/* Image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/comp-prep_bright.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          filter: 'saturate(1.3) contrast(1.1)',
        }} />
        {/* Gradient — dark bottom + subtle left edge for text legibility */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(15,13,11,0.05) 0%, rgba(15,13,11,0.15) 40%, rgba(15,13,11,0.82) 75%, rgba(15,13,11,1) 100%), linear-gradient(to right, rgba(15,13,11,0.7) 0%, rgba(15,13,11,0) 55%)',
        }} />
        {/* Title overlaid — bottom-left anchor */}
        <div style={{
          position: 'absolute', bottom: 18, left: 22, right: 22,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 28, background: C.amber, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-anton)', fontSize: 28, letterSpacing: '0.08em', lineHeight: 1 }}>COMPETITIONS</div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: 'rgba(200,148,58,0.80)', marginTop: 3 }}>FIGHT RECORD</div>
            </div>
          </div>
          <Link href="/profile" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none', paddingBottom: 2 }}>← PROFILE</Link>
        </div>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* Add competition CTA */}
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.surface, borderLeft: `3px solid ${C.amberLow}`, padding: '14px 16px 14px 14px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.14em', color: C.text }}>NEW EVENT</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer, marginTop: 4 }}>PAST OR UPCOMING</div>
          </div>
          <Link href="/competitions/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 14px 6px',
            border: `1px solid ${C.amber}`,
            color: C.amber,
            fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.14em',
            textDecoration: 'none',
          }}>
            ADD →
          </Link>
        </div>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.2em', color: C.green }}>UPCOMING</span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>
            <CompList comps={upcoming} />
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>PAST</span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>
            <CompList comps={past} />
          </div>
        )}

        {comps.length === 0 && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', color: C.dimmer, marginTop: 24 }}>
            No competitions logged yet. Add one when you have one — past or upcoming.
          </p>
        )}

      </div>
    </main>
  );
}

function CompList({ comps }: { comps: Comp[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {comps.map((c, i) => {
        const meta: string[] = [];
        if (c.organization) meta.push(c.organization.toUpperCase());
        if (c.weight_class) meta.push(c.weight_class.toUpperCase());
        if (c.rule_set) meta.push(RULE_LABELS[c.rule_set] ?? c.rule_set.toUpperCase());
        return (
          <Link
            key={c.id}
            href={`/competitions/${c.id}`}
            style={{
              display: 'block', textDecoration: 'none', color: C.text,
              borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
              borderBottom: `1px solid ${C.border}`,
              padding: '14px 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.1em', color: C.text }}>{c.name.toUpperCase()}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer }}>
                  {format(parseISO(c.comp_date), 'MMM d, yyyy').toUpperCase()}
                </span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: C.amberLow }}>→</span>
              </div>
            </div>
            {meta.length > 0 && (
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em', color: C.dimmer }}>
                {meta.join(' · ')}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
