import Link from 'next/link';
import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight">SIGN IN</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Cage Logic
          </p>
        </div>

        <LoginForm />

        <p className="text-sm text-center text-muted-foreground">
          No account?{' '}
          <Link href="/signup" className="underline underline-offset-4">
            Get started
          </Link>
        </p>
      </div>
    </main>
  );
}
