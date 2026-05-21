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
  mid:      '#D8D2C8',
  midLow:   '#B8B2A8',
  brick:    '#A83030',
  line:     'rgba(245,240,232,0.5)',
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

type TagOption = { id: string; label: string; position: string | null };
type RollOption = { id: string; round_number: number | null; partner_label: string | null; felt: string };

type Props = {
  id: string;
  session: {
    session_date: string;
    start_time: string | null;
    session_type: string | null;
    duration_minutes: number | null;
    instructor_name: string | null;
    energy_1_10: number | null;
    intensity_1_10: number | null;
    what_clicked: string | null;
    what_didnt: string | null;
    question_for_coach: string | null;
  };
  allTags: TagOption[];
  selectedTagIds: string[];
  rolls: RollOption[];
};

export function EditForm({ id, session, allTags, selectedTagIds, rolls }: Props) {
  const boundAction = editSessionAction.bind(null, id);
  const [state, formAction, pending] = useActionState(boundAction, {});

  const [sessionType, setSessionType] = useState(session.session_type ?? 'gi');
  const [energy, setEnergy] = useState(session.energy_1_10 ?? 6);
  const [intensity, setIntensity] = useState(session.intensity_1_10 ?? 6);
  const [tagIds, setTagIds] = useState<string[]>(selectedTagIds);

  function toggleTag(tagId: string) {
    setTagIds((prev) => prev.includes(tagId) ? prev.filter((x) => x !== tagId) : [...prev, tagId]);
  }

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
              <input name="sessionDate" type="date" defaultValue={session.session_date ?? ''} required style={inputStyle} />
            </div>
            <div>
              <span style={labelStyle}>START TIME</span>
              <input name="startTime" type="time" defaultValue={session.start_time ?? ''} style={inputStyle} />
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
              <input name="durationMinutes" type="number" min={1} max={600} defaultValue={session.duration_minutes ?? 60} required style={inputStyle} />
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
              <textarea name="whatClicked" defaultValue={session.what_clicked ?? ''} maxLength={2000} rows={2} style={{ ...inputStyle, resize: 'none' }} placeholder="One technique or concept that landed." />
            </div>
            <div>
              <span style={labelStyle}>WHAT TO FIX</span>
              <textarea name="whatDidnt" defaultValue={session.what_didnt ?? ''} maxLength={2000} rows={2} style={{ ...inputStyle, resize: 'none' }} placeholder="One thing that broke down — be specific." />
            </div>
            <div>
              <span style={labelStyle}>QUESTION FOR COACH</span>
              <input name="questionForCoach" type="text" defaultValue={session.question_for_coach ?? ''} maxLength={500} style={inputStyle} />
            </div>
          </div>
        </section>

        {/* 04 — TECHNIQUES */}
        {allTags.length > 0 && (
          <section style={{ borderTop: `1px solid ${C.line}`, padding: '22px 22px' }}>
            <SectionHeader number="04" title="TECHNIQUES" />
            {/* Hidden inputs for selected tags */}
            {tagIds.map((tid) => (
              <input key={tid} type="hidden" name="tagIds" value={tid} />
            ))}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {allTags.map((t) => {
                const active = tagIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTag(t.id)}
                    style={{
                      padding: '7px 12px',
                      background: active ? C.amber : C.bgRaised,
                      color: active ? C.bg : C.mid,
                      border: `1px solid ${active ? C.amber : C.line}`,
                      fontFamily: 'var(--font-bebas)',
                      fontSize: 11,
                      letterSpacing: '0.14em',
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                    {t.position && (
                      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, marginLeft: 5, opacity: 0.6 }}>
                        {t.position.toUpperCase()}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* 05 — ROLL COMMENTS */}
        {rolls.length > 0 && (
          <section style={{ borderTop: `1px solid ${C.line}`, padding: '22px 22px' }}>
            <SectionHeader number="05" title="ROLLS" />
            <input type="hidden" name="rollCount" value={rolls.length} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rolls.map((r, i) => (
                <div key={r.id} style={{ background: C.bgRaised, borderLeft: `2px solid ${C.lineHard}`, padding: '12px 14px' }}>
                  <input type="hidden" name={`rollId[${i}]`} value={r.id} />
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.14em', color: C.midLow, marginBottom: 8 }}>
                    ROLL {String(r.round_number ?? i + 1).padStart(2, '0')}{r.partner_label ? ` · ${r.partner_label}` : ''}
                  </div>
                  <textarea
                    name={`rollFelt[${i}]`}
                    defaultValue={r.felt ?? ''}
                    rows={3}
                    maxLength={2000}
                    placeholder="How did it feel?"
                    style={{ ...inputStyle, resize: 'none' }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {state.error && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, padding: '0 22px' }}>
            {state.error}
          </p>
        )}

        <div style={{ padding: '16px 22px 40px' }}>
          <button
            type="submit"
            disabled={pending}
            style={{
              width: '100%',
              padding: '15px',
              background: pending ? 'rgba(201,130,42,0.4)' : C.amber,
              color: C.bg,
              border: 'none',
              fontFamily: 'var(--font-bebas)',
              fontSize: 16,
              letterSpacing: '0.22em',
              cursor: pending ? 'default' : 'pointer',
              transition: 'background 120ms',
            }}
          >
            {pending ? 'SAVING…' : 'SAVE CHANGES'}
          </button>
        </div>

      </form>
    </main>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.18em', color: C.midLow }}>{number}</span>
      <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.22em', color: C.text }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: C.lineHard }} />
    </div>
  );
}

function TapScale({ label, name, value, onChange, color }: { label: string; name: string; value: number; onChange: (v: number) => void; color: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={labelStyle}>{label}</span>
        <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, color, letterSpacing: '0.04em', lineHeight: 1 }}>{value}</span>
      </div>
      <div style={{ display: 'flex', background: C.bgSunk, gap: 1 }}>
        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            style={{
              flex: 1, height: 40,
              background: n === value ? color : 'transparent',
              color: n === value ? C.bg : C.midLow,
              border: 'none',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 10,
              cursor: 'pointer',
              transition: 'background 80ms',
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}