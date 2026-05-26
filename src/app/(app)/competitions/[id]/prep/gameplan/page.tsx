// Gameplan Anchor — ruleset-tailored training priorities for a specific competition.
// Pulls ruleset from the competition record, athlete discipline tier from athlete_disciplines,
// and returns computed training priorities. Zero AI — pure rules + templates.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const C = {
  bg:      '#1A1713',
  surface: '#252118',
  border:  'rgba(245,240,232,0.13)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.55)',
  dimmer:  'rgba(245,240,232,0.35)',
  amber:   '#D4922E',
  amberLow:'rgba(201,130,42,0.35)',
  green:   '#3D8B55',
  greenLow:'rgba(42,92,63,0.25)',
  brick:   '#8B3A1E',
  brickLow:'rgba(139,58,30,0.25)',
  amberBg: 'rgba(201,130,42,0.12)',
};

// ─── Ruleset intelligence — pure rules, no AI ─────────────────────────────────

type RulesetKey =
  | 'gi'
  | 'no_gi'
  | 'submission_only'
  | 'mma'
  | 'boxing'
  | 'muay_thai'
  | 'other';

type RulesetProfile = {
  label:         string;
  subtitle:      string;
  winsBy:        string[];    // legal paths to victory
  doesntCount:   string[];    // common misconceptions / things that don't score
  trainingFocus: string[];    // what to prioritize in training leading up
  mentalNote:    string;      // one mental framing specific to this ruleset
  keyPhysical:   string;      // the physical variable that matters most
};

