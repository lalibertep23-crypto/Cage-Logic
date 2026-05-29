'use client';

// Bottom nav — Cage Logic design system.
// Sharp SVG icons, amber top-line on active tab, DM Mono labels.
// Square corners, no rounding, concrete palette.

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Tab icons — G1-G4 are custom image assets; recovery/progression use inline SVGs
const IMG_TABS: Partial<Record<string, string>> = {
  home:    '/G1-home-tab.png',
  log:     '/G2-log-tab.png',
  history: '/G3-history-tab.png',
  mental:  '/G4-mental-tab.png',
};

const ICONS = {
  // Octagon outline — the cage
  home: (active: boolean) => (
    <svg width={30} height={30} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinejoin="miter" strokeLinecap="square">
      <polygon points="8,2 16,2 22,8 22,16 16,22 8,22 2,16 2,8"/>
    </svg>
  ),
  // Stopwatch — log a session / clock in
  log: (active: boolean) => (
    <svg width={30} height={30} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="14" r="8"/>
      <path d="M9,3 L15,3"/>
      <path d="M12,3 L12,6"/>
      <path d="M12,14 L12,10 M12,14 L15,16"/>
    </svg>
  ),
  // Film strip — fight tape / session history
  history: (active: boolean) => (
    <svg width={30} height={30} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="2" y="4" width="20" height="16"/>
      <rect x="2" y="4" width="4" height="4"/>
      <rect x="2" y="10" width="4" height="4"/>
      <rect x="2" y="16" width="4" height="4"/>
      <rect x="18" y="4" width="4" height="4"/>
      <rect x="18" y="10" width="4" height="4"/>
      <rect x="18" y="16" width="4" height="4"/>
    </svg>
  ),
  // Brain — sideways profile, facing left. Cerebrum dome + rear cerebellum bump + sulci.
  mental: (active: boolean) => (
    <svg width={30} height={30} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Cerebrum — large main dome */}
      <path d="M5,18 L5,13 C5,8 8,4 13,4 C18,4 21,7 21,12 C21,16 19,18 17,18"/>
      {/* Cerebellum — small rear bump */}
      <path d="M17,18 C19,18 21,19 20,21 C19,22 17,22 16,21 L16,18"/>
      {/* Brain stem baseline */}
      <path d="M5,18 L5,21 L16,21"/>
      {/* Sulci folds */}
      <path d="M9,7 C11,9 9,12 11,15"/>
      <path d="M14,5 C16,8 14,11 16,14"/>
    </svg>
  ),
  // Medical cross where the horizontal arm IS the heartbeat spike
  recovery: (active: boolean) => (
    <svg width={30} height={30} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
      {/* Vertical bar */}
      <path d="M12,2 L12,22"/>
      {/* Horizontal arm = pulse line */}
      <path d="M2,12 L6,12 L8,8 L10,16 L12,12 L22,12"/>
    </svg>
  ),
  // Rising bars — rank/belt progression
  progression: (active: boolean) => (
    <svg width={30} height={30} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
      {/* Three rising bars — left short, center mid, right tall */}
      <rect x="2"  y="16" width="5" height="6"/>
      <rect x="9"  y="11" width="5" height="11"/>
      <rect x="16" y="5"  width="5" height="17"/>
      {/* Star on top of tallest bar — earned/achievement */}
      <path d="M18.5,2 L19.3,4.2 L21.5,4.2 L19.8,5.5 L20.4,7.5 L18.5,6.2 L16.6,7.5 L17.2,5.5 L15.5,4.2 L17.7,4.2 Z" strokeWidth="1.2"/>
    </svg>
  ),
};

type TabId = keyof typeof ICONS;

const TABS: { href: string; label: string; id: TabId; match: (p: string) => boolean }[] = [
  { href: '/home',     label: 'HOME',   id: 'home',     match: (p) => p === '/home' },
  { href: '/log',      label: 'LOG',    id: 'log',      match: (p) => p === '/log' },
  { href: '/history',  label: 'HIST',   id: 'history',  match: (p) => p.startsWith('/history') },
  { href: '/mental',   label: 'MENTAL', id: 'mental',   match: (p) => p.startsWith('/mental') || p.startsWith('/breathwork') },
  { href: '/recovery',    label: 'RECOVER',  id: 'recovery',    match: (p) => p.startsWith('/recovery') || p.startsWith('/health') },
  { href: '/progression', label: 'PROGRESS', id: 'progression', match: (p) => p.startsWith('/progression') },
];

export function NavBar() {
  const pathname = usePathname() ?? '';

  return (
    <nav
      aria-label="Primary"
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid rgba(245,240,232,0.13)', background: '#13110E' }}
    >
      <ul style={{ margin: '0 auto', display: 'flex', width: '100%', maxWidth: 430, listStyle: 'none', padding: 0, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TABS.map((t) => {
          const active = t.match(pathname);
          return (
            <li key={t.href} style={{ flex: 1, position: 'relative' }}>
              {/* Amber top-line indicator — only on active tab */}
              {active && (
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '20%',
                    right: '20%',
                    height: '2px',
                    background: '#D4922E',
                  }}
                />
              )}
              <Link
                href={t.href}
                aria-current={active ? 'page' : undefined}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: 12, paddingBottom: 12, textDecoration: 'none', color: active ? '#D4922E' : '#B8B2A8' }}
              >
                {IMG_TABS[t.id] ? (
                  <img
                    src={IMG_TABS[t.id]}
                    alt={t.label}
                    width={30}
                    height={30}
                    style={{ opacity: active ? 1 : 0.50, filter: active ? 'drop-shadow(0 0 4px rgba(200,148,58,0.55))' : 'grayscale(0.3) brightness(0.85)' }}
                  />
                ) : (
                  ICONS[t.id](active)
                )}
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono), "DM Mono", monospace',
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {t.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
