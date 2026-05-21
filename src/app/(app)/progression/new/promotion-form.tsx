'use client';

import { useActionState, useState } from 'react';
import { logPromotionAction, type PromotionState } from './actions';

const C = {
  bg:      '#1A1713',
  surface: '#252118',
  border:  'rgba(245,240,232,0.13)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.55)',
  dimmer:  'rgba(245,240,232,0.35)',
  amber:   '#D4922E',
  amberLow:'rgba(201,130,42,0.35)',
  brick:   '#8B3A1E',
};

type Discipline = {
  id: string;
  discipline: string;
  rank_color: string | null;
  stripes: number;
};

const DISCIPLINE_LABELS: Record<string, string> = {
  bjj: 'BJJ', mma: 'MMA', boxing: 'BOXING', muay_thai: 'MUAY THAI',
  wrestling: 'WRESTLING', judo: 'JUDO', kickboxing: 'KICKBOXING',
};

const BJJ_BELTS = ['WHITE BELT', 'BLUE BELT', 'PURPLE BELT', 'BROWN BELT', 'BLACK BELT'];
const BJJ_BELT_VALUES = ['white belt', 'blue belt', 'purple belt', 'brown belt', 'black belt'];

const EVENT_OPTIONS = [
  { value: 'stripe',     label: 'STRIPE',         sub: 'A stripe at your current belt.' },
  { value: 'belt',       label: 'BELT PROMOTION',  sub: 'New belt color. Resets stripes to 0.' },
  { value: 'rank_other', label: 'OTHER RANK',      sub: 'Free-text rank name (non-BJJ, special titles).' },
] as const;

const initialState: PromotionState = {};

const flatInput: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: '#1A1713', border: `1px solid rgba(245,240,232,0.14)`,
  color: '#F5F0E8', fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em',
  padding: '10px 12px', outline: 'none',
};

export function PromotionForm({ disciplines, today }: { disciplines: Discipline[]; today: string }) {
  const [state, formAction, pending] = useActionState(logPromotionAction, initialState);
  const [eventType, setEventType] = useState<'stripe' | 'belt' | 'rank_other'>('stripe');
  const [disciplineId, setDisciplineId] = useState<string>(
    disciplines.find((d) => d.discipline === 'bjj')?.id ?? disciplines[0]?.id ?? ''
  );
  const [stripeCount, setStripeCount] = useState<number | null>(null);

  const selectedDiscipline = disciplines.find((d) => d.id === disciplineId);
  const isBjj = selectedDiscipline?.discipline === 'bjj';

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Discipline */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
          DISCIPLINE
        </div>
        <select
          name="disciplineId"
          required
          value={disciplineId}
          onChange={(e) => setDisciplineId(e.target.value)}
          style={{ ...flatInput, appearance: 'none' as const }}
        >
          {disciplines.map((d) => (
            <option key={d.id} value={d.id}>
              {DISCIPLINE_LABELS[d.discipline] ?? d.discipline.toUpperCase()}
              {d.rank_color ? ` — ${d.rank_color.toUpperCase()}` : ''}
              {d.stripes ? `, ${d.stripes}S` : ''}
            </option>
          ))}
        </select>
        {state.fieldErrors?.disciplineId && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.disciplineId}
          </p>
        )}
      </div>

      {/* Event type */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 8 }}>
          EVENT TYPE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {EVENT_OPTIONS.map((opt) => {
            const selected = eventType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setEventType(opt.value)}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 4,
                  padding: '12px 14px', textAlign: 'left', cursor: 'pointer',
                  background: selected ? C.surface : 'transparent',
                  border: `1px solid ${selected ? C.amber : C.border}`,
                  borderLeft: `3px solid ${selected ? C.amber : C.border}`,
                }}
              >
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.12em', color: selected ? C.amber : C.dim }}>
                  {opt.label}
                </span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.04em', lineHeight: 1.5, color: C.dimmer }}>
                  {opt.sub}
                </span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="eventType" value={eventType} />
        {state.fieldErrors?.eventType && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.eventType}
          </p>
        )}
      </div>

      {/* Stripe count */}
      {eventType === 'stripe' && (
        <div>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 8 }}>
            NEW STRIPE COUNT
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setStripeCount(n)}
                style={{
                  width: 52, height: 52,
                  background: stripeCount === n ? C.amber : 'transparent',
                  border: `1px solid ${stripeCount === n ? C.amber : C.border}`,
                  color: stripeCount === n ? C.bg : C.dim,
                  fontFamily: 'var(--font-anton)', fontSize: 20, letterSpacing: '0.04em',
                  cursor: 'pointer',
                }}
              >
                {n}
              </button>
            ))}
          </div>
          {stripeCount && <input type="hidden" name="stripeCount" value={stripeCount} />}
          {state.fieldErrors?.stripeCount && (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
              {state.fieldErrors.stripeCount}
            </p>
          )}
        </div>
      )}

      {/* Belt rank */}
      {eventType === 'belt' && (
        <div>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
            NEW BELT
          </div>
          {isBjj ? (
            <select name="beltRank" required style={{ ...flatInput, appearance: 'none' as const }} defaultValue="">
              <option value="">— PICK ONE —</option>
              {BJJ_BELTS.map((b, i) => (
                <option key={b} value={BJJ_BELT_VALUES[i]}>{b}</option>
              ))}
            </select>
          ) : (
            <input
              name="beltRank"
              type="text"
              required
              maxLength={50}
              placeholder="e.g., yellow band, level 2"
              style={flatInput}
            />
          )}
          {state.fieldErrors?.beltRank && (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
              {state.fieldErrors.beltRank}
            </p>
          )}
        </div>
      )}

      {/* Other rank */}
      {eventType === 'rank_other' && (
        <div>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
            RANK NAME
          </div>
          <input
            name="otherRank"
            type="text"
            required
            maxLength={100}
            placeholder="e.g., instructor, coach, prajioud"
            style={flatInput}
          />
          {state.fieldErrors?.otherRank && (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
              {state.fieldErrors.otherRank}
            </p>
          )}
        </div>
      )}

      {/* Awarded on */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
          AWARDED ON
        </div>
        <input
          name="awardedOn"
          type="date"
          required
          defaultValue={today}
          max={today}
          style={flatInput}
        />
        {state.fieldErrors?.awardedOn && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.awardedOn}
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
          NOTES (OPTIONAL)
        </div>
        <textarea
          name="notes"
          rows={2}
          maxLength={1000}
          placeholder="Who awarded it, where, anything to remember."
          style={{ ...flatInput, resize: 'none' as const }}
        />
        {state.fieldErrors?.notes && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.notes}
          </p>
        )}
      </div>

      {state.error && (
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick }} role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          width: '100%', padding: '12px 0 10px',
          background: !pending ? C.amber : 'transparent',
          border: `1px solid ${!pending ? C.amber : C.border}`,
          color: !pending ? C.bg : C.dimmer,
          fontFamily: 'var(--font-anton)', fontSize: 16, letterSpacing: '0.1em',
          cursor: !pending ? 'pointer' : 'default',
        }}
      >
        {pending ? 'SAVING…' : 'LOG PROMOTION'}
      </button>
    </form>
  );
}
