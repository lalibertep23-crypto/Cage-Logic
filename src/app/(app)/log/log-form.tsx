'use client';

import { useActionState, useMemo, useState } from 'react';
import { logSessionAction, type LogState } from './actions';
import { X } from 'lucide-react';

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:       '#1A1713',
  bgRaised: '#252118',
  bgSunk:   '#13110E',
  amber:    '#D4922E',
  amberLow: '#7A4F1A',
  green:    '#3D8B55',
  text:     '#F5F0E8',
  mid:      '#AA9A88',
  midLow:   '#7A6E60',
  brick:    '#A83030',
  line:     'rgba(245,240,232,0.08)',
  lineHard: 'rgba(245,240,232,0.16)',
};

// ── Shared style objects ─────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-bebas)',
  fontSize: 13,
  letterSpacing: '0.22em',
  color: C.midLow,
  display: 'block',
  marginBottom: 6,
};

const flatInputStyle: React.CSSProperties = {
  background: C.bgRaised,
  border: 'none',
  borderBottom: `1px solid ${C.lineHard}`,
  padding: '10px 12px',
  color: C.text,
  fontFamily: 'var(--font-dm-mono)',
  fontSize: 16, // 16px minimum prevents iOS Safari auto-zoom which blocks keyboard input
  letterSpacing: '0.04em',
  outline: 'none',
  width: '100%',
};

// ── Option sets ──────────────────────────────────────────────────────────────
const SESSION_TYPES = [
  { value: 'gi',         label: 'GI' },
  { value: 'no_gi',      label: 'NO-GI' },
  { value: 'drilling',   label: 'DRILL' },
  { value: 'open_mat',   label: 'OPEN MAT' },
  { value: 'comp_class', label: 'COMP' },
];

const OUTCOMES = [
  { value: 'tapped_them', label: 'TAPPED THEM' },
  { value: 'got_tapped',  label: 'GOT TAPPED' },
  { value: 'draw',        label: 'DRAW' },
  { value: 'positional',  label: 'POSITIONAL' },
];

const SIZES = [
  { value: 'smaller', label: 'SMALLER' },
  { value: 'same',    label: 'SAME' },
  { value: 'bigger',  label: 'BIGGER' },
];

export type TagOption = {
  id: string;
  slug: string;
  label: string;
  position: string | null;
  category: string | null;
  side: string;
};

// Group key = position + side (when not neutral), e.g. "half_guard_top"
function groupKey(t: TagOption): string {
  const pos = t.position ?? '__null__';
  if (t.side && t.side !== 'neutral') return `${pos}_${t.side}`;
  return pos;
}

const POSITION_ORDER = [
  'standup',
  'closed_guard',
  'open_guard',
  'half_guard_bottom', 'half_guard_top',
  'side_control_bottom', 'side_control_top',
  'mount_bottom', 'mount_top',
  'back_top', 'back_bottom',
  'turtle_bottom', 'turtle_top',
  '__null__',
] as const;

const POSITION_LABEL: Record<string, string> = {
  standup:           'STANDUP',
  closed_guard:      'CLOSED GUARD',
  open_guard:        'OPEN GUARD',
  half_guard_top:    'HALF GUARD — TOP',
  half_guard_bottom: 'HALF GUARD — BOTTOM',
  half_guard:        'HALF GUARD',
  side_control_top:  'SIDE CONTROL — TOP',
  side_control_bottom:'SIDE CONTROL — BOTTOM',
  side_control:      'SIDE CONTROL',
  mount_top:         'MOUNT — TOP',
  mount_bottom:      'MOUNT — BOTTOM',
  mount:             'MOUNT',
  back_top:          'BACK — TAKING',
  back_bottom:       'BACK — DEFENDING',
  back:              'BACK',
  turtle_top:        'TURTLE — ATTACKING',
  turtle_bottom:     'TURTLE — DEFENDING',
  turtle:            'TURTLE',
  __null__:          'OTHER',
};

const initialState: LogState = {};
type RollRow = { id: number };

