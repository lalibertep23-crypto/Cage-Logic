// Demo profile — Frankie "The Answer" Edgar
// Static, hardcoded. No auth. No Supabase.
'use client';

import { C, fonts } from '@/lib/design-tokens';
import Link from 'next/link';

const green = '#5C8A3C';

// Base card — no boxShadow; animation drives that via CSS
const card: React.CSSProperties = {
  background: 'rgba(17,17,17,0.92)',
  border: '1px solid rgba(200,148,58,0.22)',
};

// Card with staggered glow animation
const gc = (delay: number): React.CSSProperties => ({
  ...card,
  animation: `cardEdge 5.5s ease-in-out ${delay}s infinite`,
});

export default function DemoProfilePage() {
  return (
    <div style={{ minHeight: '100vh', color: C.text }}>

      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes cardEdge {
          0%   { box-shadow: 0 0 0 1px rgba(200,148,58,0.14), 0 4px 20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(200,148,58,0.07); }
          20%  { box-shadow: 0 0 0 1px rgba(200,148,58,0.06), 0 4px 28px rgba(0,0,0,0.62), inset 0 1px 0 rgba(200,148,58,0.03); }
          55%  { box-shadow: 0 0 0 1px rgba(200,148,58,0.34), 0 4px 18px rgba(0,0,0,0.48), inset 0 1px 0 rgba(200,148,58,0.18), 0 0 24px rgba(200,148,58,0.11), 0 0 6px rgba(200,148,58,0.08); }
          80%  { box-shadow: 0 0 0 1px rgba(200,148,58,0.10), 0 4px 24px rgba(0,0,0,0.58), inset 0 1px 0 rgba(200,148,58,0.05); }
          100% { box-shadow: 0 0 0 1px rgba(200,148,58,0.14), 0 4px 20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(200,148,58,0.07); }
        }
      `}</style>

      {/* ── Minimal Header ────────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'rgba(5,5,5,0.88)',
        borderBottom: '1px solid rgba(200,148,58,0.12)',
        backdropFilter: 'blur(10px)',
      }}>
        <Link href="/home" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(242,239,232,0.14)',
            background: 'rgba(242,239,232,0.05)',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="#F2EFE8" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
        </Link>

        <span style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.26em', color: 'rgba(242,239,232,0.40)' }}>ATHLETE PROFILE</span>

        <div style={{ display: 'flex', gap: 10 }}>
          {[
            <path key="bell" d="M8 2C5.8 2 4 3.8 4 6v4l-1.5 2h11L12 10V6c0-2.2-1.8-4-4-4z" stroke="#8E8577" strokeWidth="1.2"/>,
            <><circle key="d1" cx="3" cy="8" r="1.4" fill="#8E8577"/><circle key="d2" cx="8" cy="8" r="1.4" fill="#8E8577"/><circle key="d3" cx="13" cy="8" r="1.4" fill="#8E8577"/></>,
          ].map((path, i) => (
            <div key={i} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(242,239,232,0.14)', background: 'rgba(242,239,232,0.05)' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">{path}</svg>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 480, overflow: 'hidden', background: '#080604' }}>

        {/* Scene: cage-left / concrete-right split */}
        <img src="/profile-scene.png" alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center top',
        }}/>

        {/* Frankie — full body, standing, right side */}
        <img src="/frankie-edgar-profile.avif" alt="" style={{
          position: 'absolute', bottom: 0,
          right: '6%',
          height: '96%',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          filter: 'brightness(0.90) contrast(1.05) saturate(0.90)',
        }}/>

        {/* Atmospheric overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(200,148,58,0.10) 0%, transparent 45%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.65) 0%, transparent 30%, transparent 55%, rgba(5,5,5,0.50) 100%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 300, background: 'linear-gradient(to bottom, transparent 0%, rgba(5,5,5,0.50) 40%, rgba(5,5,5,0.90) 68%, #050505 100%)', pointerEvents: 'none' }}/>

        {/* Name block */}
        <div style={{ position: 'absolute', bottom: 0, left: 20, right: '42%', paddingBottom: 20 }}>
          <div style={{ fontFamily: fonts.header, fontSize: 62, letterSpacing: '-0.01em', lineHeight: 0.86, color: '#fff', textShadow: '0 4px 40px rgba(0,0,0,0.95)' }}>FRANKIE</div>
          <div style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.36em', lineHeight: 2.0, color: C.amber, textShadow: '0 0 28px rgba(200,148,58,0.65)', paddingLeft: 3 }}>"THE ANSWER"</div>
          <div style={{ fontFamily: fonts.header, fontSize: 62, letterSpacing: '-0.01em', lineHeight: 0.86, color: '#fff', textShadow: '0 4px 40px rgba(0,0,0,0.95)' }}>EDGAR</div>
          <div style={{ fontFamily: fonts.label, fontSize: 10, letterSpacing: '0.18em', color: 'rgba(242,239,232,0.65)', marginTop: 12, textTransform: 'uppercase', lineHeight: 1.6 }}>
            UFC Hall of Fame<br/>Former LW Champion
          </div>
        </div>
      </div>

      {/* ── Credential Badge Strip ────────────────────────────────────────── */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(200,148,58,0.14)', overflowX: 'auto' }} className="hide-scroll">
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
            padding: '14px 6px 12px',
            borderRight: i < 4 ? '1px solid rgba(200,148,58,0.12)' : 'none',
            background: 'rgba(14,12,10,0.95)',
            gap: 7,
          }}>
            <img src={src} alt="" style={{ width: 38, height: 57, objectFit: 'contain' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: fonts.body, fontSize: 7.5, letterSpacing: '0.14em', color: C.dim, lineHeight: 1.4 }}>{line1}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 7.5, letterSpacing: '0.14em', color: C.text, lineHeight: 1.4 }}>{line2}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pro Record ───────────────────────────────────────────────────── */}
      <div style={{ ...gc(0), margin: '12px 12px 0', padding: '16px 20px 0' }}>
        <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.28em', color: C.amber, marginBottom: 16, opacity: 0.7 }}>PRO RECORD</div>
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
        <div style={{ borderTop: '1px solid rgba(200,148,58,0.12)', paddingTop: 12, paddingBottom: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {['13 KO/TKO', '4 SUBMISSIONS', '6 DECISIONS'].map((m) => (
            <div key={m} style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.10em', color: C.dim, textAlign: 'center' }}>{m}</div>
          ))}
        </div>
      </div>

      {/* ── Style DNA + Physical Profile ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '12px 12px 0' }}>

        {/* Style DNA */}
        <div style={{ ...gc(0.8), padding: '14px 14px' }}>
          <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.26em', color: C.amber, marginBottom: 14, textShadow: '0 0 12px rgba(200,148,58,0.5)' }}>STYLE DNA</div>
          {[
            { attr: 'PRESSURE', pct: 92 },
            { attr: 'WRESTLING', pct: 88 },
            { attr: 'SCRAMBLER', pct: 85 },
            { attr: 'CARDIO',    pct: 90 },
            { attr: 'COUNTER',   pct: 78 },
          ].map(({ attr, pct }) => (
            <div key={attr} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.10em', color: C.mid }}>{attr}</span>
                <span style={{ fontFamily: fonts.body, fontSize: 8, color: C.amber }}>{pct}%</span>
              </div>
              <div style={{ height: 3, background: 'rgba(242,239,232,0.07)', borderRadius: 2 }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  background: 'linear-gradient(90deg, #A87A2A 0%, #C8943A 55%, #FFB627 100%)',
                  borderRadius: 2,
                  boxShadow: '0 0 8px rgba(200,148,58,0.80), 0 0 16px rgba(200,148,58,0.35)',
                }}/>
              </div>
            </div>
          ))}
        </div>

        {/* Physical Profile */}
        <div style={{ ...gc(1.4), padding: '14px 12px' }}>
          <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.26em', color: C.amber, marginBottom: 14, textShadow: '0 0 12px rgba(200,148,58,0.5)' }}>PHYSICAL</div>
          {[
            { label: 'HEIGHT',  value: "5'6\"" },
            { label: 'CLASS',   value: 'LW'    },
            { label: 'REACH',   value: '68"'   },
            { label: 'STANCE',  value: 'ORTH.' },
            { label: 'DOB',     value: '10/16/81' },
          ].map(({ label, value }) => (
            <div key={label} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.12em', color: C.dim }}>{label}</span>
              <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.06em', color: C.text }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BJJ Lineage — top-down tree ───────────────────────────────────── */}
      <div style={{ ...gc(2.0), margin: '12px 12px 0', padding: '16px 20px 20px' }}>
        <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.26em', color: C.amber, marginBottom: 20, textShadow: '0 0 12px rgba(200,148,58,0.5)' }}>BJJ LINEAGE</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          {[
            { name: 'CARLSON GRACIE',   dim: 0.38, size: 9  },
            { name: 'RENZO GRACIE',     dim: 0.55, size: 10 },
            { name: 'RICARDO ALMEIDA', dim: 0.75, size: 11 },
            { name: 'FRANKIE EDGAR',    dim: 1.00, size: 13, highlight: true },
          ].map(({ name, dim, size, highlight }, i) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              {i > 0 && (
                <div style={{ width: 1, height: 20, background: `rgba(200,148,58,${dim * 0.5})` }}/>
              )}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 16px',
                background: highlight ? 'rgba(200,148,58,0.10)' : 'transparent',
                border: highlight ? '1px solid rgba(200,148,58,0.40)' : '1px solid transparent',
                boxShadow: highlight ? '0 0 16px rgba(200,148,58,0.18)' : 'none',
                width: '100%', justifyContent: 'center',
              }}>
                <div style={{
                  width: highlight ? 10 : 7, height: highlight ? 10 : 7,
                  borderRadius: '50%',
                  background: highlight ? C.amber : `rgba(200,148,58,${dim})`,
                  boxShadow: highlight ? '0 0 8px rgba(200,148,58,0.8)' : 'none',
                  flexShrink: 0,
                }}/>
                <span style={{
                  fontFamily: highlight ? fonts.label : fonts.body,
                  fontSize: size,
                  letterSpacing: highlight ? '0.14em' : '0.10em',
                  color: highlight ? C.amber : `rgba(242,239,232,${dim})`,
                  textShadow: highlight ? '0 0 12px rgba(200,148,58,0.50)' : 'none',
                }}>{name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Current Affiliation — gym photo card ──────────────────────────── */}
      <div style={{ ...gc(2.6), margin: '12px 12px 0', overflow: 'hidden', padding: 0 }}>
        {/* Mat photo header */}
        <div style={{ position: 'relative', height: 110, overflow: 'hidden' }}>
          <img src="/iron-army-mat.png" alt="" style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 42%',
            filter: 'brightness(0.28) saturate(0.55)',
          }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(17,17,17,0.20) 0%, rgba(17,17,17,0.88) 100%)' }}/>
          <div style={{ position: 'absolute', top: 14, left: 20, fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.26em', color: C.amber, textShadow: '0 0 12px rgba(200,148,58,0.6)' }}>CURRENT AFFILIATION</div>
        </div>

        {/* Logo + info row */}
        <div style={{ padding: '14px 20px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(200,148,58,0.35)', flexShrink: 0, boxShadow: '0 0 12px rgba(200,148,58,0.18)' }}>
            <img src="/iron-army-logo.jpg" alt="Iron Army" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fonts.label, fontSize: 17, letterSpacing: '0.10em', color: C.text, marginBottom: 3 }}>IRON ARMY ACADEMY</div>
            <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.14em', color: C.dim, marginBottom: 14 }}>TOMS RIVER, NJ</div>
            <div style={{ display: 'inline-flex', padding: '6px 14px', border: '1px solid rgba(200,148,58,0.45)', background: 'rgba(200,148,58,0.07)', boxShadow: '0 0 10px rgba(200,148,58,0.10)' }}>
              <span style={{ fontFamily: fonts.body, fontSize: 8.5, letterSpacing: '0.16em', color: C.amber }}>VIEW GYM PROFILE</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Achievements ─────────────────────────────────────────────────── */}
      <div style={{ ...gc(3.2), margin: '12px 12px 0', padding: '16px 20px' }}>
        <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.26em', color: C.amber, marginBottom: 18, textShadow: '0 0 12px rgba(200,148,58,0.5)' }}>ACHIEVEMENTS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { src: '/championship-belt.png', n: '1',  label1: 'WORLD',    label2: 'TITLE'    },
            { src: '/title-fight.png',        n: '3',  label1: 'TITLE',    label2: 'FIGHT W'  },
            { src: '/win-streak.png',         n: '16', label1: 'WIN',      label2: 'STREAK'   },
            { src: '/fight-of-the-night.png', n: '15', label1: 'POTN',     label2: 'BONUSES'  },
          ].map(({ src, n, label1, label2 }, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <img src={src} alt="" style={{ width: 44, height: 66, objectFit: 'contain' }} />
              <div style={{ fontFamily: fonts.header, fontSize: 30, letterSpacing: '-0.02em', color: C.amber, lineHeight: 1, textShadow: '0 0 14px rgba(200,148,58,0.55)' }}>{n}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 7.5, letterSpacing: '0.10em', color: C.dim, textAlign: 'center', lineHeight: 1.4 }}>{label1}<br/>{label2}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Career Highlights ─────────────────────────────────────────────── */}
      <div style={{ ...gc(3.8), margin: '12px 12px 0', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.26em', color: C.amber, marginBottom: 14, textShadow: '0 0 12px rgba(200,148,58,0.5)' }}>CAREER HIGHLIGHTS</div>
          {[
            'UFC HALL OF FAME INDUCTEE',
            'UFC LIGHTWEIGHT CHAMPION',
            '3× TITLE FIGHT VICTORIES',
            '15 PERFORMANCE BONUSES',
            'WEC FEATHERWEIGHT CHAMPION',
            '16 FIGHT WIN STREAK',
          ].map((line) => (
            <div key={line} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.amber, flexShrink: 0, marginTop: 5, boxShadow: '0 0 4px rgba(200,148,58,0.6)' }}/>
              <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.06em', color: C.mid, lineHeight: 1.5 }}>{line}</span>
            </div>
          ))}
        </div>
        {/* frankie-sh — cage photo, landscape, upper body */}
        <div style={{ width: 114, flexShrink: 0, height: 84, border: '1px solid rgba(200,148,58,0.18)', overflow: 'hidden', boxShadow: '0 0 14px rgba(0,0,0,0.5)', alignSelf: 'center' }}>
          <img src="/frankie-sh.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', filter: 'grayscale(1) brightness(0.60)' }}/>
        </div>
      </div>

      {/* ── Fight History Timeline ───────────────────────────────────────── */}
      <div style={{ ...gc(4.4), margin: '12px 12px 0', padding: '16px 0 20px' }}>
        <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.26em', color: C.amber, marginBottom: 18, paddingLeft: 20, textShadow: '0 0 12px rgba(200,148,58,0.5)' }}>FIGHT HISTORY</div>
        <div className="hide-scroll" style={{ overflowX: 'auto', paddingBottom: 4 }}>
          <div style={{ display: 'flex', paddingLeft: 20, paddingRight: 20, gap: 0, minWidth: 'max-content' }}>
            {[
              { event: 'UFC 112', label: 'LW TITLE WIN',    url: 'https://www.youtube.com/watch?v=boIRifT3_GU' },
              { event: 'UFC 116', label: 'TITLE DEFENSE',   url: null },
              { event: 'UFC 118', label: 'TITLE DEFENSE',   url: 'https://www.youtube.com/watch?v=UlRV-c3Wk9M' },
              { event: 'UFC 136', label: 'MAYNARD III KO',  url: null },
              { event: 'UFC 162', label: 'TITLE FIGHT',     url: null },
            ].map(({ event, label, url }, i, arr) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 88, position: 'relative' }}>
                <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.08em', color: url ? C.amber : C.text, marginBottom: 3, textAlign: 'center', textShadow: url ? '0 0 8px rgba(200,148,58,0.5)' : 'none' }}>{event}</div>
                <div style={{ fontFamily: fonts.body, fontSize: 7.5, letterSpacing: '0.06em', color: C.dim, marginBottom: 10, textAlign: 'center', lineHeight: 1.3 }}>{label}</div>
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i > 0 && <div style={{ position: 'absolute', right: '50%', top: '50%', width: '50%', height: 1, background: 'rgba(200,148,58,0.30)', transform: 'translateY(-50%)' }}/>}
                  {i < arr.length - 1 && <div style={{ position: 'absolute', left: '50%', top: '50%', width: '50%', height: 1, background: 'rgba(200,148,58,0.30)', transform: 'translateY(-50%)' }}/>}
                  <div style={{
                    width: url ? 10 : 7, height: url ? 10 : 7,
                    borderRadius: '50%',
                    background: url ? C.amber : 'rgba(200,148,58,0.45)',
                    border: url ? '1px solid rgba(200,148,58,0.8)' : '1px solid rgba(200,148,58,0.4)',
                    zIndex: 1,
                    boxShadow: url ? '0 0 10px rgba(200,148,58,0.8), 0 0 20px rgba(200,148,58,0.4)' : 'none',
                  }}/>
                </div>
                {url && (
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', marginTop: 10 }}>
                    <div style={{
                      padding: '3px 8px',
                      border: '1px solid rgba(200,148,58,0.50)',
                      background: 'rgba(200,148,58,0.10)',
                      boxShadow: '0 0 8px rgba(200,148,58,0.18)',
                    }}>
                      <span style={{ fontFamily: fonts.body, fontSize: 7, letterSpacing: '0.14em', color: C.amber }}>▶ PLAY</span>
                    </div>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Video Highlights ─────────────────────────────────────────────── */}
      <div style={{ ...gc(5.0), margin: '12px 12px 0', padding: '16px 20px' }}>
        <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.26em', color: C.amber, marginBottom: 14, textShadow: '0 0 12px rgba(200,148,58,0.5)' }}>HIGHLIGHTS</div>
        {[
          { label: 'BJ PENN I — LW TITLE WIN · UFC 112', url: 'https://www.youtube.com/watch?v=boIRifT3_GU' },
          { label: 'BJ PENN II — EDGAR FINISHES PENN',   url: 'https://www.youtube.com/watch?v=UlRV-c3Wk9M' },
          { label: '"THE ANSWER" — BEST HIGHLIGHTS',     url: 'https://www.youtube.com/playlist?list=PLCb9XH5bjjRTDOcXqO0jmxha99CHbS6VJ' },
        ].map(({ label, url }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: 8 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 14px',
              background: 'rgba(200,148,58,0.05)',
              border: '1px solid rgba(200,148,58,0.22)',
              borderLeft: '3px solid rgba(200,148,58,0.55)',
              boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            }}>
              <span style={{ fontFamily: fonts.body, fontSize: 10.5, letterSpacing: '0.07em', color: C.text, lineHeight: 1.4 }}>{label}</span>
              <span style={{ fontFamily: fonts.body, fontSize: 10, color: C.amber, flexShrink: 0, marginLeft: 12, textShadow: '0 0 8px rgba(200,148,58,0.5)' }}>▶ VIEW</span>
            </div>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '20px 20px 48px' }}>
        <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.20em', color: C.dimmer, lineHeight: 1.8 }}>
          IRON ARMY ACADEMY · TOMS RIVER, NJ<br/>@FRANKIEEDGAR
        </div>
      </div>

    </div>
  );
}
