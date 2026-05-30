// Settings hub.
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signOutAction } from './actions';
import { ConsentToggle } from './consent-toggle';
import { BrandNav } from '@/components/ui/brand-nav';

export const dynamic = 'force-dynamic';

const C = {
  bg:      '#050505',
  surface: '#111111',
  border:  'rgba(242,239,232,0.13)',
  borderMid:'rgba(242,239,232,0.14)',
  text:    '#F2EFE8',
  dim:     'rgba(242,239,232,0.55)',
  dimmer:  'rgba(242,239,232,0.35)',
  amber:   '#C8943A',
  amberLow:'rgba(201,130,42,0.35)',
  brick:   '#8B3A1E',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const email = user.email ?? '—';

  const { data: athlete } = await supabase
    .from('athletes')
    .select('data_licensing_consent')
    .eq('id', user.id)
    .maybeSingle();

  const dataConsent = athlete?.data_licensing_consent ?? false;

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>
      <BrandNav backHref="/profile" />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: 22, letterSpacing: '0.08em' }}>
            SETTINGS
          </span>
        </div>
        <Link href="/profile" style={{ fontFamily: 'var(--font-dm-mono), "DM Mono", monospace', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          PROFILE →
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* Account */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>ACCOUNT</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <div style={{ background: C.surface, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontFamily: 'var(--font-dm-mono), "DM Mono", monospace', fontSize: 11, letterSpacing: '0.04em', color: C.dim, margin: 0 }}>{email}</p>
            <form action={signOutAction}>
              <button
                type="submit"
                style={{
                  background: 'transparent',
                  border: `1px solid ${C.borderMid}`,
                  color: C.dim,
                  padding: '8px 16px 6px',
                  fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                  fontSize: 13,
                  letterSpacing: '0.16em',
                  cursor: 'pointer',
                }}
              >
                SIGN OUT
              </button>
            </form>
          </div>
        </div>

        {/* Mental health resources */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>MENTAL HEALTH</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <div style={{ background: C.surface, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontFamily: 'var(--font-dm-mono), "DM Mono", monospace', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
              Crisis lines and sport-psychology support. Always available.
            </p>
            <Link href="/resources" style={{
              display: 'inline-block',
              fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif', fontSize: 13, letterSpacing: '0.16em',
              color: C.amber, textDecoration: 'none',
            }}>
              OPEN RESOURCES →
            </Link>
          </div>
        </div>

        {/* Data */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>YOUR DATA</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <div style={{ background: C.surface, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontFamily: 'var(--font-dm-mono), "DM Mono", monospace', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
              Download your training data as JSON. Sessions, reflections, rolls, soreness, disciplines, basic profile.
            </p>
            <p style={{ fontFamily: 'var(--font-dm-mono), "DM Mono", monospace', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dimmer, margin: 0 }}>
              Encrypted tables (psych check-ins, injury notes, post-loss reflections) excluded from V1 export — full export ships V1.5.
            </p>
            <a
              href="/api/export"
              download
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif', fontSize: 13, letterSpacing: '0.16em',
                color: C.amber, textDecoration: 'none',
              }}
            >
              EXPORT MY DATA →
            </a>
          </div>
        </div>

        {/* Research data consent */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>RESEARCH DATA</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <ConsentToggle initialConsent={dataConsent} />
        </div>

        {/* Privacy */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>PRIVACY</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <div style={{ background: C.surface, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontFamily: 'var(--font-dm-mono), "DM Mono", monospace', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
              Sensitive fields (health baseline, post-loss reflections, injury notes, psych raw responses) are AES-256-GCM encrypted at rest.
            </p>
            <p style={{ fontFamily: 'var(--font-dm-mono), "DM Mono", monospace', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dimmer, margin: 0 }}>
              Athletes own their data. Granular sharing controls ship with V1.5.
            </p>
          </div>
        </div>

        {/* App version */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>>APP</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <div style={{ background: C.surface, padding: '12px 14px' }}>
            <p style={{ fontFamily: 'var(--font-dm-mono), "DM Mono", monospace', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
              CAGE LOGIC V1
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}