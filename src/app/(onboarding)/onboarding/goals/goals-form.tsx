'use client';

import { useActionState } from 'react';
import { saveGoalsAction, type GoalsState } from './actions';
import { Button } from '@/components/ui/button';

const COMP_STATUS_OPTIONS = [
  { value: 'never', label: 'Not interested in competing' },
  { value: 'occasional', label: 'Compete once or twice a year' },
  { value: 'regular', label: 'Compete regularly (3+ per year)' },
  { value: 'pro', label: 'Professional / paid' },
];

type FormDefaults = {
  whyTraining: string;
  compStatus: string;
  beltGoal: string;
  trainingFrequency: number | '';
};

const initialState: GoalsState = {};

const inputClass =
  'rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

export function GoalsForm({ defaults }: { defaults: FormDefaults }) {
  const [state, formAction, pending] = useActionState(
    saveGoalsAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="trainingFrequency" className="text-sm font-medium">
          How many days per week do you train?
        </label>
        <select
          id="trainingFrequency"
          name="trainingFrequency"
          required
          defaultValue={defaults.trainingFrequency}
          className={inputClass}
        >
          <option value="">Pick one</option>
          <option value="2">2 days</option>
          <option value="3">3 days</option>
          <option value="4">4 days</option>
          <option value="5">5 days</option>
          <option value="6">6 days</option>
          <option value="7">Every day</option>
        </select>
        {state.fieldErrors?.trainingFrequency && (
          <p className="text-xs text-destructive">{state.fieldErrors.trainingFrequency}</p>
        )}
        <p className="text-xs text-muted-foreground">Used to calculate your Consistency score. You can update it in settings later.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="whyTraining" className="text-sm font-medium">
          Why are you training?
        </label>
        <textarea
          id="whyTraining"
          name="whyTraining"
          rows={3}
          maxLength={500}
          defaultValue={defaults.whyTraining}
          placeholder="Health, competition, self-defense, mental edge — whatever it is."
          className={inputClass + ' resize-none'}
        />
        {state.fieldErrors?.whyTraining && (
          <p className="text-xs text-destructive">{state.fieldErrors.whyTraining}</p>
        )}
        <p className="text-xs text-muted-foreground">Optional. Plain language. You can change it later.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="compStatus" className="text-sm font-medium">
          Competition status
        </label>
        <select
          id="compStatus"
          name="compStatus"
          required
          defaultValue={defaults.compStatus}
          className={inputClass}
        >
          {COMP_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {state.fieldErrors?.compStatus && (
          <p className="text-xs text-destructive">{state.fieldErrors.compStatus}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="beltGoal" className="text-sm font-medium">
          What are you working toward?
        </label>
        <input
          id="beltGoal"
          name="beltGoal"
          type="text"
          maxLength={120}
          defaultValue={defaults.beltGoal}
          placeholder="e.g. blue belt, more consistent rolls, win locals"
          className={inputClass}
        />
        {state.fieldErrors?.beltGoal && (
          <p className="text-xs text-destructive">{state.fieldErrors.beltGoal}</p>
        )}
        <p className="text-xs text-muted-foreground">Optional. Next belt, a specific skill, anything.</p>
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
