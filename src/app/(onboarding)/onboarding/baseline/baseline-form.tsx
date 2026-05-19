'use client';

import { useActionState } from 'react';
import { saveBaselineAction, type BaselineState } from './actions';
import { Button } from '@/components/ui/button';

const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

const SIDE_OPTIONS = [
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
  { value: 'ambi', label: 'Ambidextrous' },
];

type FormDefaults = {
  sex: string;
  dateOfBirth: string;
  heightFeet: number | '';
  heightInches: number | '';
  currentWeightLb: number | '';
  walkingWeightLb: number | '';
  dominantSide: string;
};

const initialState: BaselineState = {};

const inputClass =
  'rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

export function BaselineForm({ defaults }: { defaults: FormDefaults }) {
  const [state, formAction, pending] = useActionState(
    saveBaselineAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sex" className="text-sm font-medium">Sex</label>
        <select
          id="sex"
          name="sex"
          required
          defaultValue={defaults.sex}
          className={inputClass}
        >
          {SEX_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {state.fieldErrors?.sex && (
          <p className="text-xs text-destructive">{state.fieldErrors.sex}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="dateOfBirth" className="text-sm font-medium">Date of birth</label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          required
          defaultValue={defaults.dateOfBirth}
          className={inputClass}
        />
        {state.fieldErrors?.dateOfBirth && (
          <p className="text-xs text-destructive">{state.fieldErrors.dateOfBirth}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Height</span>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              id="heightFeet"
              name="heightFeet"
              type="number"
              min={3}
              max={8}
              required
              placeholder="ft"
              defaultValue={defaults.heightFeet}
              className={inputClass + ' w-full'}
            />
          </div>
          <div className="flex-1">
            <input
              id="heightInches"
              name="heightInches"
              type="number"
              min={0}
              max={11}
              required
              placeholder="in"
              defaultValue={defaults.heightInches}
              className={inputClass + ' w-full'}
            />
          </div>
        </div>
        {(state.fieldErrors?.heightFeet || state.fieldErrors?.heightInches) && (
          <p className="text-xs text-destructive">
            {state.fieldErrors?.heightFeet ?? state.fieldErrors?.heightInches}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="currentWeightLb" className="text-sm font-medium">Current weight (lbs)</label>
        <input
          id="currentWeightLb"
          name="currentWeightLb"
          type="number"
          step="0.1"
          required
          defaultValue={defaults.currentWeightLb}
          className={inputClass}
        />
        {state.fieldErrors?.currentWeightLb && (
          <p className="text-xs text-destructive">{state.fieldErrors.currentWeightLb}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="walkingWeightLb" className="text-sm font-medium">Walking weight (lbs)</label>
        <input
          id="walkingWeightLb"
          name="walkingWeightLb"
          type="number"
          step="0.1"
          defaultValue={defaults.walkingWeightLb}
          className={inputClass}
        />
        {state.fieldErrors?.walkingWeightLb && (
          <p className="text-xs text-destructive">{state.fieldErrors.walkingWeightLb}</p>
        )}
        <p className="text-xs text-muted-foreground">What you walk around at when not cutting. Leave blank if same as current.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="dominantSide" className="text-sm font-medium">Dominant side</label>
        <select
          id="dominantSide"
          name="dominantSide"
          required
          defaultValue={defaults.dominantSide}
          className={inputClass}
        >
          {SIDE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {state.fieldErrors?.dominantSide && (
          <p className="text-xs text-destructive">{state.fieldErrors.dominantSide}</p>
        )}
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">{state.error}</p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? 'Saving…' : 'Continue'}
      </Button>
    </form>
  );
}
