// BrandNav — standard top nav for all screens.
// Brain icon (44px) + CAGE LOGIC wordmark + optional right slot.
// Clicking anywhere on the left block navigates back.

import Link from 'next/link';
import Image from 'next/image';
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
      padding:         '12px 16px 10px',
      background:      glass ? 'rgba(5,4,3,0.60)' : 'transparent',
      backdropFilter:  glass ? 'blur(10px)'        : 'none',
    }}>

      {/* Left — brain + wordmark */}
      <Link href={backHref} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Brain icon */}
        <div style={{ width: 44, height: 44, position: 'relative', flexShrink: 0 }}>
          <Image
            src="/cage-logic-back-button.png"
            alt="Back"
            fill
            sizes="44px"
            style={{ objectFit: 'contain', opacity: 0.90 }}
          />
        </div>

        {/* Wordmark */}
        <div>
          <div style={{
            fontFamily:    'var(--font-bebas)',
            fontSize:      17,
            letterSpacing: '0.14em',
            color:         'rgba(200,148,58,0.92)',
            lineHeight:    1,
          }}>
            CAGE LOGIC
          </div>
          <div style={{
            fontFamily:    'var(--font-dm-mono)',
            fontSize:      7,
            letterSpacing: '0.18em',
            color:         'rgba(242,239,232,0.28)',
            lineHeight:    1,
            marginTop:     2,
          }}>
            COMBAT TRAINING OS
          </div>
        </div>
      </Link>

      {/* Right — page-specific actions */}
      <div style={{ flexShrink: 0 }}>
        {rightSlot ?? <div style={{ width: 44 }} />}
      </div>
    </div>
  );
}