// ── Main form ────────────────────────────────────────────────────────────────
export function LogForm({ tags }: { tags: TagOption[] }) {
  const [state, formAction, pending] = useActionState(logSessionAction, initialState);
  const [rolls, setRolls]           = useState<RollRow[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery]           = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sessionType, setSessionType] = useState('gi');
  const [energy, setEnergy]           = useState(6);
  const [intensity, setIntensity]     = useState(6);
  const [sessionTime, setSessionTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  const today = new Date().toISOString().slice(0, 10);

  const tagById = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);
  const selectedTags = useMemo(
    () => selectedIds.map((id) => tagById.get(id)).filter((x): x is TagOption => !!x),
    [selectedIds, tagById]
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tags.filter((t) => {
      if (selectedIds.includes(t.id)) return false;
      if (!q) return true;
      return t.label.toLowerCase().includes(q);
    });
  }, [tags, query, selectedIds]);
  const grouped = useMemo(() => {
    const m = new Map<string, TagOption[]>();
    for (const t of filtered) {
      const key = groupKey(t);
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(t);
    }
    return m;
  }, [filtered]);
  const orderedKeys = (POSITION_ORDER as readonly string[])
    .filter((k) => grouped.has(k))
    .concat(Array.from(grouped.keys()).filter((k) => !(POSITION_ORDER as readonly string[]).includes(k)));

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', background: C.bg, minHeight: '100vh' }}>

      {/* ── 01 WHEN + WHERE ───────────────────────────────────────────────── */}
      <LogSection number="01" title="WHEN + WHERE">

        {/* Date + Time row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FlatField label="DATE">
            <input id="sessionDate" name="sessionDate" type="date" defaultValue={today} required style={flatInputStyle} />
          </FlatField>
          <FlatField label="START TIME">
            <input
              id="startTime" name="startTime" type="time"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
              style={flatInputStyle}
            />
          </FlatField>
        </div>

        {/* Session type — flat tap segments, no dropdown */}
        <div style={{ marginTop: 20 }}>
          <span style={labelStyle}>SESSION TYPE</span>
          <div style={{ display: 'flex', background: C.bgSunk, gap: 1, marginTop: 6 }}>
            {SESSION_TYPES.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setSessionType(o.value)}
                style={{
                  flex: 1,
                  padding: '12px 2px',
                  background: sessionType === o.value ? C.amber : 'transparent',
                  color: sessionType === o.value ? C.bg : C.midLow,
                  fontFamily: 'var(--font-bebas)',
                  fontSize: 12,
                  letterSpacing: '0.14em',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 100ms, color 100ms',
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
          <input type="hidden" name="sessionType" value={sessionType} />
        </div>

        {/* Duration */}
        <div style={{ marginTop: 20 }}>
          <FlatField label="DURATION (MIN)">
            <input id="durationMinutes" name="durationMinutes" type="number" min={1} max={600} defaultValue={60} required style={flatInputStyle} />
          </FlatField>
          {state.fieldErrors?.durationMinutes && (
            <p style={{ color: C.brick, fontFamily: 'var(--font-dm-mono)', fontSize: 10, marginTop: 4 }}>
              {state.fieldErrors.durationMinutes}
            </p>
          )}
        </div>
      </LogSection>

      {/* ── 02 WHAT YOU WORKED ON ─────────────────────────────────────────── */}
      <LogSection number="02" title="WHAT YOU WORKED ON">

        {/* Selected technique chips */}
        {selectedTags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {selectedTags.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedIds((ids) => ids.filter((x) => x !== t.id))}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: C.bgRaised,
                  border: `1px solid ${C.amberLow}`,
                  color: C.amber,
                  padding: '5px 10px',
                  fontFamily: 'var(--font-bebas)',
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                }}
              >
                {t.label.toUpperCase()} <X size={9} />
              </button>
            ))}
          </div>
        )}
        {selectedIds.map((id) => (
          <input key={id} type="hidden" name="techniqueId" value={id} />
        ))}

        {/* Toggle picker */}
        <button
          type="button"
          onClick={() => setPickerOpen((o) => !o)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'transparent',
            border: 'none',
            borderLeft: `2px solid ${pickerOpen ? C.amber : C.amberLow}`,
            padding: '8px 14px',
            color: pickerOpen ? C.amber : C.mid,
            fontFamily: 'var(--font-bebas)',
            fontSize: 13,
            letterSpacing: '0.18em',
            cursor: 'pointer',
            transition: 'color 120ms, border-color 120ms',
          }}
        >
          {pickerOpen
            ? '— HIDE LIST'
            : selectedTags.length > 0
              ? `+ ADD MORE · ${selectedTags.length} SELECTED`
              : '+ ADD TECHNIQUES'}
        </button>

        {/* Technique picker */}
        {pickerOpen && (
          <div style={{ marginTop: 10, background: C.bgSunk }}>
            <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.line}` }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="kne · sweep · rnc · guillotine"
                autoFocus
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${C.lineHard}`,
                  color: C.text,
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  padding: '6px 0',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ maxHeight: 260, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {orderedKeys.length === 0 && (
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.midLow }}>No match.</span>
              )}
              {orderedKeys.map((key) => {
                const items = grouped.get(key) ?? [];
                if (!items.length) return null;
                return (
                  <div key={key}>
                    <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 11, letterSpacing: '0.28em', color: C.midLow, marginBottom: 8 }}>
                      {POSITION_LABEL[key] ?? key}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {items.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedIds((ids) => [...ids, t.id])}
                          style={{
                            background: C.bgRaised,
                            border: `1px solid ${C.lineHard}`,
                            borderRadius: 0,
                            color: C.text,
                            padding: '6px 10px',
                            fontFamily: 'var(--font-bebas)',
                            fontSize: 12,
                            letterSpacing: '0.06em',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ color: C.amber, marginRight: 4 }}>+</span>{t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </LogSection>

      {/* ── 03 ROLLS ──────────────────────────────────────────────────────── */}
      <LogSection number="03" title="ROLLS" optional>
        {rolls.length === 0 && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.midLow, letterSpacing: '0.08em', marginBottom: 10 }}>
            Add one per round you remember.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rolls.map((r, idx) => (
            <div key={r.id} style={{ background: C.bgRaised, borderLeft: `2px solid ${C.lineHard}`, padding: '14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.midLow, letterSpacing: '0.14em' }}>
                  ROLL {String(idx + 1).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => setRolls((rs) => rs.filter((x) => x.id !== r.id))}
                  style={{ background: 'none', border: 'none', color: C.brick, fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', cursor: 'pointer' }}
                >
                  REMOVE
                </button>
              </div>

              <FlatField label="PARTNER">
                <input name={`rolls[${idx}].partner`} type="text" maxLength={80} placeholder="e.g. blue belt, bigger" style={flatInputStyle} />
              </FlatField>

              <div>
                <span style={labelStyle}>SIZE</span>
                <RollSegment name={`rolls[${idx}].size`} options={SIZES} defaultValue="same" />
              </div>

              <div>
                <span style={labelStyle}>OUTCOME</span>
                <RollSegment name={`rolls[${idx}].outcome`} options={OUTCOMES} defaultValue="positional" />
              </div>

              <FlatField label="WHAT IT FELT LIKE">
                <textarea name={`rolls[${idx}].felt`} maxLength={2000} placeholder="lost guard early · swept twice" rows={2} style={{ ...flatInputStyle, resize: 'none' }} />
              </FlatField>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setRolls((rs) => rs.length >= 12 ? rs : [...rs, { id: Date.now() + rs.length }])}
          style={{
            marginTop: 12,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'transparent',
            border: 'none',
            borderLeft: `2px solid ${C.amberLow}`,
            padding: '8px 14px',
            color: C.mid,
            fontFamily: 'var(--font-bebas)',
            fontSize: 13,
            letterSpacing: '0.18em',
            cursor: 'pointer',
          }}
        >
          + ADD A ROLL
        </button>
      </LogSection>

      {/* ── 04 HOW IT WENT ────────────────────────────────────────────────── */}
      <LogSection number="04" title="HOW IT WENT">

        {/* Energy tap scale */}
        <div style={{ marginBottom: 20 }}>
          <span style={labelStyle}>ENERGY</span>
          <TapScale value={energy} onChange={setEnergy} name="energy" color={C.amber} />
        </div>

        {/* Intensity tap scale */}
        <div style={{ marginBottom: 20 }}>
          <span style={labelStyle}>INTENSITY</span>
          <TapScale value={intensity} onChange={setIntensity} name="intensity" color={C.brick} />
        </div>

        <FlatField label="WHAT CLICKED THIS SESSION">
          <textarea id="whatClicked" name="whatClicked" rows={2} maxLength={2000} placeholder="One technique or concept that landed today." style={{ ...flatInputStyle, resize: 'none' }} />
        </FlatField>

        <div style={{ marginTop: 16 }}>
          <FlatField label="WHAT TO FIX NEXT TIME">
            <textarea id="whatDidnt" name="whatDidnt" rows={2} maxLength={2000} placeholder="One thing that broke down — be specific." style={{ ...flatInputStyle, resize: 'none' }} />
          </FlatField>
        </div>

        <div style={{ marginTop: 16 }}>
          <FlatField label="QUESTION FOR COACH">
            <input id="questionForCoach" name="questionForCoach" type="text" maxLength={500} style={flatInputStyle} />
          </FlatField>
        </div>
      </LogSection>

      {/* Error */}
      {state.error && (
        <div style={{ padding: '0 22px 12px' }}>
          <div style={{ borderLeft: `2px solid ${C.brick}`, background: C.bgRaised, padding: '10px 14px' }}>
            <p style={{ color: C.brick, fontFamily: 'var(--font-dm-mono)', fontSize: 11 }}>{state.error}</p>
          </div>
        </div>
      )}

      {/* Submit */}
      <div style={{ padding: '16px 22px 32px', borderTop: `1px solid ${C.line}` }}>
        <button
          type="submit"
          disabled={pending}
          style={{
            width: '100%',
            background: pending ? C.amberLow : C.amber,
            color: C.bg,
            border: 'none',
            padding: '20px 24px',
            fontFamily: 'var(--font-anton)',
            fontSize: 22,
            letterSpacing: '0.08em',
            cursor: pending ? 'not-allowed' : 'pointer',
            transition: 'background 120ms',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{pending ? 'SAVING...' : 'SAVE SESSION'}</span>
          <svg width={36} height={22} viewBox="0 0 56 32" fill="none">
            <path d="M4 4V28 M14 4V28 M24 4V28 M34 4V28 M2 18L40 12"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"/>
          </svg>
        </button>
      </div>

    </form>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function LogSection({ number, title, optional, children }: {
  number: string; title: string; optional?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{ borderTop: `1px solid ${C.line}`, padding: '22px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.amber, letterSpacing: '0.1em' }}>
          {number}
        </span>
        <div style={{ height: 1, width: 12, background: C.amberLow }} />
        <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.2em', color: C.mid }}>
          {title}
        </span>
        {optional && (
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.midLow, letterSpacing: '0.14em' }}>
            OPTIONAL
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function FlatField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </div>
  );
}

function TapScale({ value, onChange, name, color }: {
  value: number; onChange: (v: number) => void; name: string; color: string;
}) {
  return (
    <>
      <input type="hidden" name={name} value={value} />
      <div style={{ display: 'flex', gap: 2, marginTop: 6 }}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            style={{
              flex: 1,
              height: 38,
              background: n <= value ? color : C.bgSunk,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 9,
              letterSpacing: '0.04em',
              color: n <= value ? C.bg : C.midLow,
              transition: 'background 80ms',
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </>
  );
}

function RollSegment({ name, options, defaultValue }: {
  name: string; options: { value: string; label: string }[]; defaultValue: string;
}) {
  const [val, setVal] = useState(defaultValue);
  return (
    <>
      <input type="hidden" name={name} value={val} />
      <div style={{ display: 'flex', background: C.bgSunk, gap: 1, marginTop: 6 }}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setVal(o.value)}
            style={{
              flex: 1,
              padding: '10px 2px',
              background: val === o.value ? C.amber : 'transparent',
              color: val === o.value ? C.bg : C.midLow,
              fontFamily: 'var(--font-bebas)',
              fontSize: 12,
              letterSpacing: '0.1em',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 100ms, color 100ms',
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </>
  );
}
