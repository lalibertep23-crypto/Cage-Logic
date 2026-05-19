'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const SignupSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(8, 'At least 8 characters.'),
});

export type SignupState = {
  error?: string;
  fieldErrors?: { email?: string; password?: string };
};

export async function signupAction(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const parsed = SignupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    const fieldErrors: SignupState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as 'email' | 'password';
      fieldErrors[k] = issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Auto-sign-in: with email confirmation OFF, signUp returns an active session.
  // Redirect to first real onboarding screen.
  redirect('/onboarding/identity');
}
