'use client';

import { useActionState } from 'react';
import { saveIdentityAction, type IdentityState } from './actions';
import { Button } from '@/components/ui/button';

const initialState: IdentityState = {};

export function IdentityForm({ defaultName }: { defaultName?: string }) {
  const [state, formAction, pending] = useActionState(
    saveIdentityAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="displayName" className="text-sm font-medium">
          Display name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="name"
          required
          maxLength={60}
          defaultValue={defaultName ?? ''}
          autoFocus
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {state.fieldErrors?.displayName && (
          <p className="text-xs text-destructive">
            {state.fieldErrors.displayName}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          First name or training handle. V1 is single-user; this is for you.
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
