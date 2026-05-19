'use client';

import { useActionState } from 'react';
import { saveHealthAction, type HealthState } from './actions';
import { Button } from '@/components/ui/button';

const PT_OPTIONS = [
  { value: 'none', label: 'Not in physical therapy' },
  { value: 'current', label: 'Currently in PT' },
  { value: 'completed', label: 'Recently completed PT' },
  { value: 'cleared', label: 'Cleared by a provider to train' },
];

type FormDefaults = {
  pastInjuries: string;
  currentInjuries: string;
  conditions: string;
  ptStatus: string;
};

const initialState: HealthState = {};

const inputClass =
  'rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

export function HealthForm({ defaults }: { defaults: FormDefaults }) {
  const [state, formAction, pending] = useActionState(
    saveHealthAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="pastInjuries" className="text-sm font-medium">
          Past injuries
        </label>
        <textarea
          id="pastInjuries"
          name="pastInjuries"
          rows={3}
          maxLength={2000}
          defaultValue={defaults.pastInjuries}
          placeholder="Anything that affects how you train now."
          className={inputClass + ' resize-none'}
        />
        {state.fieldErrors?.pastInjuries && (
          <p className="text-xs text-destructive">{state.fieldErrors.pastInjuries}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="currentInjuries" className="text-sm font-medium">
          Current injuries
        </label>
        <textarea
          id="currentInjuries"
          name="currentInjuries"
          rows={3}
          maxLength={2000}
          defaultValue={defaults.currentInjuries}
          placeholder="Active issues you're working around right now."
          className={inputClass + ' resize-none'}
        />
        {state.fieldErrors?.currentInjuries && (
          <p className="text-xs text-destructive">{state.fieldErrors.currentInjuries}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="conditions" className="text-sm font-medium">
          Medical conditions
        </label>
        <textarea
          id="conditions"
          name="conditions"
          rows={2}
          maxLength={2000}
          defaultValue={defaults.conditions}
          placeholder="Anything ongoing — asthma, blood pressure, etc."
          className={inputClass + ' resize-none'}
        />
        {state.fieldErrors?.conditions && (
          <p className="text-xs text-destructive">{state.fieldErrors.conditions}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ptStatus" className="text-sm font-medium">
          Physical therapy status
        </label>
        <select
          id="ptStatus"
          name="ptStatus"
          required
          defaultValue={defaults.ptStatus}
          className={inputClass}
        >
          {PT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {state.fieldErrors?.ptStatus && (
          <p className="text-xs text-destructive">{state.fieldErrors.ptStatus}</p>
        )}
      </div>

      <div className="rounded-md border bg-muted/30 p-3 text-xs leading-relaxed space-y-2">
        <p className="font-semibold">How this data is handled</p>
        <p>
          The three text fields above are encrypted (AES-256-GCM) before storage. They are never sent to third parties. Cage Logic does not give medical advice or diagnose injuries.
        </p>
      </div>

      <div className="flex items-start gap-2">
        <input
          id="consentGiven"
          name="consentGiven"
          type="checkbox"
          required
          className="mt-1"
        />
        <label htmlFor="consentGiven" className="text-sm">
          I consent to storing this information for my own training use.
        </label>
      </div>
      {state.fieldErrors?.consentGiven && (
        <p className="text-xs text-destructive -mt-2">
          {state.fieldErrors.consentGiven}
        </p>
      )}

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? 'Saving…' : 'Continue'}
      </Button>
    </form>
  );
}
