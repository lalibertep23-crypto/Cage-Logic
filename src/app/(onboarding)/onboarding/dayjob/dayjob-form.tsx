'use client';

import { useActionState } from 'react';
import { saveDayjobAction, type DayjobState } from './actions';
import { Button } from '@/components/ui/button';

const CATEGORY_OPTIONS = [
  { value: 'desk', label: 'Mostly desk / sedentary' },
  { value: 'light', label: 'Light activity (indoor, some walking)' },
  { value: 'moderate', label: 'Moderate (on feet, light lifting)' },
  { value: 'heavy', label: 'Physical (heavy lifting, manual labor)' },
  { value: 'shift_or_variable', label: 'Shift work or highly variable' },
  { value: 'not_working', label: 'Not working / between jobs' },
];

type FormDefaults = {
  dayJobCategory: string;
  hoursPhysicalPerDay: number | '';
};

const initialState: DayjobState = {};

const inputClass =
  'rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

export function DayjobForm({ defaults }: { defaults: FormDefaults }) {
  const [state, formAction, pending] = useActionState(
    saveDayjobAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="dayJobCategory" className="text-sm font-medium">
          Day job category
        </label>
        <select
          id="dayJobCategory"
          name="dayJobCategory"
          required
          defaultValue={defaults.dayJobCategory}
          className={inputClass}
        >
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {state.fieldErrors?.dayJobCategory && (
          <p className="text-xs text-destructive">{state.fieldErrors.dayJobCategory}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="hoursPhysicalPerDay" className="text-sm font-medium">
          Physical hours per workday
        </label>
        <input
          id="hoursPhysicalPerDay"
          name="hoursPhysicalPerDay"
          type="number"
          step="0.5"
          min={0}
          max={16}
          required
          defaultValue={defaults.hoursPhysicalPerDay}
          className={inputClass}
        />
        {state.fieldErrors?.hoursPhysicalPerDay && (
          <p className="text-xs text-destructive">{state.fieldErrors.hoursPhysicalPerDay}</p>
        )}
        <p className="text-xs text-muted-foreground">
          On feet, lifting, moving. Desk time doesn&apos;t count.
        </p>
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