const RULESET_PROFILES: Record<RulesetKey, RulesetProfile> = {
  gi: {
    label:    'GI — POINTS',
    subtitle: 'Control, accumulate, submit.',
    winsBy: [
      'Submission (immediate win)',
      'Points — takedown +2, sweep +2, guard pass +3, mount/back +4',
      'Advantages (tiebreaker — near-submissions, near-passes)',
      'Penalty accumulation on opponent',
    ],
    doesntCount: [
      'Aggression alone — the judge does not score "trying"',
      'Heel hooks (illegal in gi)',
      'Guard pulling is not a takedown (loses 2 if opponent scores first)',
      'Near-submission without control does not score without an advantage call',
    ],
    trainingFocus: [
      'Guard retention — staying out of guard pass range is worth 3 points prevented',
      'Positional dominance sequences: takedown → guard pass → mount/back chains',
      'Submission as a position-changer, not just a finisher',
      'Recompose guard from worst positions — losing mount early wins rounds on points',
    ],
    mentalNote: 'Points compound. A 4-point lead in the first minute changes how both athletes fight. Score early, then make them chase you.',
    keyPhysical: 'Grip endurance and positional strength — gi competition is a war of attrition on the hands and hips.',
  },

  no_gi: {
    label:    'NO-GI — POINTS',
    subtitle: 'Faster. Slippier. Same math.',
    winsBy: [
      'Submission (immediate win)',
      'Points — takedown +2, sweep +2, guard pass +3, back control +4, mount +4',
      'Advantages in most rulesets (check organization rules)',
      'Penalties on opponent for stalling',
    ],
    doesntCount: [
      'Grip-dependent setups — no collar, no sleeve, no lapel',
      'Stalling — refs are faster to call stalling in no-gi',
      '"Near" anything without clear control',
    ],
    trainingFocus: [
      'Wrist control and underhook battles — the no-gi equivalent of grip fighting',
      'Leg entanglement sequences — heel hooks, kneebars legal in advanced divisions',
      'Scramble conditioning: explosions from bottom, transitions without grips',
      'Double-leg and single-leg to back-take chains',
    ],
    mentalNote: 'No-gi is faster in every dimension — the pace of scrambles, the speed of leg lock entries, the tempo refs set. Train at full speed or the pace will surprise you.',
    keyPhysical: 'Explosive anaerobic capacity — the pace of no-gi rewards athletes who can explode repeatedly without settling.',
  },

  submission_only: {
    label:    'SUBMISSION ONLY',
    subtitle: 'Win or go home. There is no second place in points.',
    winsBy: [
      'Submission — tap or verbal',
      'Overtime (OT) if no submission in regulation: starting positions, coin flip',
      'Referee decision in some formats after multiple OT rounds',
    ],
    doesntCount: [
      'Points (there are none)',
      'Advantages (there are none)',
      'Positional dominance without a finish — holding mount for 10 minutes means nothing',
      'Guard pulling — legal but burns time without a win condition attached',
    ],
    trainingFocus: [
      'Finishing sequences — the last 10% of every submission attempt you usually abandon',
      'Aggressive guard passing specifically to create submission entries, not just for position',
      'High-percentage submission chains from both top and bottom',
      'OT position familiarity: seated guard, referee position, leg lock entanglements',
    ],
    mentalNote: 'Overtime is where sub-only is decided. Every athlete preparing for a sub-only tournament needs to be comfortable in, and have a plan from, the overtime starting position. Train it explicitly.',
    keyPhysical: 'Grip and squeeze endurance — submissions are physical commitments. The athlete who can maintain submission pressure for 15+ seconds while defending scrambles wins.',
  },

  mma: {
    label:    'MMA — UNIFIED RULES',
    subtitle: 'The complete question. Every weapon, all at once.',
    winsBy: [
      'KO / TKO (strikes, doctor stoppage)',
      'Submission (tap or verbal)',
      'Unanimous / Split / Majority Decision (3 judges × 10-point must)',
      'Technical Draw, No Contest (rare)',
    ],
    doesntCount: [
      '12-6 elbow strikes (illegal in unified rules)',
      'Kicks / knees to downed opponent (in most jurisdictions)',
      'Groin shots, eye pokes, back of head strikes',
      '"Winning" a round means nothing — losing a round 10-8 can lose the fight',
    ],
    trainingFocus: [
      'Takedown defense — being taken down and controlled is a round-losing position',
      'Ground and pound defense: hip escapes from mount against strikes',
      'Submission timing: when is the ground safe vs. when does the opponent escape?',
      'Clinch entries from striking range — closing the gap without eating counter shots',
    ],
    mentalNote: 'Three rounds is three different fights. Momentum matters more in MMA than any other discipline — the athlete who wins round 1 changes the risk profile of rounds 2 and 3. Win the first two minutes.',
    keyPhysical: 'Aerobic base under intermittent explosive load — MMA rounds require sustained output with multiple 100% effort bursts. VO2 max matters here more than anywhere else.',
  },

  boxing: {
    label:    'BOXING',
    subtitle: 'The science of punching. Ten rounds of geometry.',
    winsBy: [
      'KO — opponent cannot beat the 10 count',
      'TKO — referee stoppage (outclassed, corner stoppage)',
      'Unanimous / Split / Majority Decision',
    ],
    doesntCount: [
      'Clinching without throwing — referee breaks it',
      'Rabbit punches, kidney shots to the spine (illegal)',
      'Hitting after the bell',
      'Winning exchanges you initiated with a foul',
    ],
    trainingFocus: [
      'Head movement under pressure — if the opponent is bigger, slipping and rolling is how you survive',
      'Combination finishing — the first punch is the setup, not the finisher',
      'Jab volume: in close decisions, who threw more jabs usually wins',
      'Late-round output: judges watch rounds 8-10 most carefully in close fights',
    ],
    mentalNote: 'Amateur boxing scores clean punches in volume. Professional boxing scores effective aggression, defense, and ring generalship. Know which you\'re fighting under — the tactical implications are different.',
    keyPhysical: 'Shoulder and shoulder girdle endurance — the ability to keep hands up and throw in round 10 at the same pace as round 1.',
  },

  muay_thai: {
    label:    'MUAY THAI — 8 LIMBS',
    subtitle: 'Fists, elbows, knees, kicks. Everything lands.',
    winsBy: [
      'KO / TKO',
      'Points — fists, elbows, knees, kicks, teeps all score',
      'Dominant strikes to body and legs score independently of the opponent\'s reaction',
    ],
    doesntCount: [
      'Takedowns for takedown\'s sake — no BJJ-style grappling',
      'Holding without striking in the clinch (stall penalty)',
      'Jumping techniques that don\'t land cleanly (often not scored)',
    ],
    trainingFocus: [
      'Teep distance management — the longest range weapon is also the defensive reset',
      'Clinch knee volume: close-range dominance scores heavily in Thai scoring',
      'Leg kick checking and returning: leg kick damage accumulates and slows opponents',
      'Elbow entries: when to clinch vs. when to land the elbow at mid-range',
    ],
    mentalNote: 'Muay Thai judges reward composure and clear technique over desperation. The athlete who looks comfortable, lands hard and clean, and doesn\'t chase earns rounds. Looking like you\'re winning matters as much as being winning.',
    keyPhysical: 'Hip flexibility and rotation power — every major scoring technique in Muay Thai is powered by the hips. Stiff hips = weak kicks = lost rounds.',
  },

  other: {
    label:    'OTHER FORMAT',
    subtitle: 'Confirm your ruleset with the organization before you build a gameplan around assumptions.',
    winsBy: [
      'Confirm the specific win conditions with the organization',
      'Most combat sports formats use some version of submission, points, or judge decision',
    ],
    doesntCount: [
      'Techniques or tactics specific to different rulesets — confirm what\'s legal',
    ],
    trainingFocus: [
      'Know your ruleset. One rule difference changes the entire gameplan.',
      'Train your A-game — it should work in most formats',
      'Confirm weight class, round length, and overtime format with the organization',
    ],
    mentalNote: 'Competing without knowing your specific ruleset is a preparation error, not a skill problem. Find out now.',
    keyPhysical: 'Whatever you train most — it\'s what your body does under stress.',
  },
};

