// Onboarding Screen 2 of 9 — Account creation.
// Email/password only for V1 (Google OAuth deferred to V1.5).
// On success: redirects to /onboarding/identity (Screen 3).

import Link from 'next/link';
import { SignupForm } from './signup-form';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight">CREATE ACCOUNT</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Step 2 of 9
          </p>
        </div>

        <SignupForm />

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
