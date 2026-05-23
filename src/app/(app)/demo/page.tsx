// Demo profile — Frankie "The Answer" Edgar
// Static, hardcoded. No auth check. No Supabase.
// Used for Claudia Gadelha / Ricardo Almeida pitch via Frankie.
// Disposable once V1.5 athlete profile is built.
//
// BEFORE DEMO: drop frankie-edgar-profile.jpg into /public/

import { C, fonts } from '@/lib/design-tokens';

const green = '#5C8A3C';

export default function DemoProfilePage() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text }}>

      {/* ── Hero Photo ──────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 340, overflow: 'hidden', background: C.raised }}>
        <img
          src="/frankie-edgar-profile.avif"
          alt="Frankie Edgar"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 15%',
            filter: 'brightness(0.65)',
          }}
        />
        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
          background: `linear-gradient(to bottom, transparent 0%, ${C.bg} 100%)`,
        }}/>
        {/* Top label */}
        <div style={{
          position: 'absolute', top: 16, left: 20,
          fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.22em', color: C.amber,
        }}>
          ATHLETE PROFILE
        </div>
        {/* Name overlay */}
        <div style={{ position: 'absolute', bottom: 18, left: 20, right: 20 }}>
          <div style={{
            fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.22em',
            color: C.amber, marginBottom: 6,
          }}>
            UFC HALL OF FAMER · IRON ARMY ACADEMY
          </div>
          <div style={{ fontFamily: fonts.header, fontSize: 52, letterSpacing: '0.02em', lineHeight: 0.9, color: C.text }}>
            FRANKIE
          </div>
          <div style={{ fontFamily: fonts.header, fontSize: 40, letterSpacing: '0.04em', lineHeight: 1, color: C.amber }}>
            "THE ANSWER"
          </div>
          <div style={{ fontFamily: fonts.header, fontSize: 52, letterSpacing: '0.02em', lineHeight: 0.9, color: C.text }}>
            EDGAR
          </div>
        </div>
      </div>

      {/* ── Identity Strip ──────────────────────────────────────────────── */}
      <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.line}`, background: C.surface }}>
        {/* Belt row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          {/* CSS black belt */}
          <div style={{ display: 'flex', width: 76, height: 14, flexShrink: 0, overflow: 'hidden', border: `1px solid ${C.lineHard}` }}>
            <div style={{
              flex: 1,
              background: 'linear-gradient(180deg, #2E2A24 0%, #1A1612 55%, #0A0806 100%)',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.10)' }}/>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.20)', transform: 'translateY(-50%)' }}/>
            </div>
            {/* Red tip — BJJ black belt has a red panel */}
            <div style={{
              width: 18,
              background: 'linear-gradient(180deg, #8B1A1A 0%, #5E0F0F 100%)',
              borderLeft: `1px solid rgba(242,239,232,0.08)`,
              flexShrink: 0,
            }}/>
          </div>
          <div>
            <div style={{ fontFamily: fonts.label, fontSize: 15, letterSpacing: '0.18em', color: C.text }}>BJJ BLACK BELT</div>
            <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.14em', color: C.amber, marginTop: 2 }}>
              VERIFIED · RICARDO ALMEIDA
            </div>
          </div>
        </div>
        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { label: 'WEIGHT CLASS', value: '155 LB' },
            { label: 'DISCIPLINE', value: 'MMA' },
            { label: 'BASE', value: 'WRESTLING' },
          ].map(({ label, value }, i) => (
            <div key={label} style={{
              paddingRight: i < 2 ? 12 : 0,
              borderRight: i < 2 ? `1px solid ${C.line}` : 'none',
              paddingLeft: i > 0 ? 12 : 0,
            }}>
              <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.16em', color: C.dim, marginBottom: 3 }}>{label}</div>
              <div style={{ fontFamily: fonts.label, fontSize: 14, letterSpacing: '0.12em', color: C.text }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bio ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.line}` }}>
        <div style={{
          fontFamily: fonts.body, fontSize: 11, lineHeight: 1.75,
          letterSpacing: '0.03em', color: C.mid,
        }}>
          UFC Hall of Famer and former Lightweight Champion. The only fighter to beat BJ Penn three times. Division I wrestler, BJJ black belt under Ricardo Almeida. Forged in Toms River.
        </div>
      </div>

      {/* ── Game Style Tags ──────────────────────────────────────────────── */}
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.2em', color: C.dim, marginBottom: 10 }}>GAME STYLE</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {[
            'WRESTLER BASE',
            'PRESSURE FIGHTER',
            'RELENTLESS PACE',
            'BOXING + FOOTWORK',
            'TAKEDOWNS & SCRAMBLES',
            'ELITE CARDIO',
          ].map(tag => (
            <span key={tag} style={{
              fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.12em',
              color: C.amber,
              border: `1px solid rgba(200,148,58,0.35)`,
              padding: '3px 9px',
              background: 'rgba(200,148,58,0.06)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Competition Record ───────────────────────────────────────────── */}
      <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.line}`, background: C.surface }}>
        <div style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.2em', color: C.dim, marginBottom: 16 }}>
          MMA RECORD
        </div>
        {/* Big numbers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 18 }}>
          {[
            { n: '23', label: 'WINS',   color: green },
            { n: '11', label: 'LOSSES', color: C.brick },
            { n: '1',  label: 'DRAW',   color: C.dim },
          ].map(({ n, label, color }) => (
            <div key={label}>
              <div style={{
                fontFamily: fonts.header, fontSize: 60, lineHeight: 0.88,
                letterSpacing: '-0.02em', color,
              }}>
                {n}
              </div>
              <div style={{
                fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.16em',
                color: C.dimmer, marginTop: 8,
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
        {/* Method breakdown */}
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
          {[
            { method: 'KO / TKO',    w: 6, l: 5 },
            { method: 'SUBMISSION',  w: 4, l: 0 },
            { method: 'DECISION',    w: 13, l: 6 },
          ].map(({ method, w, l }) => (
            <div key={method} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingBottom: 8,
            }}>
              <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.08em', color: C.mid }}>{method}</span>
              <div style={{ display: 'flex', gap: 18 }}>
                <span style={{ fontFamily: fonts.body, fontSize: 10, color: green }}>{w}W</span>
                <span style={{ fontFamily: fonts.body, fontSize: 10, color: l > 0 ? C.brick : C.dimmer }}>{l}L</span>
              </div>
            </div>
          ))}
        </div>
        {/* Standout fact */}
        <div style={{
          marginTop: 8, padding: '10px 14px',
          background: 'rgba(200,148,58,0.07)', border: `1px solid rgba(200,148,58,0.20)`,
          borderLeft: `3px solid ${C.amber}`,
        }}>
          <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.06em', color: C.amber }}>
            0 SUBMISSION LOSSES — 4–0 by submission. Never tapped.
          </span>
        </div>
      </div>

      {/* ── Career Credentials ───────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.2em', color: C.dim, marginBottom: 12 }}>CREDENTIALS</div>
        {[
          'Former UFC Lightweight Champion — 687-day reign (3rd longest in LW history)',
          'Defeated BJ Penn three times. Only fighter in history to do so.',
          'UFC Hall of Fame inductee',
          'Division I collegiate wrestler · BJJ black belt under Ricardo Almeida',
          'Pro MMA debut 2005 · 25+ years training',
        ].map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 9, alignItems: 'flex-start' }}>
            <span style={{ color: C.amber, fontFamily: fonts.body, fontSize: 10, flexShrink: 0, marginTop: 1 }}>—</span>
            <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.04em', color: C.mid, lineHeight: 1.6 }}>{line}</span>
          </div>
        ))}
      </div>

      {/* ── Highlight Clips ──────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.line}`, background: C.surface }}>
        <div style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.2em', color: C.dim, marginBottom: 12 }}>HIGHLIGHTS</div>
        {[
          { label: 'BJ PENN I — LW TITLE WIN  ·  UFC 112', url: 'https://www.youtube.com/watch?v=boIRifT3_GU' },
          { label: 'BJ PENN III — EDGAR FINISHES PENN', url: 'https://www.youtube.com/watch?v=UlRV-c3Wk9M' },
          { label: '"THE ANSWER" — BEST HIGHLIGHTS & FINISHES', url: 'https://www.youtube.com/playlist?list=PLCb9XH5bjjRTDOcXqO0jmxha99CHbS6VJ' },
        ].map(({ label, url }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block', marginBottom: 8 }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '13px 14px',
              background: C.raised,
              border: `1px solid ${C.lineHard}`,
              borderLeft: `3px solid ${C.amberLow}`,
            }}>
              <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.07em', color: C.text, lineHeight: 1.4 }}>
                {label}
              </span>
              <span style={{ fontFamily: fonts.body, fontSize: 10, color: C.amber, flexShrink: 0, marginLeft: 12 }}>
                VIEW →
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px 40px' }}>
        <div style={{
          fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.20em',
          color: C.dimmer, lineHeight: 1.8,
        }}>
          IRON ARMY ACADEMY · TOMS RIVER, NJ
          <br />
          @FRANKIEEDGAR
        </div>
      </div>

    </div>
  );
}
