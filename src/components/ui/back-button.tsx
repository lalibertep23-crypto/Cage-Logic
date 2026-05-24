// Global back button — brain icon, used top-left on all screens.

import Link from 'next/link';
import Image from 'next/image';

export function BackButton({ href, size = 30 }: { href: string; size?: number }) {
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
        <Image
          src="/cage-logic-back-button.png"
          alt="Back"
          fill
          sizes={size + 'px'}
          style={{ objectFit: 'contain', opacity: 0.82 }}
        />
      </div>
    </Link>
  );
}
