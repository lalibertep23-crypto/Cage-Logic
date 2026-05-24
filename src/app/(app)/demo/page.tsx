// Demo profile — Frankie "The Answer" Edgar
// Static, hardcoded. No auth. No Supabase.
// Frankie pitch leave-behind. Disposable once V1.5 dynamic profile ships.
'use client';

import { C, fonts } from '@/lib/design-tokens';
import Link from 'next/link';

const green  = '#5C8A3C';

/* ── Inline SVG badge icons (placeholders — swap for Patrick's art via src prop) */
const ShieldCheck = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 2L4 6V14c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12V6L14 2z" stroke="#C8943A" strokeWidth="1.4" fill="rgba(200,148,58,0.08)"/>
    <path d="M9 14l3.5 3.5L19 11" stroke="#C8943A" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const TrophyStar = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 3l2 6h6l-5 4 2 6-5-3.5L9 19l2-6-5-4h6z" stroke="#C8943A" strokeWidth="1.3" fill="rgba(200,148,58,0.08)"/>
    <rect x="11" y="21" width="6" height="2" rx="1" stroke="#C8943A" strokeWidth="1.2"/>
    <rect x="9" y="23" width="10" height="2" rx="1" stroke="#C8943A" strokeWidth="1.2"/>
  </svg>
);
const OctagonFist = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <polygon points="10,2 18,2 26,10 26,18 18,26 10,26 2,18 2,10" stroke="#C8943A" strokeWidth="1.3" fill="rgba(200,148,58,0.08)"/>
    <circle cx="14" cy="14" r="4" stroke="#C8943A" strokeWidth="1.2" fill="rgba(200,148,58,0.12)"/>
  </svg>
);
const BeltIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="2" y="11" width="24" height="6" rx="1" stroke="#C8943A" strokeWidth="1.3" fill="rgba(200,148,58,0.08)"/>
    <rect x="22" y="11" width="4" height="6" rx="1" fill="rgba(168,36,36,0.6)" stroke="#C8943A" strokeWidth="0.8"/>
    <line x1="2" y1="14" x2="22" y2="14" stroke="#C8943A" strokeWidth="0.7" opacity="0.5"/>
  </svg>
);
const WrestlerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="10" cy="6" r="2.5" stroke="#C8943A" strokeWidth="1.2" fill="rgba(200,148,58,0.08)"/>
    <circle cx="18" cy="6" r="2.5" stroke="#C8943A" strokeWidth="1.2" fill="rgba(200,148,58,0.08)"/>
    <path d="M6 9c2 2 4 4 8 4s6-2 8-4" stroke="#C8943A" strokeWidth="1.3"/>
    <path d="M8 13l-2 8m14-8l2 8" stroke="#C8943A" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

/* ── Achievement icons */
const BeltAchieve = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="1" y="9" width="22" height="6" rx="1" stroke="#C8943A" strokeWidth="1.2" fill="rgba(200,148,58,0.08)"/>
    <rect x="19" y="9" width="4" height="6" fill="rgba(168,36,36,0.7)" rx="0.5"/>
  </svg>
);
const TrophyAchieve = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7 3h10v8a5 5 0 01-10 0V3z" stroke="#C8943A" strokeWidth="1.2" fill="rgba(200,148,58,0.08)"/>
    <path d="M7 7H4a2 2 0 000 4h3M17 7h3a2 2 0 010 4h-3" stroke="#C8943A" strokeWidth="1.1"/>
    <rect x="10" y="16" width="4" height="3" stroke="#C8943A" strokeWidth="1.1"/>
    <rect x="8" y="19" width="8" height="2" rx="1" stroke="#C8943A" strokeWidth="1.1"/>
  </svg>
);
const StarAchieve = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l2.4 7H22l-6 4.4 2.3 7L12 16.3 5.7 20.4 8 13 2 8.6h7.6z" stroke="#C8943A" strokeWidth="1.2" fill="rgba(200,148,58,0.08)"/>
  </svg>
);

