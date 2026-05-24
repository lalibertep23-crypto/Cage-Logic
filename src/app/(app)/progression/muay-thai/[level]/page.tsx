// Muay Thai Level Detail — stub. Full build next session.
// Receives level param (1–5). Will render prajied criteria, skills grid, requirements.

import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { C, fonts } from '@/lib/design-tokens';
import { BackButton } from '@/components/ui/back-button';

export const dynamic = 'force-dynamic';

const LEVEL_META: Record<string, { name: string; theme: string; image: string }> = {
  '1': { name: 'PRAJIED LEVEL 1', theme: 'FOUNDATION', image: '/prajied-level1.png' },
  '2': { name: 'PRAJIED LEVEL 2', theme: 'COMPOSURE',  image: '/prajied-level2.png' },
  '3': { name: 'PRAJIED LEVEL 3', theme: 'PRESSURE',   image: '/prajied-level3.png' },
  '4': { name: 'PRAJIED LEVEL 4', theme: 'CONTROL',    image: '/prajied-level4.png' },
  '5': { name: 'PRAJIED LEVEL 5', theme: 'MASTERY',    image: '/prajied-level5.png' },
};

export default async function MuayThaiLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { level } = await params;
  const meta = LEVEL_META[level] ?? LEVEL_META['1'];

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 96, position: 'relative' }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src="/concrete-dark.jpg" alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,3,2,0.84)' }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px 12px',
          borderBottom: '1px solid rgba(194,59,34,0.15)',
          background: 'rgba(5,3,2,0.70)',
          backdropFilter: 'blur(10px)',
        }}>
          <BackButton href="/progression/muay-thai" size={44} />

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: fonts.header, fontSize: 18, letterSpacing: '0.08em',
              color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.90)',
            }}>{meta.name}</div>
            <div style={{
              fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.24em',
              color: '#C23B22', marginTop: 2,
            }}>— {meta.theme} —</div>
          </div>

          <div style={{ width: 32, height: 32 }}/>
        </div>

        {/* Hero prajied image */}
        <div style={{
          position: 'relative', height: 200, overflow: 'hidden',
          borderBottom: '1px solid rgba(194,59,34,0.12)',
        }}>
          <Image
            src={meta.image}
            alt={meta.name}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.75 }}
          />
          {/* Bottom fade */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
            background: 'linear-gradient(to top, rgba(5,3,2,1), transparent)',
            zIndex: 1,
          }}/>
        </div>

        {/* Coming soon notice */}
        <div style={{
          margin: '32px 20px 0',
          padding: '24px 20px',
          background: 'rgba(194,59,34,0.06)',
          border: '1px solid rgba(194,59,34,0.14)',
          borderLeft: '3px solid rgba(194,59,34,0.50)',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: fonts.label, fontSize: 14, letterSpacing: '0.16em',
            color: '#C23B22', marginBottom: 8,
          }}>
            CRITERIA DETAIL
          </div>
          <div style={{
            fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.08em', lineHeight: 1.8,
            color: 'rgba(242,239,232,0.45)',
          }}>
            {meta.name} — {meta.theme}<br/>
            Full criteria, skills grid, and requirements<br/>
            building next session.
          </div>
        </div>

      </div>
    </main>
  );
}
