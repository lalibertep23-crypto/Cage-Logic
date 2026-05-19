'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { IRON_ARMY_GYM_ID } from '@/lib/constants';

const SESSION_TYPES = ['gi', 'no_gi', 'drilling', 'open_mat', 'comp_class'] as const;
const OUTCOMES = ['tapped_them', 'got_tapped', 'draw', 'positional'] as const;
const SIZES = ['smaller', 'same', 'bigger'] as const;

const Schema = z.object({
  sessionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date.'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Pick a start time.').optional(),
  sessionType: z.enum(SESSION_TYPES),
  durationMinutes: z.coerce.number().int().min(1).max(600),
  instructorName: z.string().trim().max(120).optional(),
  energy: z.coerce.number().int().min(1).max(10),
  intensity: z.coerce.number().int().min(1).max(10),
  whatClicked: z.string().trim().max(2000).optional(),
  whatDidnt: z.string().trim().max(2000).optional(),
  questionForCoach: z.string().trim().max(1000).optional(),
});

export type LogState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof Schema>, string>>;
};

function emptyToUndefined(v: FormDataEntryValue | null): string | undefined {
  const s = v?.toString().trim();
  return s && s.length > 0 ? s : undefined;
}

/**
 * Step 4 — Log a session.
 * Writes training_sessions + session_techniques + session_reflections + roll_logs.
 */
