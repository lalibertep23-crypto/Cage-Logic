// Demo profile — Frankie "The Answer" Edgar
// Static, hardcoded. No auth. No Supabase.
'use client';

import { C, fonts } from '@/lib/design-tokens';
import Link from 'next/link';

const green  = '#5C8A3C';
const red    = '#A43A2F';
const amber  = '#C8943A';
const amberD = 'rgba(200,148,58,0.28)';

// ── Card: directional edge light — top catches light, not a glowing border ──
// Animation is very slow (10s) and affects only the top edge brightness.
// No outer glow. Feels like a physical panel under ambient overhead lighting.
const gc = (delay: number): React.CSSProperties => ({
  background:  'rgba(14,12,10,0.96)',
  border:      '1px solid rgba(200,148,58,0.10)',
  animation:   `edgeLight 10s ease-in-out ${delay}s infinite`,
});

export default function DemoProfilePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: C.text }}>

      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes edgeLight {
          0%, 100% {
            border-top:   1px solid rgba(200,148,58,0.22);
            box-shadow:   inset 0 1px 0 rgba(200,148,58,0.08), 0 24px 48px rgba(0,0,0,0.60);
          }
          50% {
            border-top:   1px solid rgba(200,148,58,0.46);
            box-shadow:   inset 0 1px 0 rgba(200,148,58,0.22), 0 24px 48px rgba(0,0,0,0.52);
          }
        }

        /* Fight timeline vertical line */
        .vline-wrap { position: relative; padding-left: 28px; }
        .vline-wrap::before {
          content: '';
          position: absolute;
          left: 10px; top: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent 0%, rgba(200,148,58,0.45) 8%, rgba(200,148,58,0.45) 92%, transparent 100%);
        }
      `}</style>

      {/* ── Hero + Header overlay ────────────────────────────────────────────── */}
      {/* Header lives inside the hero so it overlays the image naturally.        */}
      {/* Sticky behavior handled by the outer wrapper div below.                 */}
      <div style={{ position: 'relative', height: 400, overflow: 'hidden', background: '#060402' }}>

        {/* Sticky header bar — sits on top of hero image, glass effect */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px 14px',
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.72) 0%, rgba(5,5,5,0.30) 60%, transparent 100%)',
        }}>

          {/* Left: Brain icon as back button */}
          <Link href="/home" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {/* Brain — drawn dim/shadowed per request. Not glowing. */}
            <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.90))' }}>
              {/* Left hemisphere outline */}
              <path d="M13 3C10.2 3 7.8 4.6 6.6 7C5.4 7.8 4.5 9.2 4.5 11C4.5 13.2 5.8 15 7.7 15.7C7.8 17.7 9.5 19.3 11.5 19.3L13 19.3"
                stroke="rgba(200,148,58,0.50)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
              {/* Right hemisphere outline */}
              <path d="M13 3C15.8 3 18.2 4.6 19.4 7C20.6 7.8 21.5 9.2 21.5 11C21.5 13.2 20.2 15 18.3 15.7C18.2 17.7 16.5 19.3 14.5 19.3L13 19.3"
                stroke="rgba(200,148,58,0.50)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
              {/* Center fissure */}
              <line x1="13" y1="3.5" x2="13" y2="19" stroke="rgba(200,148,58,0.20)" strokeWidth="0.8"/>
              {/* Sulci — left */}
              <path d="M6.8 9.5C8.5 8.5 10.5 9.2 13 8.8" stroke="rgba(200,148,58,0.28)" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
              <path d="M6 13C8 12 10.5 13 13 12.5" stroke="rgba(200,148,58,0.28)" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
              {/* Sulci — right */}
              <path d="M19.2 9.5C17.5 8.5 15.5 9.2 13 8.8" stroke="rgba(200,148,58,0.28)" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
              <path d="M20 13C18 12 15.5 13 13 12.5" stroke="rgba(200,148,58,0.28)" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
            </svg>
            <span style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.18em', color: 'rgba(242,239,232,0.45)', textShadow: '0 1px 4px rgba(0,0,0,0.90)' }}>BACK</span>
          </Link>

          {/* Center: Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <div style={{
              fontFamily: fonts.header,
              fontSize: 22,
              letterSpacing: '0.04em',
              lineHeight: 1,
              color: '#FFFFFF',
              textShadow: '0 2px 12px rgba(0,0,0,0.95), 0 0 30px rgba(0,0,0,0.70)',
            }}>CAGE LOGIC</div>
            <div style={{
              fontFamily: fonts.label,
              fontSize: 10,
              letterSpacing: '0.30em',
              color: 'rgba(200,148,58,0.70)',
              textShadow: '0 1px 8px rgba(0,0,0,0.90)',
              marginTop: 1,
            }}>ATHLETE PROFILE</div>
          </div>

          {/* Right: icon strip */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              <path key="bell" d="M8 2C5.8 2 4 3.8 4 6v4l-1.5 2h11L12 10V6c0-2.2-1.8-4-4-4z" stroke="rgba(242,239,232,0.35)" strokeWidth="1.2"/>,
              <><circle key="d1" cx="3" cy="8" r="1.4" fill="rgba(242,239,232,0.35)"/><circle key="d2" cx="8" cy="8" r="1.4" fill="rgba(242,239,232,0.35)"/><circle key="d3" cx="13" cy="8" r="1.4" fill="rgba(242,239,232,0.35)"/></>,
            ].map((path, i) => (
              <div key={i} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">{path}</svg>
              </div>
            ))}
          </div>
        </div>

        {/* Background scene */}
        <img src="/profile-scene.png" alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 30%',
          filter: 'brightness(0.72) saturate(0.80)',
        }}/>

        {/* Frankie — bottom-anchored right side.
            Uses frankie-edgar-profile.jpg once Patrick drops it in /public/.
            Fallback: .avif (upper-body crop currently in place). */}
        <img src="/frankie-edgar-profile.avif" alt=""
          style={{
            position: 'absolute', bottom: 0,
            right: '3%',
            height: '96%',
            width: 'auto',
            objectFit: 'contain',
            objectPosition: 'bottom center',
            filter: 'brightness(0.95) contrast(1.05) saturate(0.90)',
          }}/>

        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(200,148,58,0.08) 0%, transparent 42%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.72) 0%, transparent 28%, transparent 52%, rgba(5,5,5,0.45) 100%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 260, background: 'linear-gradient(to bottom, transparent 0%, rgba(5,5,5,0.45) 38%, rgba(5,5,5,0.88) 65%, #050505 100%)', pointerEvents: 'none' }}/>

        {/* Name block */}
        <div style={{ position: 'absolute', bottom: 0, left: 18, right: '40%', paddingBottom: 18 }}>
          <div style={{ fontFamily: fonts.header, fontSize: 64, letterSpacing: '-0.01em', lineHeight: 0.86, color: '#fff', textShadow: '0 4px 40px rgba(0,0,0,0.95)' }}>FRANKIE</div>
          <div style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.36em', lineHeight: 2.0, color: amber, textShadow: '0 0 28px rgba(200,148,58,0.60)', paddingLeft: 3 }}>"THE ANSWER"</div>
          <div style={{ fontFamily: fonts.header, fontSize: 64, letterSpacing: '-0.01em', lineHeight: 0.86, color: '#fff', textShadow: '0 4px 40px rgba(0,0,0,0.95)' }}>EDGAR</div>
          <div style={{ fontFamily: fonts.label, fontSize: 11, letterSpacing: '0.16em', color: 'rgba(242,239,232,0.60)', marginTop: 12, textTransform: 'uppercase', lineHeight: 1.7 }}>
            UFC Hall of Fame<br/>Former LW Champion
          </div>
        </div>
      </div>

      {/* ── Credential Badge Strip ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(200,148,58,0.10)', overflowX: 'auto', background: 'rgba(10,9,8,0.98)' }} className="hide-scroll">
        {[
          { src: '/verified-athlete.png', line1: 'VERIFIED',  line2: 'ATHLETE'    },
          { src: '/hallf-of-fame.png',    line1: 'HALL OF',   line2: 'FAME'       },
          { src: '/ufc-veteran.png',      line1: 'PRO',       line2: 'VETERAN'    },
          { src: '/bjj-badge.png',        line1: 'BJJ',       line2: 'BLACK BELT' },
          { src: '/ncaa-wrestler.png',    line1: 'NCAA',      line2: 'WRESTLER'   },
        ].map(({ src, line1, line2 }, i) => (
          <div key={i} style={{
            flex: '0 0 20%', minWidth: 72,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '14px 6px 14px',
            borderRight: i < 4 ? '1px solid rgba(200,148,58,0.08)' : 'none',
            gap: 7,
          }}>
            <img src={src} alt="" style={{ width: 38, height: 57, objectFit: 'contain' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.12em', color: C.dimmer, lineHeight: 1.4 }}>{line1}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.12em', color: C.mid,   lineHeight: 1.4 }}>{line2}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pro Record ───────────────────────────────────────────────────────── */}
      <div style={{ ...gc(0), margin: '12px 12px 0', padding: '20px 20px 0' }}>
        <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.28em', color: amber, marginBottom: 18, textAlign: 'center', opacity: 0.65 }}>PRO RECORD</div>

        {/* W / L / D — centered */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
          {[
            { n: '23', label: 'WINS',   color: green },
            { n: '11', label: 'LOSSES', color: red   },
            { n: '1',  label: 'DRAW',   color: C.dim },
          ].map(({ n, label, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: fonts.header, fontSize: 72, lineHeight: 0.86, letterSpacing: '-0.02em', color }}>{n}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.18em', color: C.dimmer, marginTop: 10 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Finish method breakdown — centered, more visual */}
        <div style={{ borderTop: '1px solid rgba(200,148,58,0.10)', paddingTop: 16, paddingBottom: 20, display: 'flex', justifyContent: 'space-around' }}>
          {[
            { n: '13', sub: 'KO / TKO'    },
            { n: '4',  sub: 'SUBMISSIONS' },
            { n: '6',  sub: 'DECISIONS'   },
          ].map(({ n, sub }) => (
            <div key={sub} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: fonts.header, fontSize: 26, letterSpacing: '-0.01em', color: C.text, lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.12em', color: C.dimmer, marginTop: 5 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Style DNA + Physical ──────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '12px 12px 0' }}>

        {/* Style DNA */}
        <div style={{ ...gc(1.2), padding: '16px 14px 18px' }}>
          <div style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.22em', color: amber, marginBottom: 16 }}>STYLE DNA</div>
          {[
            { attr: 'PRESSURE',  pct: 92 },
            { attr: 'WRESTLING', pct: 88 },
            { attr: 'SCRAMBLER', pct: 85 },
            { attr: 'CARDIO',    pct: 90 },
            { attr: 'COUNTER',   pct: 78 },
          ].map(({ attr, pct }) => (
            <div key={attr} style={{ marginBottom: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.10em', color: C.mid }}>{attr}</span>
                <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.04em', color: amber, fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
              </div>
              {/* Track */}
              <div style={{ height: 5, background: 'rgba(242,239,232,0.06)', borderRadius: 3 }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  background: 'linear-gradient(90deg, #8A6222 0%, #C8943A 60%, #E2A93B 100%)',
                  borderRadius: 3,
                  boxShadow: '0 0 6px rgba(200,148,58,0.55)',
                }}/>
              </div>
            </div>
          ))}
        </div>

        {/* Physical */}
        <div style={{ ...gc(1.8), padding: '16px 14px 18px' }}>
          <div style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.22em', color: amber, marginBottom: 16 }}>PHYSICAL</div>
          {[
            { label: 'HEIGHT', value: "5'6\"" },
            { label: 'CLASS',  value: 'LW'    },
            { label: 'REACH',  value: '68"'   },
            { label: 'STANCE', value: 'ORTH.' },
            { label: 'D.O.B',  value: '10/81' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              marginBottom: 13,
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              borderBottom: '1px solid rgba(200,148,58,0.06)',
              paddingBottom: 9,
            }}>
              <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.12em', color: C.dimmer }}>{label}</span>
              <span style={{ fontFamily: fonts.label, fontSize: 16, letterSpacing: '0.06em', color: C.text }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BJJ Lineage — family tree ─────────────────────────────────────────── */}
      {/* Each generation is a distinct box. Structural connectors (line + arrow)  */}
      {/* between them. Frankie's box is the terminal highlighted node.            */}
      <div style={{ ...gc(2.4), margin: '12px 12px 0', padding: '20px 16px 24px' }}>
        <div style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.22em', color: amber, marginBottom: 20 }}>BJJ LINEAGE</div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          {([
            { name: 'CARLSON GRACIE',  role: 'PATRIARCH',         era: '1932 – 2000', op: 0.28, textSz: 13, highlight: false },
            { name: 'RENZO GRACIE',    role: 'MASTER',            era: '',            op: 0.52, textSz: 15, highlight: false },
            { name: 'RICARDO ALMEIDA',role: 'DIRECT INSTRUCTOR', era: '',            op: 0.80, textSz: 17, highlight: false },
            { name: 'FRANKIE EDGAR',  role: 'BJJ BLACK BELT',    era: '',            op: 1.00, textSz: 20, highlight: true  },
          ] as { name:string; role:string; era:string; op:number; textSz:number; highlight:boolean }[]).map(({ name, role, era, op, textSz, highlight }, i) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>

              {/* ── Connector: line + downward chevron ── */}
              {i > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 30 }}>
                  {/* Vertical line */}
                  <div style={{ flex: 1, width: 2, background: `rgba(200,148,58,${op * 0.55})` }}/>
                  {/* Arrowhead pointing down */}
                  <div style={{
                    width: 0, height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `7px solid rgba(200,148,58,${op * 0.60})`,
                  }}/>
                </div>
              )}

              {/* ── Node box ── */}
              <div style={{
                padding: highlight ? '14px 16px' : '11px 16px',
                background: highlight
                  ? 'rgba(200,148,58,0.10)'
                  : `rgba(18,15,12,${0.4 + op * 0.5})`,
                borderTop:    highlight ? '1px solid rgba(200,148,58,0.50)' : `1px solid rgba(200,148,58,${op * 0.22})`,
                borderRight:  highlight ? '1px solid rgba(200,148,58,0.28)' : `1px solid rgba(200,148,58,${op * 0.12})`,
                borderBottom: highlight ? '1px solid rgba(200,148,58,0.28)' : `1px solid rgba(200,148,58,${op * 0.12})`,
                borderLeft: `3px solid rgba(200,148,58,${highlight ? 0.75 : op * 0.50})`,
                boxShadow: highlight ? '0 0 28px rgba(200,148,58,0.16), inset 0 1px 0 rgba(200,148,58,0.20)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                {/* Left: name + role */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{
                    fontFamily: highlight ? fonts.label : fonts.body,
                    fontSize: textSz,
                    letterSpacing: highlight ? '0.10em' : '0.07em',
                    color: highlight ? amber : `rgba(242,239,232,${op})`,
                    textShadow: highlight ? '0 0 18px rgba(200,148,58,0.45)' : 'none',
                    lineHeight: 1,
                  }}>{name}</span>
                  <span style={{
                    fontFamily: fonts.body,
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    color: highlight ? 'rgba(200,148,58,0.60)' : `rgba(242,239,232,${op * 0.48})`,
                    lineHeight: 1,
                  }}>{role}{era ? `  ·  ${era}` : ''}</span>
                </div>

                {/* Right: generation node dot */}
                <div style={{
                  width: highlight ? 14 : 9,
                  height: highlight ? 14 : 9,
                  borderRadius: '50%',
                  background: highlight ? amber : `rgba(200,148,58,${op})`,
                  boxShadow: highlight ? '0 0 14px rgba(200,148,58,0.90), 0 0 28px rgba(200,148,58,0.35)' : 'none',
                  border: highlight ? `2px solid rgba(200,148,58,0.40)` : 'none',
                  flexShrink: 0,
                }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Current Affiliation ───────────────────────────────────────────────── */}
      <div style={{ ...gc(3.0), margin: '12px 12px 0', overflow: 'hidden', padding: 0 }}>

        {/* Mat photo — lightened so you can actually see the mat */}
        <div style={{ position: 'relative', height: 100, overflow: 'hidden' }}>
          <img src="/iron-army-mat.png" alt="" style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 38%',
            filter: 'brightness(0.42) saturate(0.65)',
          }}/>
          {/* Softer gradient — let the mat show */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,12,10,0.10) 0%, rgba(14,12,10,0.72) 100%)' }}/>
          <div style={{ position: 'absolute', top: 12, left: 18, fontFamily: fonts.label, fontSize: 11, letterSpacing: '0.22em', color: amber }}>CURRENT AFFILIATION</div>
        </div>

        {/* Info row */}
        <div style={{ padding: '14px 18px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(200,148,58,0.30)', flexShrink: 0, boxShadow: '0 0 12px rgba(200,148,58,0.15)' }}>
            <img src="/iron-army-logo.jpg" alt="Iron Army" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fonts.label, fontSize: 18, letterSpacing: '0.08em', color: C.text, marginBottom: 3 }}>IRON ARMY ACADEMY</div>
            <div style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.14em', color: C.dim, marginBottom: 14 }}>TOMS RIVER, NJ</div>
            <div style={{ display: 'inline-flex', padding: '6px 14px', border: '1px solid rgba(200,148,58,0.40)', background: 'rgba(200,148,58,0.06)' }}>
              <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.16em', color: amber }}>VIEW GYM PROFILE</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Achievements ──────────────────────────────────────────────────────── */}
      <div style={{ ...gc(3.6), margin: '12px 12px 0', padding: '20px 16px 20px' }}>
        <div style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.22em', color: amber, marginBottom: 20 }}>ACHIEVEMENTS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { src: '/championship-belt.png', n: '1',  label1: 'WORLD',    label2: 'TITLE'    },
            { src: '/title-fight.png',        n: '3',  label1: 'TITLE',    label2: 'FIGHTS'   },
            { src: '/win-streak.png',         n: '16', label1: 'WIN',      label2: 'STREAK'   },
            { src: '/fight-of-the-night.png', n: '15', label1: 'PERF.',    label2: 'BONUSES'  },
          ].map(({ src, n, label1, label2 }, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '12px 6px',
              background: 'rgba(200,148,58,0.04)',
              border: '1px solid rgba(200,148,58,0.10)',
              gap: 6,
            }}>
              <img src={src} alt="" style={{ width: 46, height: 69, objectFit: 'contain' }} />

              {/* Number with amber glow underneath */}
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{
                  fontFamily: fonts.header, fontSize: 38, letterSpacing: '-0.02em',
                  color: amber, lineHeight: 1,
                  textShadow: '0 0 18px rgba(200,148,58,0.65), 0 0 40px rgba(200,148,58,0.25)',
                }}>{n}</div>
              </div>

              <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.10em', color: C.dim, textAlign: 'center', lineHeight: 1.4 }}>{label1}<br/>{label2}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Career Highlights ─────────────────────────────────────────────────── */}
      <div style={{ ...gc(4.2), margin: '12px 12px 0', padding: '20px 18px 20px' }}>
        <div style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.22em', color: amber, marginBottom: 18 }}>CAREER HIGHLIGHTS</div>

        {[
          { line: 'UFC LIGHTWEIGHT CHAMPION',     year: '2010' },
          { line: 'UFC HALL OF FAME INDUCTEE',    year: '2018' },
          { line: 'WEC FEATHERWEIGHT CHAMPION',   year: '2008' },
          { line: '3× TITLE FIGHT VICTORIES',    year: ''     },
          { line: '16-FIGHT WIN STREAK',          year: ''     },
          { line: '15 PERFORMANCE BONUSES',       year: ''     },
        ].map(({ line, year }) => (
          <div key={line} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '11px 14px',
            marginBottom: 6,
            background: 'rgba(242,239,232,0.02)',
            borderLeft: '3px solid rgba(200,148,58,0.55)',
            borderTop: '1px solid rgba(200,148,58,0.07)',
            borderRight: '1px solid rgba(200,148,58,0.07)',
            borderBottom: '1px solid rgba(200,148,58,0.07)',
          }}>
            <span style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.07em', color: C.mid, lineHeight: 1.4 }}>{line}</span>
            {year && <span style={{ fontFamily: fonts.body, fontSize: 11, color: amberD, flexShrink: 0, marginLeft: 10, letterSpacing: '0.08em' }}>{year}</span>}
          </div>
        ))}
      </div>

      {/* ── Fight History — vertical timeline ─────────────────────────────────── */}
      <div style={{ ...gc(4.8), margin: '12px 12px 0', padding: '20px 18px 24px' }}>
        <div style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.22em', color: amber, marginBottom: 22 }}>FIGHT HISTORY</div>

        <div className="vline-wrap">
          {[
            { event: 'UFC 112',  label: 'LW TITLE WIN',   result: 'W',  method: 'DEC', url: 'https://www.youtube.com/watch?v=boIRifT3_GU' },
            { event: 'UFC 116',  label: 'TITLE DEFENSE',  result: 'W',  method: 'DEC', url: null },
            { event: 'UFC 118',  label: 'TITLE DEFENSE',  result: 'W',  method: 'DEC', url: 'https://www.youtube.com/watch?v=UlRV-c3Wk9M' },
            { event: 'UFC 136',  label: 'MAYNARD III KO', result: 'W',  method: 'KO',  url: null },
            { event: 'UFC 162',  label: 'TITLE FIGHT',    result: 'L',  method: 'DEC', url: null },
          ].map(({ event, label, result, method, url }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 20, position: 'relative' }}>

              {/* Timeline node */}
              <div style={{
                position: 'absolute',
                left: -24,
                width: url ? 12 : 8,
                height: url ? 12 : 8,
                marginLeft: url ? -2 : 0,
                borderRadius: '50%',
                background: url ? amber : 'rgba(200,148,58,0.40)',
                boxShadow: url ? '0 0 10px rgba(200,148,58,0.80), 0 0 20px rgba(200,148,58,0.35)' : 'none',
                border: '1px solid rgba(200,148,58,0.50)',
                zIndex: 1,
                flexShrink: 0,
              }}/>

              {/* Event info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontFamily: fonts.label, fontSize: 15, letterSpacing: '0.08em', color: url ? amber : C.text }}>{event}</span>
                  <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.08em', color: C.dimmer }}>{method}</span>
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.08em', color: C.dim }}>{label}</div>
              </div>

              {/* Result badge + play */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: result === 'W' ? 'rgba(92,138,60,0.18)' : 'rgba(164,58,47,0.18)',
                  border: `1px solid ${result === 'W' ? 'rgba(92,138,60,0.45)' : 'rgba(164,58,47,0.45)'}`,
                  borderRadius: 2,
                }}>
                  <span style={{ fontFamily: fonts.label, fontSize: 14, color: result === 'W' ? green : red }}>{result}</span>
                </div>

                {url && (
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '4px 10px',
                      border: '1px solid rgba(200,148,58,0.45)',
                      background: 'rgba(200,148,58,0.08)',
                    }}>
                      <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.12em', color: amber }}>▶</span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Video Highlights ──────────────────────────────────────────────────── */}
      <div style={{ ...gc(5.4), margin: '12px 12px 0', padding: '20px 18px' }}>
        <div style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.22em', color: amber, marginBottom: 16 }}>HIGHLIGHTS</div>
        {[
          { label: 'BJ PENN I — LW TITLE WIN · UFC 112',    url: 'https://www.youtube.com/watch?v=boIRifT3_GU' },
          { label: 'BJ PENN II — EDGAR FINISHES PENN',      url: 'https://www.youtube.com/watch?v=UlRV-c3Wk9M' },
          { label: '"THE ANSWER" — BEST HIGHLIGHTS',        url: 'https://www.youtube.com/playlist?list=PLCb9XH5bjjRTDOcXqO0jmxha99CHbS6VJ' },
        ].map(({ label, url }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: 8 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '13px 14px',
              background: 'rgba(200,148,58,0.04)',
              border: '1px solid rgba(200,148,58,0.18)',
              borderLeft: '3px solid rgba(200,148,58,0.50)',
            }}>
              <span style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.06em', color: C.mid, lineHeight: 1.4 }}>{label}</span>
              <span style={{ fontFamily: fonts.body, fontSize: 11, color: amber, flexShrink: 0, marginLeft: 12 }}>▶ VIEW</span>
            </div>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 20px 56px' }}>
        <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.20em', color: C.dimmer, lineHeight: 2.0 }}>
          IRON ARMY ACADEMY · TOMS RIVER, NJ<br/>@FRANKIEEDGAR
        </div>
      </div>

    </div>
  );
}
