'use client';

import { useActionState, useEffect, useMemo, useRef, useState } from 'react';
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
  mid:      '#D8D2C8',
  midLow:   '#B8B2A8',
  brick:    '#A83030',
  line:     'rgba(245,240,232,0.5)',
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

const CHAIN_RESULTS = [
  { value: 'finished',     label: 'FINISHED' },
  { value: 'defended',     label: 'DEFENDED' },
  { value: 'escaped',      label: 'ESCAPED' },
  { value: 'transitioned', label: 'TRANS' },
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
type RollRow = { id: number; partner: string };

// ── Main form ────────────────────────────────────────────────────────────────
type ActiveInjury = { id: string; body_region: string; side: string | null };

export function LogForm({ tags, activeInjuries = [] }: { tags: TagOption[]; activeInjuries?: ActiveInjury[] }) {
  type ChainStep = { id: number; position: string; technique: string; result: string };
  type CustomEntry = { localId: number; name: string };

  const [state, formAction, pending] = useActionState(logSessionAction, initialState);

  // Draft persistence — keyed by date so yesterday's draft never restores
  const draftKey = `cl-log-draft-${new Date().toISOString().slice(0, 10)}`;

  // ── State — all initialised with safe SSR defaults (no localStorage reads here).
  // Reading localStorage in useState initialisers causes React 19 hydration mismatches
  // because the server renders with undefined-window fallbacks but the client sees real
  // localStorage data. Draft restoration happens in a useEffect below (client-only).
  const [rolls, setRolls]           = useState<RollRow[]>([]);
  // Separate state for partner name inputs — prevents full-form re-render + localStorage
  // write on every keystroke, which dismisses the iOS keyboard mid-type.
  // Syncs back into rolls on blur only.
  const [partnerNames, setPartnerNames] = useState<Record<number, string>>({});
  const [rollChains, setRollChains] = useState<Record<number, ChainStep[]>>({});
  const [chainOpen, setChainOpen]   = useState<Record<number, boolean>>({});
  const [pickerOpen, setPickerOpen] = useState(false);
  const [customEntries, setCustomEntries] = useState<CustomEntry[]>([]);

  function addChainStep(rollId: number) {
    setRollChains(prev => ({
      ...prev,
      [rollId]: [...(prev[rollId] ?? []), { id: Date.now(), position: '', technique: '', result: 'finished' }],
    }));
  }
  function removeChainStep(rollId: number, stepId: number) {
    setRollChains(prev => ({ ...prev, [rollId]: (prev[rollId] ?? []).filter(s => s.id !== stepId) }));
  }
  function updateChainStep(rollId: number, stepId: number, field: keyof ChainStep, value: string) {
    setRollChains(prev => ({
      ...prev,
      [rollId]: (prev[rollId] ?? []).map(s => s.id === stepId ? { ...s, [field]: value } : s),
    }));
  }
  const [query, setQuery]           = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sessionType, setSessionType] = useState<string>('gi');
  const [energy, setEnergy]           = useState<number>(6);
  const [intensity, setIntensity]     = useState<number>(6);
  // Empty string on server; set to current time + draft restore in useEffect below
  const [sessionTime, setSessionTime] = useState<string>('');

  // Restore draft from localStorage after hydration (client-only, runs once)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      const now = new Date();
      const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (!raw) { setSessionTime(defaultTime); return; }
      const p = JSON.parse(raw);
      if (Array.isArray(p.rolls))         setRolls(p.rolls);
      if (p.rollChains)                   setRollChains(p.rollChains);
      if (Array.isArray(p.customEntries)) setCustomEntries(p.customEntries);
      if (Array.isArray(p.selectedIds))   setSelectedIds(p.selectedIds);
      if (p.sessionType)                  setSessionType(p.sessionType);
      if (typeof p.energy === 'number')   setEnergy(p.energy);
      if (typeof p.intensity === 'number') setIntensity(p.intensity);
      setSessionTime(p.sessionTime ?? defaultTime);
    } catch {
      const now = new Date();
      setSessionTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save draft to localStorage on every relevant state change
  useEffect(() => {
    if (!sessionTime) return; // skip the server-render pass before hydration
    try {
      localStorage.setItem(draftKey, JSON.stringify({
        rolls, rollChains, customEntries, sessionType, energy, intensity, sessionTime, selectedIds,
      }));
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolls, rollChains, customEntries, sessionType, energy, intensity, sessionTime, selectedIds]);

  // Clear draft on successful submit
  useEffect(() => {
    if (state.ok) {
      try { localStorage.removeItem(draftKey); } catch {}
    }
  }, [state.ok, draftKey]);

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
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* ── Injury follow-up banner ───────────────────────────────────────── */}
      {activeInjuries.length > 0 && (
        <div style={{
          margin: '16px 22px 0',
          borderLeft: `3px solid ${C.brick}`,
          background: 'rgba(168,48,48,0.12)',
          padding: '12px 14px',
        }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.2em', color: C.brick, marginBottom: 6 }}>
            ACTIVE {activeInjuries.length === 1 ? 'INJURY' : 'INJURIES'} — CHECK IN
          </div>
          {activeInjuries.map((inj) => (
            <p key={inj.id} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.6, color: C.midLow, margin: '0 0 2px' }}>
              {inj.body_region.replace(/_/g, ' ').toUpperCase()}{inj.side && inj.side !== 'na' ? ` · ${inj.side.toUpperCase()}` : ''} — still feeling this?
            </p>
          ))}
        </div>
      )}

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

        {/* Who taught */}
        <div style={{ marginTop: 20 }}>
          <FlatField label="WHO TAUGHT">
            <input id="instructorName" name="instructorName" type="text" maxLength={120} placeholder="e.g. Chris, Coach Mike" style={flatInputStyle} />
          </FlatField>
        </div>
      </LogSection>

      {/* ── 02 WHAT YOU WORKED ON ─────────────────────────────────────────── */}
      <LogSection number="02" title="WHAT YOU WORKED ON">

        {/* Selected technique chips */}
        {(selectedTags.length > 0 || customEntries.length > 0) && (
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
            {customEntries.map((c) => (
              <button
                key={c.localId}
                type="button"
                onClick={() => setCustomEntries((prev) => prev.filter((x) => x.localId !== c.localId))}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: C.bgRaised,
                  border: `1px solid ${C.midLow}`,
                  color: C.mid,
                  padding: '5px 10px',
                  fontFamily: 'var(--font-bebas)',
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                }}
              >
                {c.name.toUpperCase()} · CUSTOM <X size={9} />
              </button>
            ))}
          </div>
        )}
        {selectedIds.map((id) => (
          <input key={id} type="hidden" name="techniqueId" value={id} />
        ))}
        {customEntries.map((c) => (
          <input key={c.localId} type="hidden" name="customTechnique" value={c.name} />
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
                  fontSize: 16,
                  letterSpacing: '0.08em',
                  padding: '6px 0',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ maxHeight: 260, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {orderedKeys.length === 0 && !query.trim() && (
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.midLow }}>Type to search.</span>
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

              {/* Custom entry — always show when there's a query */}
              {query.trim().length > 0 && (
                <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => {
                      const name = query.trim();
                      if (!name) return;
                      if (customEntries.some((c) => c.name.toLowerCase() === name.toLowerCase())) return;
                      setCustomEntries((prev) => [...prev, { localId: Date.now(), name }]);
                      setQuery('');
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderLeft: `2px solid ${C.midLow}`,
                      padding: '7px 12px',
                      color: C.mid,
                      fontFamily: 'var(--font-bebas)',
                      fontSize: 12,
                      letterSpacing: '0.16em',
                      cursor: 'pointer',
                    }}
                  >
                    + ADD &ldquo;{query.trim()}&rdquo; — SUBMIT FOR REVIEW
                  </button>
                  <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.midLow, letterSpacing: '0.08em', marginTop: 6, paddingLeft: 14 }}>
                    Not in the library yet. We&apos;ll review it.
                  </p>
                </div>
              )}
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
                  onClick={() => {
                    setRolls((rs) => rs.filter((x) => x.id !== r.id));
                    setPartnerNames((prev) => { const next = { ...prev }; delete next[r.id]; return next; });
                  }}
                  style={{ background: 'none', border: 'none', color: C.brick, fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', cursor: 'pointer' }}
                >
                  REMOVE
                </button>
              </div>

              <FlatField label="PARTNER">
                <input
                  name={`rolls[${idx}].partner`}
                  type="text"
                  maxLength={80}
                  placeholder="e.g. blue belt, bigger"
                  value={partnerNames[r.id] ?? r.partner}
                  onChange={(e) => setPartnerNames((prev) => ({ ...prev, [r.id]: e.target.value }))}
                  onBlur={(e) => setRolls((rs) => rs.map((x) => x.id === r.id ? { ...x, partner: e.target.value } : x))}
                  style={flatInputStyle}
                />
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
                <textarea name={`rolls[${idx}].felt`} maxLength={2000} placeholder="lost guard early · swept twice" rows={4} style={{ ...flatInputStyle, resize: 'none' }} />
              </FlatField>

              {/* ── Submission chain ── */}
              {(rollChains[r.id] ?? []).map((step, sIdx) => (
                <div key={step.id} style={{ display: 'none' }}>
                  <input type="hidden" name={`rolls[${idx}].chain[${sIdx}].position`} value={step.position} />
                  <input type="hidden" name={`rolls[${idx}].chain[${sIdx}].technique`} value={step.technique} />
                  <input type="hidden" name={`rolls[${idx}].chain[${sIdx}].result`} value={step.result} />
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 4, paddingTop: 12 }}>
                <button
                  type="button"
                  onClick={() => {
                    setChainOpen(prev => ({ ...prev, [r.id]: !prev[r.id] }));
                    if (!(rollChains[r.id] ?? []).length) addChainStep(r.id);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderLeft: `2px solid ${C.midLow}`,
                    padding: '6px 12px',
                    color: C.mid,
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    cursor: 'pointer',
                  }}
                >
                  {chainOpen[r.id] ? 'HIDE CHAIN' : '+ SUBMISSION CHAIN'}
                </button>

                {chainOpen[r.id] && (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {(rollChains[r.id] ?? []).map((step, sIdx) => (
                      <div key={step.id} style={{ background: C.bgSunk, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.midLow, letterSpacing: '0.12em' }}>STEP {sIdx + 1}</span>
                          <button type="button" onClick={() => removeChainStep(r.id, step.id)} style={{ background: 'none', border: 'none', color: C.brick, fontFamily: 'var(--font-dm-mono)', fontSize: 9, cursor: 'pointer', letterSpacing: '0.1em' }}>REMOVE</button>
                        </div>
                        <select value={step.result} onChange={(e) => updateChainStep(r.id, step.id, 'result', e.target.value)} style={{ ...flatInputStyle, fontSize: 13 }}>
                          {CHAIN_RESULTS.map((cr) => <option key={cr.value} value={cr.value}>{cr.label}</option>)}
                        </select>
                      </div>
                    ))}
                    <button type="button" onClick={() => addChainStep(r.id)} style={{ background: 'transparent', border: 'none', borderLeft: `2px solid ${C.midLow}`, padding: '6px 12px', color: C.mid, fontFamily: 'var(--font-bebas)', fontSize: 11, letterSpacing: '0.14em', cursor: 'pointer' }}>+ ADD STEP</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setRolls((rs) => [...rs, { id: Date.now(), partner: '' }])}
          style={{
            marginTop: 10,
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
          + ADD ROLL
        </button>
      </LogSection>

      {/* ── 04 HOW IT FELT ────────────────────────────────────────────────── */}
      <LogSection number="04" title="HOW IT FELT">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <TapScale label="ENERGY" name="energy" value={energy} onChange={setEnergy} color={C.amber} />
          <TapScale label="INTENSITY" name="intensity" value={intensity} onChange={setIntensity} color={C.brick} />
        </div>
      </LogSection>

      {/* ── 05 PROOF BANK + REFLECTION ────────────────────────────────────── */}
      <LogSection number="05" title="REFLECTION" optional>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FlatField label="SKILLS EXECUTED WELL">
            <textarea
              name="skillsExecuted"
              maxLength={2000}
              placeholder="1–3 specific things you executed. Builds your pre-comp confidence file."
              rows={3}
              style={{ ...flatInputStyle, resize: 'none' }}
            />
          </FlatField>
          <div style={{
            height: 1,
            background: 'rgba(245,240,232,0.08)',
            margin: '4px 0',
          }} />
          <FlatField label="WHAT CLICKED">
            <textarea name="whatClicked" maxLength={2000} placeholder="One technique or concept that landed." rows={2} style={{ ...flatInputStyle, resize: 'none' }} />
          </FlatField>
          <FlatField label="WHAT TO FIX">
            <textarea name="whatDidnt" maxLength={2000} placeholder="One thing that broke down — be specific." rows={2} style={{ ...flatInputStyle, resize: 'none' }} />
          </FlatField>
          <FlatField label="QUESTION FOR COACH">
            <textarea name="questionForCoach" maxLength={500} placeholder="Something to ask next time." rows={1} style={{ ...flatInputStyle, resize: 'none' }} />
          </FlatField>
          <FlatField label="FOLLOW-UP NOTES">
            <textarea name="followUpNotes" maxLength={2000} placeholder="Anything else worth noting." rows={2} style={{ ...flatInputStyle, resize: 'none' }} />
          </FlatField>
        </div>
      </LogSection>

      {state.error && (
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, padding: '0 22px 16px' }}>
          {state.error}
        </p>
      )}

      {/* ── Submit ────────────────────────────────────────────────────────── */}
      <div style={{ padding: '8px 22px 40px' }}>
        <button
          type="submit"
          disabled={pending}
          style={{
            width: '100%',
            padding: '16px',
            background: pending ? 'rgba(201,130,42,0.4)' : C.amber,
            color: C.bg,
            border: 'none',
            fontFamily: 'var(--font-bebas)',
            fontSize: 18,
            letterSpacing: '0.22em',
            cursor: pending ? 'default' : 'pointer',
            transition: 'background 120ms',
          }}
        >
          {pending ? 'SAVING…' : 'LOG SESSION'}
        </button>
      </div>

    </form>
  );
}

// ── Helper sub-components ────────────────────────────────────────────────────

function LogSection({ number, title, optional, children }: { number: string; title: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <section style={{ borderTop: `1px solid ${C.line}`, padding: '22px 22px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.18em', color: C.midLow }}>{number}</span>
        <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.22em', color: C.text }}>{title}</span>
        {optional && <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.12em', color: C.midLow }}>OPTIONAL</span>}
        <div style={{ flex: 1, height: 1, background: C.lineHard }} />
      </div>
      {children}
    </section>
  );
}

function FlatField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span style={labelStyle}>{label}</span>
      {children}
    </div>
  );
}

function RollSegment({ name, options, defaultValue }: { name: string; options: { value: string; label: string }[]; defaultValue: string }) {
  const [selected, setSelected] = useState(defaultValue);
  return (
    <>
      <div style={{ display: 'flex', background: C.bgSunk, gap: 1 }}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setSelected(o.value)}
            style={{
              flex: 1,
              padding: '10px 4px',
              background: selected === o.value ? C.amber : 'transparent',
              color: selected === o.value ? C.bg : C.midLow,
              border: 'none',
              fontFamily: 'var(--font-bebas)',
              fontSize: 11,
              letterSpacing: '0.12em',
              cursor: 'pointer',
              transition: 'background 80ms, color 80ms',
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={selected} />
    </>
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