// ─── Discipline tier → training priority signal ────────────────────────────────

type DisciplineRow = {
  discipline: string;
  rank_color:  string;
};

function tierSignalLabel(discipline: string, rankColor: string): string {
  const map: Record<string, Record<string, string>> = {
    bjj: {
      white_0: 'Early foundation — survival and positional awareness',
      white_1: 'Building escapes and guard retention',
      white_2: 'Developing guard and basic submissions',
      white_3: 'Offense beginning — developing sweeps and passes',
      white_4: 'Improving consistency across positions',
      blue_0:  'Fundamental technique solid — developing combinations',
      blue_1:  'Growing technical depth in core positions',
      blue_2:  'Competitive-level game taking shape',
      blue_3:  'Strong fundamentals — identifying A-game sequences',
      blue_4:  'High-level blue — finding competition identity',
      purple_0:'Developing instructor-level understanding',
      purple_1:'Competition-caliber technique in primary positions',
    },
    muay_thai: {
      prajied_1: 'Foundation techniques — jab, cross, teep',
      prajied_2: 'Combinations and basic clinch',
      prajied_3: 'Power strikes and knee development',
      prajied_4: 'Advanced combinations and elbow entries',
      prajied_5: 'High-performance — full technical system',
    },
    wrestling: {
      level_1: 'Learning to sprawl and survive',
      level_2: 'Developing takedown entries',
      level_3: 'Building chain sequences',
      level_4: 'Competition-caliber takedowns',
      level_5: 'Advanced scramble and chain wrestling',
      level_6: 'Elite level — Frankie Edgar Standard',
    },
    boxing: {
      foundation: 'Stance, jab, and movement foundation',
      philly_red: 'Defense, head movement, counter structure',
      commonwealth_blue: 'Technical combination development',
      mexican_gold: 'Power combination sequences',
      la_habana_gold: 'Advanced technical and tactical game',
      sweet_science: 'Championship-level technical mastery',
    },
  };

  return map[discipline]?.[rankColor] ?? 'Current tier data available';
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default async function GameplanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  // Fetch competition
  const { data: comp } = await supabase
    .from('competitions')
    .select('id, name, rule_set, comp_date')
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!comp) notFound();

  // Fetch athlete's active disciplines
  const { data: disciplines } = await supabase
    .from('athlete_disciplines')
    .select('discipline, rank_color')
    .eq('athlete_id', user.id);

  const name    = comp.name as string;
  const ruleSet = (comp.rule_set as string | null) ?? 'other';
  const profile = RULESET_PROFILES[ruleSet as RulesetKey] ?? RULESET_PROFILES.other;
  const disciplineRows: DisciplineRow[] = (disciplines ?? []).map((r) => ({
    discipline: r.discipline as string,
    rank_color:  r.rank_color as string,
  }));

  // Determine which disciplines are relevant to this ruleset
  const relevantDisciplines: DisciplineRow[] = disciplineRows.filter((d) => {
    if (ruleSet === 'gi' || ruleSet === 'no_gi' || ruleSet === 'submission_only') {
      return d.discipline === 'bjj';
    }
    if (ruleSet === 'mma') {
      return ['bjj', 'wrestling', 'muay_thai', 'boxing'].includes(d.discipline);
    }
    if (ruleSet === 'boxing') return d.discipline === 'boxing';
    if (ruleSet === 'muay_thai') return d.discipline === 'muay_thai';
    return true;
  });

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 100 }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 20, letterSpacing: '0.08em' }}>
              GAMEPLAN
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginTop: 2 }}>
              {name.toUpperCase()}
            </div>
          </div>
        </div>
        <Link
          href={`/competitions/${id}`}
          style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}
        >
          ← EVENT
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* Ruleset badge */}
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{
            fontFamily: 'var(--font-bebas)', fontSize: 20, letterSpacing: '0.16em', color: C.amber,
          }}>
            {profile.label}
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.06em', color: C.dim, margin: '6px 0 0', lineHeight: 1.6 }}>
          {profile.subtitle}
        </p>

        {/* Win conditions */}
        <div style={{ marginTop: 24 }}>
          <SectionDivider label="LEGAL PATHS TO WIN" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {profile.winsBy.map((item, i) => (
              <BulletRow key={i} text={item} accentColor={C.green} />
            ))}
          </div>
        </div>

        {/* What doesn't count */}
        <div style={{ marginTop: 24 }}>
          <SectionDivider label="WHAT DOESN'T COUNT" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {profile.doesntCount.map((item, i) => (
              <BulletRow key={i} text={item} accentColor={C.brick} />
            ))}
          </div>
        </div>

        {/* Training focus */}
        <div style={{ marginTop: 24 }}>
          <SectionDivider label="TRAINING PRIORITY THIS CYCLE" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {profile.trainingFocus.map((item, i) => (
              <BulletRow key={i} text={item} accentColor={C.amber} />
            ))}
          </div>
        </div>

        {/* Key physical variable */}
        <div style={{
          marginTop: 24,
          background: C.amberBg,
          borderLeft: `3px solid ${C.amber}`,
          padding: '14px 16px 14px 14px',
        }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.amber, marginBottom: 6 }}>
            KEY PHYSICAL VARIABLE
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', color: C.text, lineHeight: 1.7, margin: 0 }}>
            {profile.keyPhysical}
          </p>
        </div>

        {/* Mental note */}
        <div style={{
          marginTop: 12,
          background: C.surface,
          borderLeft: `3px solid ${C.border}`,
          padding: '14px 16px 14px 14px',
        }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
            MENTAL FRAME
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', color: C.dim, lineHeight: 1.7, margin: 0 }}>
            {profile.mentalNote}
          </p>
        </div>

        {/* Your discipline tiers — gap analysis */}
        {relevantDisciplines.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <SectionDivider label="YOUR CURRENT LEVEL" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 12 }}>
              {relevantDisciplines.map((d) => (
                <div key={d.discipline} style={{
                  background: C.surface, padding: '12px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.14em', color: C.text }}>
                      {d.discipline.replace('_', ' ').toUpperCase()}
                    </div>
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', color: C.dim, marginTop: 4, lineHeight: 1.6 }}>
                      {tierSignalLabel(d.discipline, d.rank_color)}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em',
                    color: C.amber, padding: '4px 8px', border: `1px solid ${C.amberLow}`,
                    flexShrink: 0, marginLeft: 12, textAlign: 'center',
                  }}>
                    {d.rank_color.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
            {ruleSet === 'mma' && disciplineRows.length < 3 && (
              <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.06em', color: C.dimmer, marginTop: 10, lineHeight: 1.6 }}>
                Complete athlete. MMA rewards coverage across all disciplines. Add disciplines in Progression to see your full picture.
              </p>
            )}
          </div>
        )}

        {/* No disciplines logged */}
        {relevantDisciplines.length === 0 && (
          <div style={{ marginTop: 24, background: C.surface, padding: '16px 14px', borderLeft: `3px solid ${C.border}` }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.06em', color: C.dim, lineHeight: 1.7 }}>
              No discipline progression logged for this ruleset yet.{' '}
              <Link href="/progression" style={{ color: C.amber, textDecoration: 'none' }}>
                Start your progression →
              </Link>
            </div>
          </div>
        )}

        {/* Navigation to other prep screens */}
        <div style={{ marginTop: 32 }}>
          <SectionDivider label="REST OF PREP" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 12 }}>
            {[
              { href: `/competitions/${id}/prep/taper`,    label: 'TAPER PLAN' },
              { href: `/competitions/${id}/prep/weight`,   label: 'WEIGHT MANAGEMENT' },
              { href: `/competitions/${id}/prep/day-of`,   label: 'DAY-OF TIMELINE' },
              { href: `/competitions/${id}/prep/post-comp`, label: 'POST-COMP DEBRIEF' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: C.surface, padding: '13px 14px',
                  textDecoration: 'none', color: C.text,
                  fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.14em',
                }}
              >
                {link.label}
                <span style={{ color: C.amberLow, fontSize: 14 }}>→</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.dimmer, flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

function BulletRow({ text, accentColor }: { text: string; accentColor: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: accentColor, flexShrink: 0, marginTop: 1 }}>·</span>
      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', color: C.dim, lineHeight: 1.7 }}>
        {text}
      </span>
    </div>
  );
}
