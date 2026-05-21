// Mental Health Resources — Part A of the crisis flag spec.
// Always-on, ungated. Built per cage-logic-crisis-flag-spec-DRAFT.md.
// Voice: factual, calm. No false reassurances about confidentiality.

import Link from 'next/link';

export const dynamic = 'force-static';

const C = {
  bg:      '#1A1713',
  surface: '#252118',
  border:  'rgba(245,240,232,0.13)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.55)',
  dimmer:  'rgba(245,240,232,0.22)',
  amber:   '#D4922E',
  brick:   '#8B3A1E',
  brickLow:'rgba(139,58,30,0.35)',
};

export default function ResourcesPage() {
  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.brick }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>RESOURCES</span>
        </div>
        <Link href="/settings" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          ← SETTINGS
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* Emergency */}
        <div style={{ marginTop: 24, background: C.surface, borderLeft: `3px solid ${C.brick}`, padding: '16px 16px 14px 12px' }}>
          <p style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.12em', color: C.brick, margin: 0 }}>
            IF YOU&apos;RE IN IMMEDIATE DANGER, CALL 911 OR YOUR LOCAL EMERGENCY NUMBER.
          </p>
        </div>

        {/* US crisis */}
        <div style={{ marginTop: 16, background: C.surface, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 12 }}>
            CRISIS SUPPORT — UNITED STATES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { title: '988 SUICIDE & CRISIS LIFELINE', body: 'Call or text 988. Available 24/7.' },
              { title: 'CRISIS TEXT LINE',               body: 'Text HOME to 741741. Available 24/7.' },
              { title: 'SAMHSA NATIONAL HELPLINE',       body: 'Call 1-800-662-4357. Free, 24/7. Treatment referral and information.' },
            ].map((r) => (
              <div key={r.title} style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.1em', color: C.text, marginBottom: 4 }}>
                  {r.title}
                </div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>
                  {r.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* International */}
        <div style={{ marginTop: 8, background: C.surface, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 10 }}>
            INTERNATIONAL
          </div>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.1em', color: C.text, marginBottom: 4 }}>
            FINDAHELPLINE.COM
          </div>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>
            Crisis lines by country. Free, vetted.
          </div>
        </div>

        {/* Sport psych */}
        <div style={{ marginTop: 8, background: C.surface, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 10 }}>
            SPORT PSYCHOLOGY
          </div>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.1em', color: C.text, marginBottom: 4 }}>
            ASSOCIATION FOR APPLIED SPORT PSYCHOLOGY
          </div>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>
            Directory of certified mental performance consultants. For sport-specific support, not crisis.
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 16, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '14px 14px' }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
            Cage Logic is a training app, not a medical or mental-health service. These resources are independent organizations. Reaching out is a strength move.
          </p>
        </div>

      </div>
    </main>
  );
}