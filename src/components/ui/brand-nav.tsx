// BrandNav — standard top nav for all screens.
// Brain icon left (64px, tappable back) · CAGE LOGIC wordmark right.
// Consistent across all sub-pages. Matches home screen header split.
//
// BrainWatermark — for tab-level pages that don't need back navigation.
// Small amber brain in the top-left corner of a hero. Brand presence only.

import Link from 'next/link';
import type { ReactNode } from 'react';

export function BrandNav({
  backHref,
  rightSlot,
  glass = true,
}: {
  backHref:   string;
  rightSlot?: ReactNode;
  glass?:     boolean;  // false = fully transparent (for use over hero images)
}) {
  return (
    <div style={{
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'space-between',
      padding:         '10px 16px 8px',
      background:      glass ? 'rgba(5,4,3,0.60)' : 'transparent',
      backdropFilter:  glass ? 'blur(10px)'        : 'none',
      minHeight:       64,
    }}>

      {/* Left — brain icon only (taps back) */}
      <Link href={backHref} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cage-logic-back-button.png"
          alt="Back"
          width={96}
          height={96}
          style={{
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.95)) drop-shadow(0 0 12px rgba(0,0,0,0.80))',
          }}
        />
      </Link>

      {/* Right — wordmark or page-specific actions */}
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        {rightSlot ?? (
          <div>
            <div style={{
              fontFamily:    'var(--font-bebas)',
              fontSize:      17,
              letterSpacing: '0.14em',
              color:         '#C8943A',
              lineHeight:    1,
              textShadow:    '0 1px 8px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.80)',
            }}>
              CAGE LOGIC
            </div>
            <div style={{
              fontFamily:    'var(--font-dm-mono)',
              fontSize:      7,
              letterSpacing: '0.18em',
              color:         'rgba(242,239,232,0.45)',
              lineHeight:    1,
              marginTop:     2,
              textShadow:    '0 1px 6px rgba(0,0,0,0.90)',
            }}>
              COMBAT TRAINING OS
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── BrainWatermark ────────────────────────────────────────────────────────────
// For tab-level pages: brand presence without navigation clutter.
// Place inside a position:relative hero container.
export function BrainWatermark() {
  return (
    <div style={{
      position: 'absolute',
      top: 14,
      left: 16,
      zIndex: 10,
      width: 32,
      height: 32,
      opacity: 0.42,
      pointerEvents: 'none',
    }}>
      <Image
        src="/cage-logic-back-button.png"
        alt="Cage Logic"
        fill
        sizes="32px"
        style={{
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 5px rgba(200,148,58,0.70)) drop-shadow(0 1px 3px rgba(0,0,0,0.90))',
        }}
      />
    </div>
  );
}
