'use client';

import { useActionState } from 'react';
import { saveCombatAction, type CombatState } from './actions';
import { Button } from '@/components/ui/button';

const DISCIPLINES = [
  { value: 'bjj', label: 'Brazilian Jiu-Jitsu' },
  { value: 'mma', label: 'MMA' },
  { value: 'boxing', label: 'Boxing' },
  { value: 'muay_thai', label: 'Muay Thai' },
  { value: 'wrestling', label: 'Wrestling' },
];

const BELTS = [
  { value: 'white', label: 'White' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'brown', label: 'Brown' },
  { value: 'black', label: 'Black' },
];

type FormDefaults = {
  discipline: string;
  rankColor: string;
  stripes: number;
  startDate: string;
};

const initialState: CombatState = {};

const inputClass =
  'rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

export function CombatForm({ defaults }: { defaults: FormDefaults }) {
  const [state, formAction, pending] = useActionState(
    saveCombatAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="Primary discipline"
        name="discipline"
        defaultValue={defaults.discipline}
        options={DISCIPLINES}
        error={state.fieldErrors?.discipline}
      />

      <Field
        label="Belt"
        name="rankColor"
        defaultValue={defaults.rankColor}
        options={BELTS}
        error={state.fieldErrors?.rankColor}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="stripes" className="text-sm font-medium">
          Stripes
        </label>
        <input
          id="stripes"
          name="stripes"
          type="number"
          min={0}
          max={4}
          required
          defaultValue={defaults.stripes}
          className={inputClass}
        />
        {state.fieldErrors?.stripes && (
          <p className="text-xs text-destructive">{state.fieldErrors.stripes}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="startDate" className="text-sm font-medium">
          When did you start training?
        </label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          defaultValue={defaults.startDate}
          className={inputClass}
        />
        {state.fieldErrors?.startDate && (
          <p className="text-xs text-destructive">{state.fieldErrors.startDate}</p>
        )}
        <p className="text-xs text-muted-foreground">Approximate is fine. Pick the 1st of the month if unsure.</p>
      </div>

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

function Field({
  label,
  name,
  defaultValue,
  options,
  error,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        required
        className={inputClass}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
