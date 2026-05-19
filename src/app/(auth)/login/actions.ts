'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const LoginSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(1, 'Enter your password.'),
});

export type LoginState = {
  error?: string;
  fieldErrors?: { email?: string; password?: string };
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    const fieldErrors: LoginState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as 'email' | 'password';
      fieldErrors[k] = issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: 'Email or password is incorrect.' };
  }

  redirect('/home');
}
