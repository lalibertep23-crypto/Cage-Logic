'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { editSessionAction, type EditState } from './actions';

const C = {
  bg:       '#1A1713',
  bgRaised: '#252118',
  bgSunk:   '#13110E',
  amber:    '#D4922E',
  amberLow: 'rgba(201,130,42,0.35)',
  text:     '#F5F0E8',
  mid:      '#AA9A88',
  midLow:   '#7A6E60',
  brick:    '#A83030',
  line:     'rgba(245,240,232,0.08)',
  lineHard: 'rgba(245,240,232,0.16)',
};

const SESSION_TYPES = [
  { value: 'gi',         label: 'GI' },
  { value: 'no_gi',      label: 'NO-GI' },
  { value: 'drilling',   label: 'DRILL' },
  { value: 'open_mat',   label: 'OPEN MAT' },
  { value: 'comp_class', label: 'COMP' },
];

const inputStyle: React.CSSProperties = {
  background: C.bgRaised,
  border: 'none',
  borderBottom: `1px solid ${C.lineHard}`,
  padding: '10px 12px',
  color: C.text,
  fontFamily: 'var(--font-dm-mono)',
  fontSize: 16,
  letterSpacing: '0.04em',
  outline: 'none',
  width: '100%',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-bebas)',
  fontSize: 13,
  letterSpacing: '0.22em',
  color: C.midLow,
  display: 'block',
  marginBottom: 6,
};

type Props = {
  id: string;
  session: {
    session_date: string;
    start_time: string;
    session_type: string;
    duration_minutes: number;
    instructor_name: string | null;
    energy_1_10: number;
    intensity_1_10: number;
  };
  reflection: {
    what_clicked: string;
    what_didnt: string;
    question_for_coach: string;
  };
};

export function EditForm({ id, session, reflection }: Props) {
  const boundAction = editSessionAction.bind(null, id);
  const [state, formAction, pending] = useActionState(boundAction, {});

  const [sessionType, setSessionType] = useState(session.session_type);
  const [energy, setEnergy] = useState(session.energy_1_10);
  const [intensity, setIntensity] = useState(session.intensity_1_10);

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.line}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
            EDIT SESSION
          </span>
        </div>
        <Link href={`/history/${id}`} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.midLow, textDecoration: 'none' }}>
          CANCEL
        </Link>
      </div>

      <form action={formAction} style={{ padding: '0 0 24px' }}>

        {/* 01 — WHEN + WHERE */}
        <section style={{ borderTop: `1px solid ${C.line}`, padding: '22px 22px' }}>
          <SectionHeader number="01" title="WHEN + WHERE" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <span style={labelStyle}>DATE</span>
              <input name="sessionDate" type="date" defaultValue={session.session_date} required style={inputStyle} />
            </div>
            <div>
              <span style={labelStyle}>START TIME</span>
              <input name="startTime" type="time" defaultValue={session.start_time} style={inputStyle} />
            </div>
            <div>
              <span style={labelStyle}>SESSION TYPE</span>
              <input type="hidden" name="sessionType" value={sessionType} />
              <div style={{ display: 'flex', gap: 2 }}>
                {SESSION_TYPES.map((t) => (
                  <button key={t.value} type="button" onClick={() => setSessionType(t.value)}
                    style={{
                      flex: 1, padding: '10px 4px',
                      background: sessionType === t.value ? C.amber : C.bgRaised,
                      color: sessionType === t.value ? C.bg : C.mid,
                      border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--font-bebas)', fontSize: 11, letterSpacing: '0.14em',
                    }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span style={labelStyle}>DURATION (MIN)</span>
              <input name="durationMinutes" type="number" min={1} max={600} defaultValue={session.duration_minutes} required style={inputStyle} />
            </div>
            <div>
              <span style={labelStyle}>WHO TAUGHT</span>
              <input name="instructorName" type="text" maxLength={120} defaultValue={session.instructor_name ?? ''} placeholder="e.g. Chris, Coach Mike" style={inputStyle} />
            </div>
          </div>
        </section>

        {/* 02 — HOW IT WENT */}
        <section style={{ borderTop: `1px solid ${C.line}`, padding: '22px 22px' }}>
          <SectionHeader number="02" title="HOW IT WENT" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <TapScale label="ENERGY" name="energyLevel" value={energy} onChange={setEnergy} color={C.amber} />
            <TapScale label="INTENSITY" name="intensityLevel" value={intensity} onChange={setIntensity} color={C.brick} />
          </div>
        </section>

        {/* 03 — REFLECTION */}
        <section style={{ borderTop: `1px solid ${C.line}`, padding: '22px 22px' }}>
          <SectionHeader number="03" title="REFLECTION" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <span style={labelStyle}>WHAT CLICKED</span>
              <textarea name="whatClicked" defaultValue={reflection.what_clicked} maxLength={2000} rows={2} style={{ ...inputStyle, resize: 'none' }} placeholder="One technique or concept that landed." />
            </div>
            <div>
              <span style={labelStyle}>WHAT TO FIX</span>
              <textarea name="whatDidnt" defaultValue={reflection.what_didnt} maxLength={2000} rows={2} style={{ ...inputStyle, resize: 'none' }} placeholder="One thing that broke down — be specific." />
            </div>
            <div>
              <span style={labelStyle}>QUESTION FOR COACH</span>
              <input name="questionForCoach" type="text" defaultValue={reflection.question_for_coach} maxLength={500} style={inputStyle} />
            </div>
          </div>
        </section>

        {state.error && (
          <p style={{ padding: '0 22px', fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick }}>
            {state.error}
          </p>
        )}

        {/* Save */}
        <div style={{ padding: '0 22px', marginTop: 8 }}>
          <button type="submit" disabled={pending} style={{
            width: '100%', background: pending ? C.amberLow : C.amber,
            color: C.bg, border: 'none', padding: '18px 24px',
            fontFamily: 'var(--font-anton)', fontSize: 20, letterSpacing: '0.08em',
            cursor: pending ? 'not-allowed' : 'pointer',
          }}>
            {pending ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>

      </form>
    </main>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.amber, letterSpacing: '0.1em' }}>{number}</span>
      <div style={{ height: 1, width: 12, background: C.amberLow }} />
      <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.2em', color: C.mid }}>{title}</span>
    </div>
  );
}

function TapScale({ label, name, value, onChange, color }: {
  label: string; name: string; value: number; onChange: (v: number) => void; color: string;
}) {
  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <span style={labelStyle}>{label}</span>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)}
            style={{
              flex: 1, height: 38,
              background: n <= value ? color : C.bgSunk,
              border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-dm-mono)', fontSize: 9,
              color: n <= value ? C.bg : C.midLow,
              transition: 'background 80ms',
            }}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
