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
    <div style={{ minHeight: '100vh', color: C.text }}>

      {/* ── Hero Photo ──────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 460, overflow: 'hidden', background: '#0A0806' }}>

        {/* Photo */}
        <img
          src="/frankie-edgar-profile.avif"
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 8%',
            filter: 'brightness(0.72) contrast(1.12) saturate(0.92)',
          }}
        />

        {/* Warm amber color grade — top-left directional */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(200,148,58,0.10) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}/>

        {/* Side vignettes */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(5,5,5,0.55) 0%, transparent 35%, transparent 65%, rgba(5,5,5,0.55) 100%)',
          pointerEvents: 'none',
        }}/>

        {/* Bottom fade — long and aggressive so name is fully readable */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 320,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(5,5,5,0.50) 40%, rgba(5,5,5,0.88) 65%, #050505 100%)',
          pointerEvents: 'none',
        }}/>

        {/* Top label with amber accent bar */}
        <div style={{
          position: 'absolute', top: 18, left: 20,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ width: 2, height: 12, background: C.amber, flexShrink: 0 }}/>
          <span style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.26em', color: C.amber }}>
            ATHLETE PROFILE
          </span>
        </div>

        {/* Name block — anchored to bottom, fully inside the fade zone */}
        <div style={{ position: 'absolute', bottom: 0, left: 20, right: 20, paddingBottom: 28 }}>

          {/* UFC badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '4px 10px', marginBottom: 12,
            background: 'rgba(200,148,58,0.10)',
            border: '1px solid rgba(200,148,58,0.28)',
          }}>
            <span style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.22em', color: C.amber }}>UFC HALL OF FAMER</span>
            <div style={{ width: 2, height: 2, background: C.amber, borderRadius: '50%', opacity: 0.6 }}/>
            <span style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.22em', color: C.amber }}>IRON ARMY ACADEMY</span>
          </div>

          {/* FRANKIE */}
          <div style={{
            fontFamily: fonts.header, fontSize: 62, letterSpacing: '-0.01em', lineHeight: 0.86,
            color: C.text,
            textShadow: '0 4px 32px rgba(0,0,0,0.9)',
          }}>
            FRANKIE
          </div>

          {/* "THE ANSWER" — Bebas, spaced, amber, smaller as an epithet */}
          <div style={{
            fontFamily: fonts.label, fontSize: 16, letterSpacing: '0.32em', lineHeight: 1.6,
            color: C.amber,
            textShadow: '0 0 24px rgba(200,148,58,0.50)',
            paddingLeft: 3,
          }}>
            "THE ANSWER"
          </div>

          {/* EDGAR */}
          <div style={{
            fontFamily: fonts.header, fontSize: 62, letterSpacing: '-0.01em', lineHeight: 0.86,
            color: C.text,
            textShadow: '0 4px 32px rgba(0,0,0,0.9)',
          }}>
            EDGAR
          </div>

        </div>
      </div>

      {/* ── Role Chips ───────────────────────────────────────────────────── */}
      <div style={{
        padding: '10px 20px', borderBottom: `1px solid ${C.line}`,
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        {['RETIRED ATHLETE', 'COACH'].map(role => (
          <span key={role} style={{
            fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.20em',
            color: C.amber,
            border: `1px solid rgba(200,148,58,0.35)`,
            padding: '4px 10px',
            background: 'rgba(200,148,58,0.06)',
          }}>
            {role}
          </span>
        ))}
      </div>

      {/* ── Identity Strip ──────────────────────────────────────────────── */}
      <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.line}`, background: C.surface }}>

        {/* Achievement badge row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
          {[
            'UFC HALL OF FAMER',
            'FORMER LW CHAMPION',
            'COLLEGIATE WRESTLER',
          ].map(badge => (
            <span key={badge} style={{
              fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.18em',
              color: C.amber,
              border: `1px solid rgba(200,148,58,0.45)`,
              padding: '5px 12px',
              background: 'rgba(200,148,58,0.08)',
            }}>
              {badge}
            </span>
          ))}
        </div>

        {/* Discipline stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* MMA */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            paddingBottom: 14, marginBottom: 14,
            borderBottom: `1px solid ${C.line}`,
          }}>
            <div style={{ width: 40, flexShrink: 0 }}>
              <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.18em', color: C.dim }}>MMA</div>
              <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.12em', color: C.amber, marginTop: 2 }}>PRO</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonts.label, fontSize: 15, letterSpacing: '0.16em', color: C.text }}>23 – 11 – 1</div>
              <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.12em', color: C.dim, marginTop: 2 }}>
                PROFESSIONAL RECORD · RETIRED
              </div>
            </div>
          </div>

          {/* BJJ */}
          <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${C.line}` }}>

            {/* Belt — full width, prominent */}
            <div style={{
              display: 'flex', height: 26, overflow: 'hidden',
              border: `1px solid rgba(242,239,232,0.22)`,
              marginBottom: 12,
              boxShadow: '0 2px 16px rgba(0,0,0,0.60)',
            }}>
              {/* Black body */}
              <div style={{
                flex: 1,
                background: 'linear-gradient(180deg, #3A3530 0%, #1D1A16 40%, #0A0806 100%)',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.09)' }}/>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.28)', transform: 'translateY(-50%)' }}/>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.45)' }}/>
              </div>
              {/* Red tip */}
              <div style={{
                width: 44,
                background: 'linear-gradient(180deg, #A82424 0%, #711414 100%)',
                borderLeft: `2px solid rgba(242,239,232,0.14)`,
                flexShrink: 0,
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.08)' }}/>
              </div>
            </div>

            {/* Rank + verified */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, flexShrink: 0 }}>
                <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.14em', color: C.dim }}>BJJ</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.label, fontSize: 16, letterSpacing: '0.16em', color: C.text }}>BLACK BELT</div>
                <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.12em', color: C.amber, marginTop: 3 }}>
                  VERIFIED · RICARDO ALMEIDA
                </div>
              </div>
            </div>

          </div>

          {/* Wrestling */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, flexShrink: 0 }}>
              <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.18em', color: C.dim }}>WR</div>
              <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.12em', color: C.amber, marginTop: 2 }}>D2</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonts.label, fontSize: 16, letterSpacing: '0.16em', color: C.text }}>NCAA DIVISION II</div>
              <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.12em', color: C.dim, marginTop: 2 }}>
                COLLEGIATE WRESTLING · CLARION UNIVERSITY, PA
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Gym Affiliation ─────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontFamily: fonts.label, fontSize: 16, letterSpacing: '0.22em', color: C.amber, marginBottom: 14 }}>AFFILIATION</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{
              fontFamily: fonts.label, fontSize: 17, letterSpacing: '0.14em',
              color: C.text, marginBottom: 4,
            }}>
              IRON ARMY ACADEMY
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.16em', color: C.amber, marginBottom: 6 }}>
              HEAD COACH
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.14em', color: C.dim }}>
              TOMS RIVER, NJ · 2018–PRESENT
            </div>
          </div>
          {/* Active indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, marginTop: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: green }}/>
            <span style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.16em', color: green }}>CURRENT</span>
          </div>
        </div>
      </div>

      {/* ── Bio ─────────────────────────────────────────────────────────── */}
      <div style={{
        padding: '16px 20px', borderBottom: `1px solid ${C.line}`,
        borderLeft: `3px solid ${C.amberLow}`,
      }}>
        <div style={{
          fontFamily: fonts.body, fontSize: 13, lineHeight: 1.7,
          letterSpacing: '0.04em', color: C.mid,
        }}>
          UFC Hall of Famer. Former Lightweight Champion — 687-day reign. The only fighter to beat BJ Penn three times. Collegiate wrestler out of Clarion University. BJJ black belt under Ricardo Almeida. Toms River, NJ.
        </div>
      </div>

      {/* ── Game Style Tags ──────────────────────────────────────────────── */}
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontFamily: fonts.label, fontSize: 16, letterSpacing: '0.22em', color: C.amber, marginBottom: 12 }}>GAME STYLE</div>
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
              fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.14em',
              color: C.amber,
              border: `1px solid rgba(200,148,58,0.35)`,
              padding: '4px 10px',
              background: 'rgba(200,148,58,0.06)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Competition Record */}
      <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.line}`, background: C.surface }}>
        <div style={{ fontFamily: fonts.label, fontSize: 16, letterSpacing: '0.22em', color: C.amber, marginBottom: 16 }}>
          MMA RECORD
        </div>
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
                fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em',
                color: C.dimmer, marginTop: 8,
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
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
              <span style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.10em', color: C.mid }}>{method}</span>
              <div style={{ display: 'flex', gap: 18 }}>
                <span style={{ fontFamily: fonts.body, fontSize: 11, color: green }}>{w}W</span>
                <span style={{ fontFamily: fonts.body, fontSize: 11, color: l > 0 ? C.brick : C.dimmer }}>{l}L</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 8, padding: '10px 14px',
          background: 'rgba(200,148,58,0.07)', border: `1px solid rgba(200,148,58,0.20)`,
          borderLeft: `3px solid ${C.amber}`,
        }}>
          <span style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.08em', color: C.amber }}>
            0 SUBMISSION LOSSES — 4-0 by submission. Never tapped.
          </span>
        </div>
      </div>

      {/* Career Credentials */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontFamily: fonts.label, fontSize: 16, letterSpacing: '0.22em', color: C.amber, marginBottom: 14 }}>CREDENTIALS</div>
        {[
          'Former UFC Lightweight Champion — 687-day reign (3rd longest in LW history)',
          'Defeated BJ Penn three times. Only fighter in history to do so.',
          'UFC Hall of Fame inductee',
          'Collegiate wrestler · Clarion University, PA · BJJ black belt under Ricardo Almeida',
          'Pro MMA debut 2005 · 25+ years in combat sports',
        ].map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
            <span style={{ color: C.amber, fontFamily: fonts.body, fontSize: 11, flexShrink: 0, marginTop: 1 }}>—</span>
            <span style={{ fontFamily: fonts.body, fontSize: 12, letterSpacing: '0.04em', color: C.mid, lineHeight: 1.6 }}>{line}</span>
          </div>
        ))}
      </div>

      {/* Highlight Clips */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.line}`, background: C.surface }}>
        <div style={{ fontFamily: fonts.label, fontSize: 16, letterSpacing: '0.22em', color: C.amber, marginBottom: 12 }}>HIGHLIGHTS</div>
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
              <span style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.08em', color: C.text, lineHeight: 1.4 }}>
                {label}
              </span>
              <span style={{ fontFamily: fonts.body, fontSize: 11, color: C.amber, flexShrink: 0, marginLeft: 12 }}>
                VIEW
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Footer */}
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
