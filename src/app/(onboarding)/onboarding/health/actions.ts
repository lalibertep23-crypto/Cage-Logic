'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { encryptField } from '@/lib/crypto';

const PT_STATUSES = ['none', 'current', 'completed', 'cleared'] as const;

const Schema = z.object({
  pastInjuries: z
    .string()
    .trim()
    .max(2000, 'Keep it under 2000 characters.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  currentInjuries: z
    .string()
    .trim()
    .max(2000, 'Keep it under 2000 characters.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  conditions: z
    .string()
    .trim()
    .max(2000, 'Keep it under 2000 characters.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  ptStatus: z.enum(PT_STATUSES),
});

export type HealthState = {
  error?: string;
  fieldErrors?: Partial<
    Record<
      'pastInjuries' | 'currentInjuries' | 'conditions' | 'ptStatus' | 'consentGiven',
      string
    >
  >;
};

/**
 * Onboarding Step 8 — Health baseline.
 * Three sensitive fields are AES-256-GCM-encrypted before insert.
 * Explicit consent is required.
 */
export async function saveHealthAction(
  _prev: HealthState,
  formData: FormData
): Promise<HealthState> {
  if (formData.get('consentGiven') !== 'on') {
    return { fieldErrors: { consentGiven: 'You must consent before continuing.' } };
  }

  const parsed = Schema.safeParse({
    pastInjuries: formData.get('pastInjuries'),
    currentInjuries: formData.get('currentInjuries'),
    conditions: formData.get('conditions'),
    ptStatus: formData.get('ptStatus'),
  });

  if (!parsed.success) {
    const fieldErrors: HealthState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<HealthState['fieldErrors']>;
      fieldErrors[k] = issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return { error: 'Not signed in.' };
  }

  let encryptedPayload;
  try {
    encryptedPayload = {
      past_injuries_encrypted: encryptField(parsed.data.pastInjuries),
      current_injuries_encrypted: encryptField(parsed.data.currentInjuries),
      conditions_encrypted: encryptField(parsed.data.conditions),
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Encryption failed.' };
  }

  const { data: existing } = await supabase
    .from('athlete_health_baseline')
    .select('id')
    .eq('athlete_id', user.id)
    .maybeSingle();

  const payload = {
    athlete_id: user.id,
    ...encryptedPayload,
    pt_status: parsed.data.ptStatus,
    consent_given: true,
    consent_given_at: new Date().toISOString(),
  };

  const { error } = existing
    ? await supabase
        .from('athlete_health_baseline')
        .update(payload)
        .eq('id', existing.id as string)
    : await supabase.from('athlete_health_baseline').insert(payload);

  if (error) {
    return { error: error.message };
  }

  redirect('/onboarding/done');
}