export default function DemoProfilePage() {
  return (
    <div style={{ minHeight: '100vh', color: C.text }}>

      {/* ── Top Header Bar ───────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'rgba(5,5,5,0.94)',
        borderBottom: '1px solid rgba(200,148,58,0.14)',
        backdropFilter: 'blur(10px)',
      }}>
        {/* Back */}
        <Link href="/home" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid rgba(242,239,232,0.14)`,
            background: 'rgba(242,239,232,0.05)',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="#F2EFE8" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
        </Link>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#C8943A" strokeWidth="1.2"/>
            <path d="M7 8c0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.5-.8 2.8-2 3.5V14H9v-2.5C7.8 10.8 7 9.5 7 8z" stroke="#C8943A" strokeWidth="1" fill="rgba(200,148,58,0.1)"/>
            <line x1="9" y1="16" x2="13" y2="16" stroke="#C8943A" strokeWidth="1.2"/>
            <line x1="10" y1="18" x2="12" y2="18" stroke="#C8943A" strokeWidth="1.2"/>
          </svg>
          <span style={{ fontFamily: fonts.label, fontSize: 15, letterSpacing: '0.22em', color: C.text }}>CAGE LOGIC</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid rgba(242,239,232,0.14)`,
            background: 'rgba(242,239,232,0.05)',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2C5.8 2 4 3.8 4 6v4l-1.5 2h11L12 10V6c0-2.2-1.8-4-4-4z" stroke="#8E8577" strokeWidth="1.2"/>
              <path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="#8E8577" strokeWidth="1.2"/>
            </svg>
          </div>
          <div style={{
            width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid rgba(242,239,232,0.14)`,
            background: 'rgba(242,239,232,0.05)',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="3" cy="8" r="1.4" fill="#8E8577"/>
              <circle cx="8" cy="8" r="1.4" fill="#8E8577"/>
              <circle cx="13" cy="8" r="1.4" fill="#8E8577"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Hero Photo ───────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 440, overflow: 'hidden', background: '#0A0806' }}>

        <img src="/cage-hero-bg.jpg" alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center center',
        }}/>
        <img src="/frankie-edgar-profile.avif" alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 8%',
          filter: 'brightness(0.84) contrast(1.06) saturate(0.90)',
        }}/>

        {/* Amber color grade */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(200,148,58,0.10) 0%, transparent 55%)', pointerEvents: 'none' }}/>
        {/* Side vignettes */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.55) 0%, transparent 35%, transparent 65%, rgba(5,5,5,0.55) 100%)', pointerEvents: 'none' }}/>
        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 300, background: 'linear-gradient(to bottom, transparent 0%, rgba(5,5,5,0.50) 40%, rgba(5,5,5,0.90) 68%, #050505 100%)', pointerEvents: 'none' }}/>

        {/* ATHLETE PROFILE label */}
        <div style={{ position: 'absolute', top: 16, left: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 2, height: 10, background: C.amber }}/>
          <span style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.26em', color: C.amber }}>ATHLETE PROFILE</span>
        </div>

        {/* Name block */}
        <div style={{ position: 'absolute', bottom: 0, left: 20, right: 20, paddingBottom: 24 }}>
          <div style={{ fontFamily: fonts.header, fontSize: 60, letterSpacing: '-0.01em', lineHeight: 0.86, color: C.text, textShadow: '0 4px 32px rgba(0,0,0,0.9)' }}>FRANKIE</div>
          <div style={{ fontFamily: fonts.label, fontSize: 15, letterSpacing: '0.32em', lineHeight: 1.6, color: C.amber, textShadow: '0 0 24px rgba(200,148,58,0.50)', paddingLeft: 3 }}>"THE ANSWER"</div>
          <div style={{ fontFamily: fonts.header, fontSize: 60, letterSpacing: '-0.01em', lineHeight: 0.86, color: C.text, textShadow: '0 4px 32px rgba(0,0,0,0.9)' }}>EDGAR</div>
          <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em', color: 'rgba(242,239,232,0.55)', marginTop: 10 }}>
            UFC HALL OF FAMER  ·  FORMER LW CHAMPION
          </div>
        </div>
      </div>

      {/* ── Credential Badge Cards ────────────────────────────────────────── */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.line}`, overflowX: 'auto' }}>
        {[
          { icon: <ShieldCheck/>, line1: 'VERIFIED', line2: 'ATHLETE' },
          { icon: <TrophyStar/>,  line1: 'HALL OF',  line2: 'FAME'    },
          { icon: <OctagonFist/>, line1: 'PRO',       line2: 'VETERAN' },
          { icon: <BeltIcon/>,    line1: 'BJJ',       line2: 'BLACK BELT' },
          { icon: <WrestlerIcon/>,line1: 'NCAA',      line2: 'WRESTLER'},
        ].map(({ icon, line1, line2 }, i) => (
          <div key={i} style={{
            flex: '0 0 20%', minWidth: 70,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '14px 4px',
            borderRight: i < 4 ? `1px solid ${C.line}` : 'none',
            background: C.surface,
            gap: 6,
          }}>
            {icon}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.14em', color: C.dim, lineHeight: 1.4 }}>{line1}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.14em', color: C.text, lineHeight: 1.4 }}>{line2}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pro Record ───────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px 0', background: C.surface, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.24em', color: C.dim, marginBottom: 14 }}>PRO RECORD</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
          {[
            { n: '23', label: 'WINS',   color: green },
            { n: '11', label: 'LOSSES', color: '#A43A2F' },
            { n: '1',  label: 'DRAW',   color: C.dim },
          ].map(({ n, label, color }) => (
            <div key={label}>
              <div style={{ fontFamily: fonts.header, fontSize: 58, lineHeight: 0.88, letterSpacing: '-0.02em', color }}>{n}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em', color: C.dimmer, marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 12, paddingBottom: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { method: '13 KO/TKO' },
            { method: '4 SUBMISSIONS' },
            { method: '6 DECISIONS' },
          ].map(({ method }) => (
            <div key={method} style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.10em', color: C.dim, textAlign: 'center' }}>{method}</div>
          ))}
        </div>
      </div>

      {/* ── Style DNA + Physical Profile ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${C.line}` }}>

        {/* Style DNA */}
        <div style={{ padding: '14px 14px', borderRight: `1px solid ${C.line}` }}>
          <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.22em', color: C.amber, marginBottom: 12 }}>STYLE DNA</div>
          {[
            { attr: 'PRESSURE FIGHTER', pct: 92 },
            { attr: 'CHAIN WRESTLER',   pct: 88 },
            { attr: 'SCRAMBLER',        pct: 85 },
            { attr: 'CARDIO WEAPON',    pct: 90 },
            { attr: 'COUNTER STRIKER',  pct: 78 },
          ].map(({ attr, pct }) => (
            <div key={attr} style={{ marginBottom: 9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.10em', color: C.mid }}>{attr}</span>
                <span style={{ fontFamily: fonts.body, fontSize: 8, color: C.amber }}>{pct}%</span>
              </div>
              <div style={{ height: 3, background: 'rgba(242,239,232,0.08)', borderRadius: 1 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, #A87A2A 0%, #C8943A 60%, #E2A93B 100%)`, borderRadius: 1 }}/>
              </div>
            </div>
          ))}
        </div>

        {/* Physical Profile */}
        <div style={{ padding: '14px 12px' }}>
          <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.22em', color: C.amber, marginBottom: 12 }}>PHYSICAL PROFILE</div>
          {[
            { label: 'HEIGHT',       value: '5\'6"'       },
            { label: 'WEIGHT CLASS', value: 'LIGHTWEIGHT' },
            { label: 'REACH',        value: '68"'         },
            { label: 'STANCE',       value: 'ORTHODOX'    },
            { label: 'DOB',          value: '10 / 16 / 1981' },
          ].map(({ label, value }) => (
            <div key={label} style={{ marginBottom: 9 }}>
              <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.12em', color: C.dim, marginBottom: 2 }}>{label}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.08em', color: C.text }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lineage + Current Affiliation ────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${C.line}` }}>

        {/* Lineage */}
        <div style={{ padding: '14px 14px', borderRight: `1px solid ${C.line}` }}>
          <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.22em', color: C.amber, marginBottom: 14 }}>LINEAGE</div>

          {/* Ricardo Almeida */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1px solid rgba(200,148,58,0.5)`, background: 'rgba(200,148,58,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="3.5" r="2" stroke="#C8943A" strokeWidth="0.9"/><path d="M1 9c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" stroke="#C8943A" strokeWidth="0.9"/></svg>
            </div>
            <span style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.08em', color: C.text }}>RICARDO ALMEIDA</span>
          </div>

          {/* Connector line */}
          <div style={{ marginLeft: 9, borderLeft: `1px solid rgba(200,148,58,0.25)`, paddingLeft: 17, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1px solid rgba(200,148,58,0.4)`, background: 'rgba(200,148,58,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="3.5" r="2" stroke="#C8943A" strokeWidth="0.9"/><path d="M1 9c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" stroke="#C8943A" strokeWidth="0.9"/></svg>
              </div>
              <span style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.08em', color: C.mid }}>RENZO GRACIE</span>
            </div>
            <div style={{ marginLeft: 9, borderLeft: `1px solid rgba(200,148,58,0.18)`, paddingLeft: 17 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1px solid rgba(200,148,58,0.3)`, background: 'rgba(200,148,58,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="3.5" r="2" stroke="#C8943A" strokeWidth="0.9"/><path d="M1 9c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" stroke="#C8943A" strokeWidth="0.9"/></svg>
                </div>
                <span style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.08em', color: C.dim }}>CARLSON GRACIE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Affiliation */}
        <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.22em', color: C.amber, marginBottom: 12 }}>CURRENT AFFILIATION</div>

          {/* Logo */}
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            overflow: 'hidden', marginBottom: 10,
            border: `1px solid rgba(200,148,58,0.30)`,
            background: C.raised,
          }}>
            <img src="/iron-army-logo.jpg" alt="Iron Army Academy" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </div>

          <div style={{ fontFamily: fonts.label, fontSize: 13, letterSpacing: '0.12em', color: C.text, marginBottom: 3 }}>IRON ARMY ACADEMY</div>
          <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.12em', color: C.dim, marginBottom: 14 }}>TOMS RIVER, NJ</div>

          <div style={{
            padding: '6px 12px',
            border: `1px solid rgba(200,148,58,0.40)`,
            background: 'rgba(200,148,58,0.06)',
          }}>
            <span style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.16em', color: C.amber }}>VIEW GYM PROFILE</span>
          </div>
        </div>
      </div>

      {/* ── Achievements ─────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.line}`, background: C.surface }}>
        <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.24em', color: C.amber, marginBottom: 16 }}>ACHIEVEMENTS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
          {[
            { icon: <BeltAchieve/>,   n: '1',  label1: 'WORLD',    label2: 'TITLES'    },
            { icon: <BeltAchieve/>,   n: '3',  label1: 'TITLE',    label2: 'FIGHT WINS'},
            { icon: <TrophyAchieve/>, n: '16', label1: 'FIGHT WIN',label2: 'STREAK'    },
            { icon: <StarAchieve/>,   n: '15', label1: 'PERF. OF', label2: 'THE NIGHT' },
          ].map(({ icon, n, label1, label2 }, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              {icon}
              <div style={{ fontFamily: fonts.header, fontSize: 28, letterSpacing: '-0.02em', color: C.amber, lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 7.5, letterSpacing: '0.10em', color: C.dim, textAlign: 'center', lineHeight: 1.4 }}>{label1}<br/>{label2}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Career Highlights ─────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.line}`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.24em', color: C.amber, marginBottom: 14 }}>CAREER HIGHLIGHTS</div>
          {[
            'UFC HALL OF FAME INDUCTEE',
            'UFC LIGHTWEIGHT CHAMPION',
            '3X TITLE FIGHT VICTORIES',
            'UFC 100 PERFORMANCES OF THE NIGHT',
            'WEC FEATHERWEIGHT CHAMPION',
            '16 FIGHT WIN STREAK (UFC RECORD)',
          ].map((line) => (
            <div key={line} style={{ display: 'flex', gap: 8, marginBottom: 7, alignItems: 'flex-start' }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.amber, flexShrink: 0, marginTop: 4 }}/>
              <span style={{ fontFamily: fonts.body, fontSize: 9.5, letterSpacing: '0.06em', color: C.mid, lineHeight: 1.5 }}>{line}</span>
            </div>
          ))}
        </div>
        {/* Photo placeholder — swap for b&w Frankie belt-raise photo */}
        <div style={{
          width: 100, flexShrink: 0,
          height: 160, background: C.raised,
          border: `1px solid ${C.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <img src="/frankie-edgar-profile.avif" alt="" style={{ width: '140%', height: '100%', objectFit: 'cover', objectPosition: 'center 5%', filter: 'grayscale(1) brightness(0.7)', marginLeft: '-20%' }}/>
        </div>
      </div>

      {/* ── Fight History Timeline ───────────────────────────────────────── */}
      <div style={{ padding: '16px 0 20px', borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.24em', color: C.amber, marginBottom: 16, paddingLeft: 20 }}>FIGHT HISTORY</div>
        <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
          <div style={{ display: 'flex', paddingLeft: 20, paddingRight: 20, gap: 0, minWidth: 'max-content' }}>
            {[
              { event: 'UFC 112', label: 'LW TITLE WIN'   },
              { event: 'UFC 116', label: 'TITLE DEFENSE'  },
              { event: 'UFC 126', label: 'TITLE DEFENSE'  },
              { event: 'UFC 136', label: 'THIRD ROUND KO' },
              { event: 'UFC 162', label: 'TITLE FIGHT'    },
            ].map(({ event, label }, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80, position: 'relative' }}>
                {/* Event label */}
                <div style={{ fontFamily: fonts.body, fontSize: 8.5, letterSpacing: '0.08em', color: C.text, marginBottom: 4, textAlign: 'center' }}>{event}</div>
                <div style={{ fontFamily: fonts.body, fontSize: 7.5, letterSpacing: '0.06em', color: C.dim, marginBottom: 8, textAlign: 'center', lineHeight: 1.3 }}>{label}</div>

                {/* Dot + line */}
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Left line */}
                  {i > 0 && <div style={{ position: 'absolute', right: '50%', top: '50%', width: '50%', height: 1, background: 'rgba(200,148,58,0.35)', transform: 'translateY(-50%)' }}/>}
                  {/* Right line */}
                  {i < 4 && <div style={{ position: 'absolute', left: '50%', top: '50%', width: '50%', height: 1, background: 'rgba(200,148,58,0.35)', transform: 'translateY(-50%)' }}/>}
                  {/* Dot */}
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.amber, border: `1px solid rgba(200,148,58,0.6)`, zIndex: 1, boxShadow: '0 0 6px rgba(200,148,58,0.5)' }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Video Highlights ─────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.line}`, background: C.surface }}>
        <div style={{ fontFamily: fonts.label, fontSize: 14, letterSpacing: '0.22em', color: C.amber, marginBottom: 12 }}>HIGHLIGHTS</div>
        {[
          { label: 'BJ PENN I — LW TITLE WIN  ·  UFC 112',             url: 'https://www.youtube.com/watch?v=boIRifT3_GU' },
          { label: 'BJ PENN III — EDGAR FINISHES PENN',                 url: 'https://www.youtube.com/watch?v=UlRV-c3Wk9M' },
          { label: '"THE ANSWER" — BEST HIGHLIGHTS & FINISHES',         url: 'https://www.youtube.com/playlist?list=PLCb9XH5bjjRTDOcXqO0jmxha99CHbS6VJ' },
        ].map(({ label, url }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: 8 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '13px 14px', background: C.raised,
              border: `1px solid ${C.lineHard}`,
              borderLeft: `3px solid rgba(200,148,58,0.25)`,
            }}>
              <span style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.08em', color: C.text, lineHeight: 1.4 }}>{label}</span>
              <span style={{ fontFamily: fonts.body, fontSize: 11, color: C.amber, flexShrink: 0, marginLeft: 12 }}>VIEW</span>
            </div>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 20px 40px' }}>
        <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.20em', color: C.dimmer, lineHeight: 1.8 }}>
          IRON ARMY ACADEMY · TOMS RIVER, NJ<br/>@FRANKIEEDGAR
        </div>
      </div>

    </div>
  );
}
