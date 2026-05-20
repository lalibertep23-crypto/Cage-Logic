'use client';

import { saveDayOfTimes } from './day-of-actions';

const C = {
  bg: '#1A1713', surface: '#252118', border: 'rgba(245,240,232,0.5)',
  text: '#F5F0E8', dim: 'rgba(245,240,232,0.38)', dimmer: 'rgba(245,240,232,0.22)',
  amber: '#D4922E',
};

const flatInput: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: C.bg, border: `1px solid rgba(245,240,232,0.14)`,
  color: C.text, fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em',
  padding: '10px 12px', outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em',
  color: C.dimmer, marginBottom: 6, display: 'block',
};

export function TimesForm({
  compId,
  weighInTime,
  firstMatchTime,
}: {
  compId: string;
  weighInTime: string | null;
  firstMatchTime: string | null;
}) {
  return (
    <form action={saveDayOfTimes} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <input type="hidden" name="comp_id" value={compId} />

      <div>
        <label htmlFor="weigh_in_time" style={labelStyle}>WEIGH-IN TIME</label>
        <input
          id="weigh_in_time" name="weigh_in_time" type="time"
          defaultValue={weighInTime ?? ''}
          style={flatInput}
        />
      </div>

      <div>
        <label htmlFor="first_match_time" style={labelStyle}>
          FIRST MATCH TIME <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, color: C.dimmer }}>(BRACKET RELEASES THURSDAY)</span>
        </label>
        <input
          id="first_match_time" name="first_match_time" type="time"
          defaultValue={firstMatchTime ?? ''}
          style={flatInput}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: '10px 20px', alignSelf: 'flex-start',
          background: C.amber, border: `1px solid ${C.amber}`,
          color: C.bg, fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.1em',
          cursor: 'pointer',
        }}
      >
        SAVE TIMES
      </button>
    </form>
  );
}
