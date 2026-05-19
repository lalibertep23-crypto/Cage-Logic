'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from './actions';
import { Button } from '@/components/ui/button';

const inputCls =
  'rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full';

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputCls}
        />
        {state.fieldErrors?.email && (
          <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputCls}
        />
        {state.fieldErrors?.password && (
          <p className="text-xs text-destructive">{state.fieldErrors.password}</p>
        )}
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">{state.error}</p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
