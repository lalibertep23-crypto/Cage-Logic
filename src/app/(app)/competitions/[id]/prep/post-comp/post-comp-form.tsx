'use client';

import { useState } from 'react';
import { savePostCompReflection } from './post-comp-actions';

const C = {
  bg: '#1A1713', surface: '#252118', border: 'rgba(245,240,232,0.5)',
  text: '#F5F0E8', dim: 'rgba(245,240,232,0.38)', dimmer: 'rgba(245,240,232,0.22)',
  amber: '#D4922E', brick: '#8B3A1E', brickLow: 'rgba(139,58,30,0.35)',
  green: '#3D8B55',
};

type Level = 'low' | 'medium' | 'high';

const LEVELS: { value: Level; label: string }[] = [
  { value: 'low',    label: 'LOW' },
  { value: 'medium', label: 'MEDIUM' },
  { value: 'high',   label: 'HIGH' },
];

const flatTextarea: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: C.bg, border: `1px solid rgba(245,240,232,0.14)`,
  color: C.text, fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em',
  padding: '10px 12px', outline: 'none', resize: 'none' as const,
};

const flatInput: React.CSSProperties = { ...flatTextarea, resize: undefined };

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em',
  color: C.dimmer, marginBottom: 6, display: 'block',
};

function LevelSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Level | null;
  onChange: (v: Level) => void;
}) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {LEVELS.map((opt) => {
          const selected = value === opt.value;
          const accent = opt.value === 'low' ? C.green : opt.value === 'medium' ? C.amber : C.brick;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              style={{
                flex: 1, padding: '9px 0',
                background: selected ? accent : 'transparent',
                border: `1px solid ${selected ? accent : C.border}`,
                color: selected ? C.bg : C.dim,
                fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type Props = {
  compId: string;
  existing: {
    whatWorked: string | null;
    whatBroke: string | null;
    whatSurprised: string | null;
    drillPriority1: string | null;
    drillPriority2: string | null;
    injuryFlag: boolean;
    fatigueLevel: Level | null;
    mentalStatePre: Level | null;
    mentalStateDuring: Level | null;
    nextCompPlanned: boolean | null;
  } | null;
};

export function PostCompForm({ compId, existing }: Props) {
  const [fatigue,      setFatigue]      = useState<Level | null>(existing?.fatigueLevel ?? null);
  const [mentalPre,    setMentalPre]    = useState<Level | null>(existing?.mentalStatePre ?? null);
  const [mentalDuring, setMentalDuring] = useState<Level | null>(existing?.mentalStateDuring ?? null);
  const [injuryFlag,   setInjuryFlag]   = useState<boolean>(existing?.injuryFlag ?? false);
  const [nextComp,     setNextComp]     = useState<boolean | null>(existing?.nextCompPlanned ?? null);

  return (
    <form action={savePostCompReflection} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <input type="hidden" name="comp_id" value={compId} />
      {fatigue      && <input type="hidden" name="fatigue_level"      value={fatigue} />}
      {mentalPre    && <input type="hidden" name="mental_state_pre"   value={mentalPre} />}
      {mentalDuring && <input type="hidden" name="mental_state_during" value={mentalDuring} />}
      <input type="hidden" name="injury_flag"      value={String(injuryFlag)} />
      {nextComp !== null && <input type="hidden" name="next_comp_planned" value={String(nextComp)} />}

      {/* Performance debrief */}
      <div>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 12 }}>
          PERFORMANCE DEBRIEF
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label htmlFor="what_worked" style={labelStyle}>WHAT WORKED EXACTLY AS TRAINED</label>
            <textarea
              id="what_worked" name="what_worked" rows={3}
              placeholder="Positions, setups, sequences that landed."
              defaultValue={existing?.whatWorked ?? ''}
              style={flatTextarea}
            />
          </div>
          <div>
            <label htmlFor="what_broke" style={labelStyle}>WHAT BROKE DOWN UNDER PRESSURE</label>
            <textarea
              id="what_broke" name="what_broke" rows={3}
              placeholder="Where did the gap show up."
              defaultValue={existing?.whatBroke ?? ''}
              style={flatTextarea}
            />
          </div>
          <div>
            <label htmlFor="what_surprised" style={labelStyle}>WHAT SURPRISED YOU — GOOD OR BAD</label>
            <textarea
              id="what_surprised" name="what_surprised" rows={3}
              placeholder="Anything you didn't expect."
              defaultValue={existing?.whatSurprised ?? ''}
              style={flatTextarea}
            />
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.04em', color: C.dimmer, marginTop: 10 }}>
          THESE RESPONSES ARE ENCRYPTED. ONLY YOU CAN READ THEM.
        </p>
      </div>

      {/* Drill priorities */}
      <div>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 12 }}>
          DRILL PRIORITIES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label htmlFor="drill_priority_1" style={labelStyle}>THE ONE POSITION TO OWN BEFORE THE NEXT COMP</label>
            <input
              id="drill_priority_1" name="drill_priority_1" type="text"
              placeholder="Be specific."
              defaultValue={existing?.drillPriority1 ?? ''}
              style={flatInput}
            />
          </div>
          <div>
            <label htmlFor="drill_priority_2" style={labelStyle}>SECONDARY FOCUS (OPTIONAL)</label>
            <input
              id="drill_priority_2" name="drill_priority_2" type="text"
              defaultValue={existing?.drillPriority2 ?? ''}
              style={flatInput}
            />
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.04em', color: C.dimmer, marginTop: 10 }}>
          THESE RESURFACE AS COACHING CUES IN YOUR TRAINING FLOW.
        </p>
      </div>

      {/* Physical + mental read */}
      <div>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 16 }}>
          PHYSICAL + MENTAL READ
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <LevelSelect label="GAS TANK BY END OF DAY"   value={fatigue}      onChange={setFatigue} />
          <LevelSelect label="MENTAL STATE WALKING IN"  value={mentalPre}    onChange={setMentalPre} />
          <LevelSelect label="MENTAL STATE MID-MATCH"   value={mentalDuring} onChange={setMentalDuring} />
        </div>
      </div>

      {/* Injury flag */}
      <div>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 10 }}>
          INJURY
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { value: false, label: 'NO' },
            { value: true,  label: 'YES — GOT HURT' },
          ].map((opt) => {
            const selected = injuryFlag === opt.value;
            const accent = opt.value ? C.brick : C.green;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setInjuryFlag(opt.value)}
                style={{
                  flex: 1, padding: '9px 0',
                  background: selected ? accent : 'transparent',
                  border: `1px solid ${selected ? accent : C.border}`,
                  color: selected ? C.bg : C.dim,
                  fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.1em',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next comp */}
      <div>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 10 }}>
          NEXT COMP
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { value: false, label: 'NOT YET' },
            { value: true,  label: 'YES — PLANNING ONE' },
          ].map((opt) => {
            const selected = nextComp === opt.value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setNextComp(opt.value)}
                style={{
                  flex: 1, padding: '9px 0',
                  background: selected ? C.amber : 'transparent',
                  border: `1px solid ${selected ? C.amber : C.border}`,
                  color: selected ? C.bg : C.dim,
                  fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.1em',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        style={{
          width: '100%', padding: '12px 0 10px',
          background: C.amber, border: `1px solid ${C.amber}`,
          color: C.bg, fontFamily: 'var(--font-anton)', fontSize: 16, letterSpacing: '0.1em',
          cursor: 'pointer',
        }}
      >
        SAVE DEBRIEF
      </button>
    </form>
  );
}