export async function logSessionAction(
  _prev: LogState,
  formData: FormData
): Promise<LogState> {
  const parsed = Schema.safeParse({
    sessionDate: formData.get('sessionDate'),
    startTime: emptyToUndefined(formData.get('startTime')),
    sessionType: formData.get('sessionType'),
    durationMinutes: formData.get('durationMinutes'),
    instructorName: emptyToUndefined(formData.get('instructorName')),
    energy: formData.get('energy'),
    intensity: formData.get('intensity'),
    whatClicked: emptyToUndefined(formData.get('whatClicked')),
    whatDidnt: emptyToUndefined(formData.get('whatDidnt')),
    questionForCoach: emptyToUndefined(formData.get('questionForCoach')),
  });

  if (!parsed.success) {
    const fieldErrors: LogState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<LogState['fieldErrors']>;
      fieldErrors[k] = issue.message;
    }
    return { fieldErrors };
  }

  const techniqueIds    = formData.getAll('techniqueId').map((v) => v.toString()).filter(Boolean);
  const customTechniques = formData.getAll('customTechnique').map((v) => v.toString().trim()).filter(Boolean);

  // Rolls: read indexed entries up to a sane max (12).
  type RollRow = {
    partner_label: string | null;
    partner_relative_size: string | null;
    outcome: (typeof OUTCOMES)[number] | null;
    felt: string | null;
  };
  const rolls: RollRow[] = [];
  for (let i = 0; i < 12; i++) {
    const outcomeRaw = formData.get(`rolls[${i}].outcome`)?.toString();
    if (!outcomeRaw) continue;
    if (!(OUTCOMES as readonly string[]).includes(outcomeRaw)) continue;
    const sizeRaw = formData.get(`rolls[${i}].size`)?.toString();
    const partner = emptyToUndefined(formData.get(`rolls[${i}].partner`)) ?? null;
    const felt = emptyToUndefined(formData.get(`rolls[${i}].felt`)) ?? null;
    rolls.push({
      partner_label: partner,
      partner_relative_size:
        sizeRaw && (SIZES as readonly string[]).includes(sizeRaw) ? sizeRaw : null,
      outcome: outcomeRaw as (typeof OUTCOMES)[number],
      felt,
    });
  }

  // Submission chains: read indexed steps per roll index.
  type ChainStepData = { position: string | null; technique_custom: string | null; result: string | null };
  const rollChainSteps: ChainStepData[][] = [];
  for (let i = 0; i < 12; i++) {
    const steps: ChainStepData[] = [];
    for (let s = 0; s < 10; s++) {
      const position  = emptyToUndefined(formData.get(`rolls[${i}].chain[${s}].position`)) ?? null;
      const technique = emptyToUndefined(formData.get(`rolls[${i}].chain[${s}].technique`)) ?? null;
      const result    = emptyToUndefined(formData.get(`rolls[${i}].chain[${s}].result`)) ?? null;
      if (!position && !technique) break;
      steps.push({ position, technique_custom: technique, result });
    }
    rollChainSteps.push(steps);
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return { error: 'Not signed in.' };
  }

  // 1) Insert training session
  const { data: session, error: sessionErr } = await supabase
    .from('training_sessions')
    .insert({
      athlete_id: user.id,
      gym_id: IRON_ARMY_GYM_ID,
      session_date: parsed.data.sessionDate,
      start_time: parsed.data.startTime ?? null,
      duration_minutes: parsed.data.durationMinutes,
      session_type: parsed.data.sessionType,
      instructor_name: parsed.data.instructorName ?? null,
      energy_1_10: parsed.data.energy,
      intensity_1_10: parsed.data.intensity,
    })
    .select('id')
    .single();

  if (sessionErr || !session) {
    return { error: sessionErr?.message ?? 'Failed to create session.' };
  }
  const sessionId = session.id as string;

  // 2) Insert session_techniques (batch)
  if (techniqueIds.length > 0) {
    const techRows = techniqueIds.map((tid) => ({
      session_id: sessionId,
      technique_id: tid,
    }));
    const { error: techErr } = await supabase.from('session_techniques').insert(techRows);
    if (techErr) {
      return { error: `Saved session but techniques failed: ${techErr.message}` };
    }
  }

  // 2b) Insert custom technique submissions + link via custom_session_techniques
  for (const name of customTechniques) {
    const { data: submission, error: subErr } = await supabase
      .from('custom_technique_submissions')
      .insert({ athlete_id: user.id, name, status: 'pending' })
      .select('id')
      .single();
    if (subErr || !submission) continue; // non-fatal
    await supabase.from('custom_session_techniques').insert({
      session_id: sessionId,
      custom_submission_id: submission.id,
    });
  }

  // 3) Insert reflection if any text was provided
  if (parsed.data.whatClicked || parsed.data.whatDidnt || parsed.data.questionForCoach) {
    const { error: reflErr } = await supabase.from('session_reflections').insert({
      session_id: sessionId,
      athlete_id: user.id,
      what_clicked: parsed.data.whatClicked ?? null,
      what_didnt: parsed.data.whatDidnt ?? null,
      question_for_coach: parsed.data.questionForCoach ?? null,
    });
    if (reflErr) {
      return { error: `Saved session but reflection failed: ${reflErr.message}` };
    }
  }

  // 4) Insert rolls (batch) — select back IDs so we can link chains
  if (rolls.length > 0) {
    const rollRows = rolls.map((r, idx) => ({
      session_id: sessionId,
      athlete_id: user.id,
      round_number: idx + 1,
      partner_label: r.partner_label,
      partner_relative_size: r.partner_relative_size,
      outcome: r.outcome,
      felt: r.felt,
    }));
    const { data: insertedRolls, error: rollErr } = await supabase
      .from('roll_logs')
      .insert(rollRows)
      .select('id, round_number');
    if (rollErr || !insertedRolls) {
      return { error: `Saved session but rolls failed: ${rollErr?.message}` };
    }

    // 5) Insert submission chains (non-fatal — don't block redirect)
    for (let i = 0; i < insertedRolls.length; i++) {
      const steps = rollChainSteps[i] ?? [];
      if (steps.length === 0) continue;
      const rollId = insertedRolls.find((r) => r.round_number === i + 1)?.id;
      if (!rollId) continue;

      const { data: chain, error: chainErr } = await supabase
        .from('submission_chains')
        .insert({ roll_id: rollId, athlete_id: user.id })
        .select('id')
        .single();
      if (chainErr || !chain) continue;

      const entryRows = steps.map((step, sIdx) => ({
        chain_id: chain.id,
        athlete_id: user.id,
        sequence_order: sIdx + 1,
        starting_position: step.position,
        technique_custom: step.technique_custom,
        result: step.result,
      }));
      await supabase.from('submission_chain_entries').insert(entryRows);
    }
  }

  redirect('/home');
}
