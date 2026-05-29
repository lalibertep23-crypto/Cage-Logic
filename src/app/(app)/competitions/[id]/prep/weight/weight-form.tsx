'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { logWeight } from './weight-actions';

const C = {
  bg: '#050505', surface: '#111111', border:  'rgba(242,239,232,0.13)',
  text: '#F2EFE8', dim: 'rgba(242,239,232,0.55)', dimmer: 'rgba(242,239,232,0.35)',
  amber: '#C8943A', green: '#5C8A3C',
};

const flatInput: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: C.bg, border: `1px solid rgba(242,239,232,0.14)`,
  color: C.text, fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em',
  padding: '10px 12px', outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em',
  color: C.dimmer, marginBottom: 6, display: 'block',
};

// ─── Log today's weight (server action) ──────────────────────────────────────
export function LogWeightForm({ compId }: { compId: string }) {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form ref={ref} action={logWeight} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      <input type="hidden" name="comp_id" value={compId} />
      <div style={{ flex: 1 }}>
        <label htmlFor="weight_lbs" style={labelStyle}>TODAY&apos;S WEIGHT (LBS)</label>
        <input
          id="weight_lbs" name="weight_lbs" type="number"
          step="0.1" min="50" max="400" placeholder="155.0" required
          style={flatInput}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: '10px 20px', flexShrink: 0,
          background: C.amber, border: `1px solid ${C.amber}`,
          color: C.bg, fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.1em',
          cursor: 'pointer',
        }}
      >
        LOG
      </button>
    </form>
  );
}

// ─── Set target weight + weigh-in type (client-side Supabase) ────────────────
export function WeighInDetailsForm({
  compId,
  targetWeightLbs,
  weighInType,
}: {
  compId: string;
  targetWeightLbs: number | null;
  weighInType: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [targetValue, setTargetValue] = useState(
    targetWeightLbs != null ? String(targetWeightLbs) : ''
  );
  const [weighInTypeValue, setWeighInTypeValue] = useState(weighInType ?? '');

  async function handleSave() {
    setError(null);
    setSaved(false);
    const supabase = createClient();
    const { error: sbError } = await supabase
      .from('competitions')
      .update({
        target_weight_lbs: targetValue ? parseFloat(targetValue) : null,
        weigh_in_type: weighInTypeValue || null,
      })
      .eq('id', compId);

    if (sbError) {
      setError(sbError.message);
      return;
    }

    setSaved(true);
    startTransition(() => { router.refresh(); });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label htmlFor="target_weight_lbs" style={labelStyle}>TARGET WEIGHT (LBS)</label>
        <input
          id="target_weight_lbs" type="number"
          step="0.1" min="50" max="400" placeholder="155.0"
          value={targetValue}
          onChange={(e) => { setSaved(false); setTargetValue(e.target.value); }}
          style={flatInput}
        />
      </div>

      <div>
        <div style={labelStyle}>WEIGH-IN TYPE</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { value: 'same_day',   label: 'SAME DAY' },
            { value: 'day_before', label: 'DAY BEFORE' },
          ].map((opt) => {
            const selected = weighInTypeValue === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { setSaved(false); setWeighInTypeValue(opt.value); }}
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

      {error && (
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: '#ef4444' }}>{error}</p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          style={{
            padding: '10px 20px',
            background: !isPending ? C.amber : 'transparent',
            border: `1px solid ${!isPending ? C.amber : C.border}`,
            color: !isPending ? C.bg : C.dimmer,
            fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.1em',
            cursor: !isPending ? 'pointer' : 'default',
          }}
        >
          {isPending ? 'SAVING…' : 'SAVE'}
        </button>
        {saved && (
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.green }}>
            CUT LOCKED.
          </span>
        )}
      </div>
    </div>
  );
}
