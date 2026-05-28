// Progression / Criteria — Screen 2.
// Belt image header, stripe progress, phase, objective, requirements checklist, coach tip.
// DEMO_PHASES keyed by fromRank (e.g. "white_2") for per-stripe content.
// Source: CAGE_LOGIC_METHOD_PROGRESSIONS.md + CAGE_LOGIC_DISCIPLINE_PROGRESSIONS.md
// Touched 2026-05-28 — deploy nudge.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { C, fonts } from '@/lib/design-tokens';
import { IRON_ARMY_GYM_ID } from '@/lib/constants';
import { CriteriaClient } from './criteria-client';

export const dynamic = 'force-dynamic';

const BELT_META: Record<string, {
  label: string; accentColor: string; image: string; maxStripes: number; nextBelt: string;
}> = {
  white:  { label: 'WHITE BELT',  accentColor: '#D8D2C8', image: '/white-belt.png',   maxStripes: 4, nextBelt: 'BLUE BELT' },
  blue:   { label: 'BLUE BELT',   accentColor: '#4A7FD4', image: '/blue-belt.png',    maxStripes: 4, nextBelt: 'PURPLE BELT' },
  purple: { label: 'PURPLE BELT', accentColor: '#9B6FD0', image: '/purple-belt.png',  maxStripes: 4, nextBelt: 'BROWN BELT' },
  brown:  { label: 'BROWN BELT',  accentColor: '#A06535', image: '/brown-belt.png',   maxStripes: 4, nextBelt: 'BLACK BELT' },
  black:  { label: 'BLACK BELT',  accentColor: '#C8943A', image: '/first-degree.png', maxStripes: 4, nextBelt: 'THE HIGHEST RANK' },
};

type PhaseData = {
  phase: string;
  phaseDesc: string;
  objective: string;
  objectiveNote: string;
  requirements: string[];
  coachTip: string;
};

// Keyed by fromRank ("white_0", "white_1", etc.) — falls back to belt key, then "white_0"
const DEMO_PHASES: Record<string, PhaseData> = {

  // ── WHITE BELT ──────────────────────────────────────────────────────────────

  'white_0': {
    phase: 'ORIENTATION & SURVIVAL',
    phaseDesc: 'You just walked in. Orientation is the skill. You will be submitted. That is the point.',
    objective: 'Survive a Full Round',
    objectiveNote: 'Do not get injured. Tap correctly and often.',
    requirements: [
      'Shrimp Escape (Elbow-Knee) from Side Control',
      'Frame in Side Control — Hold for a Drilling Round',
      'Pull to Closed Guard and Break Posture',
      'Rear Naked Choke — Correct Lock Mechanics',
      '24+ Classes Logged',
    ],
    coachTip: 'Tap early and tap often. Getting submitted is not failure — it is information about what you do not know yet.',
  },

  'white_1': {
    phase: 'BUILDING A BOTTOM GAME',
    phaseDesc: 'Survival is not enough. Now you need to make someone work to submit you.',
    objective: 'Land a Sweep in Live Rolling',
    objectiveNote: 'Any sweep. Any opponent. Even once counts.',
    requirements: [
      'Hip Bump Sweep — Setup, Weight Shift, Finish to Mount',
      'Scissor Sweep — Knee Positioning and Pull-and-Kick Mechanics',
      'Armbar from Closed Guard — Hip Out, Leg Over, Finish',
      'Mount Escape — Bridge and Roll (Upa)',
      'Attempt One Submission in Live Rolling',
    ],
    coachTip: 'Sweeps before submissions. Earn the top position first. The submission comes after.',
  },

  'white_2': {
    phase: 'BUILDING A TOP GAME',
    phaseDesc: 'You have learned to survive on bottom. Now you learn what it feels like to apply pressure from the top.',
    objective: 'Land a Guard Pass in Live Rolling',
    objectiveNote: 'Any pass. Any opponent. Even once counts.',
    requirements: [
      'Knee Cut Pass — Drive-Through to Side Control',
      'Torreando Pass (Basic) — Both Directions',
      'Side Control Maintenance — Hip Connection and Weight Distribution',
      'Back Take from Turtle — Insert Hooks and Seatbelt',
      'Single Leg Takedown — Attempt in Live Rolling',
    ],
    coachTip: 'Top game starts before the pass — it starts with getting there. Pass before you pin. Pin before you finish.',
  },

  'white_3': {
    phase: 'FINDING YOUR GAME',
    phaseDesc: 'Something that is yours is beginning to emerge. A guard that works. A pass that lands.',
    objective: 'Submit a Training Partner',
    objectiveNote: 'Coach-appropriate pairing. Even once counts.',
    requirements: [
      'One Functional Guard Confirmed by Coach',
      'One Reliable Pass — Works Consistently in Drilling',
      'Two Submission Threats from Different Positions',
      'Leg Lock Awareness — Know the Defense Posture (Not Executing)',
      'Chain Two Positions in One Live Roll',
    ],
    coachTip: 'Your coach should be able to describe your game in two sentences. Ask them to try.',
  },

  'white_4': {
    phase: 'BLUE BELT READINESS',
    phaseDesc: 'Not a technique evaluation. A character and craft decision. The room already knows.',
    objective: 'Let the Coach Start It',
    objectiveNote: 'The evaluation is initiated by your instructor — not requested.',
    requirements: [
      '96+ Total Classes Logged',
      'Competition Attended or 8+ Hard Rounds with Upper Belts',
      'Coach Can Describe Your Game Without Hesitation',
      'Actively Helping Newer White Belts',
      'Coach Initiates Blue Belt Evaluation Conversation',
    ],
    coachTip: 'The blue belt is not given because you know techniques. It is given because you know how to train. There is a difference.',
  },

  // ── BLUE BELT ────────────────────────────────────────────────────────────────

  'blue_0': {
    phase: 'FINDING YOUR GAME',
    phaseDesc: 'You are a blue belt now. Something works. Not everything — but something consistent is there.',
    objective: 'Submit Blue Belts Reliably',
    objectiveNote: 'Not every roll. Reliably — with a technique, not strength.',
    requirements: [
      'Primary Guard — 3+ Sweeps and 2+ Submission Entries',
      'Guard Pass with a Backup When First Is Defended',
      'Submission from Closed Guard — Drilling Completion',
      'Submission from Top — One That Works in Live Rolling',
      'Single Leg — Two Finish Options',
    ],
    coachTip: 'If you are muscling everything, you are teaching your body the wrong lesson. Blue belt is where strength stops being the answer.',
  },

  'blue_1': {
    phase: 'BACK ATTACK DANGER',
    phaseDesc: 'Your submission game is developing. You are becoming a finisher, not just a threat.',
    objective: 'Finish from Back Position',
    objectiveNote: 'Against an active, resisting partner — not a drilling rep.',
    requirements: [
      'Back Take — 3 Entries (Turtle, Guard Pass, Scramble)',
      'Rear Naked Choke — Finish on Resistant Partner',
      'Triangle Choke — Full Sequence Entry to Finish',
      'Armbar — Mount and Guard Versions, Transition When Defended',
      'Half Guard — One Sweep and Guard Recovery Option',
    ],
    coachTip: 'Submission attempts are now submissions. If you reach the position and do not finish, figure out why — then fix it.',
  },

  'blue_2': {
    phase: 'PASSING GAME ONLINE',
    phaseDesc: 'You are becoming hard to hold. Your passing game is starting to have a shape.',
    objective: 'Compete or Hard Roll',
    objectiveNote: '1 competition or 15+ hard rounds with purple and brown belts.',
    requirements: [
      'Torreando Pass — Two Directional Variations',
      'Leg Drag Concept — Hip Position and Knee Cut Connection',
      'Double Underhook Pass — Drive and Finish',
      'Leg Lock Awareness — Heel Hook Entry Defense from All Ashi',
      'Closed Guard Combos — Sweep, Armbar, Triangle Linked',
    ],
    coachTip: 'Compete. Even once. Training is practice. A tournament is the test. They are not the same thing.',
  },

  'blue_3': {
    phase: 'TEACHING WHAT YOU KNOW',
    phaseDesc: 'Near-purple proficiency. Your game is real. You are now a resource for others.',
    objective: 'Teach a White Belt',
    objectiveNote: 'Break down any technique until they can replicate it.',
    requirements: [
      'Straight Ankle Lock and Kneebar Entry — Safe in Controlled Rounds',
      'Two Functional Guards — Primary Developed, Secondary in Progress',
      'Three Distinct Passing Styles — Pressure, Leg Drag, Torreando',
      'Chain Three Offensive Positions in One Roll',
      'Demonstrate and Explain Any White Belt Technique On Request',
    ],
    coachTip: 'You can describe your A-game in detail now — what you want, how you get it, what you do when it is defended. If you cannot, the game is not yours yet.',
  },

  'blue_4': {
    phase: 'PURPLE BELT READINESS',
    phaseDesc: 'The question is when, not if. The coaching has turned into a conversation.',
    objective: 'Make a Training Partner Better',
    objectiveNote: 'Coach can identify a partner who improved because of rolling with you.',
    requirements: [
      '240+ Classes from Blue Belt Promotion',
      '3 Events Competed or 25+ Hard Rounds with Purple and Brown Belts',
      'Coach Can Name Your A-Game Without Asking',
      'Known in the Room for Making Training Partners Better',
      'Purple Belt Evaluation Formally Initiated by Coach',
    ],
    coachTip: 'At blue belt four, the work is no longer about you. The room can tell who is ready before the coach says anything.',
  },

  // ── PURPLE BELT ──────────────────────────────────────────────────────────────

  'purple_0': {
    phase: 'STRUCTURE AND DEPTH',
    phaseDesc: 'Your game has structure. You know what you are building and why.',
    objective: 'Dominate Blue Belts',
    objectiveNote: 'Not winning sometimes — dominant in the majority of rolls.',
    requirements: [
      'Primary Guard Fully Operational — 3 Sweeps, 2 Submissions, Pass Prevention',
      'Counter Wrestling — Sprawl, Front Headlock Series, Re-Shot',
      'No-Gi Application — Core Gi Game Transfers Without Grips',
      'Heel Hooks (Outside) — Controlled Entry in Drilling with Advanced Partners',
      'X-Guard Entry — From Single Leg or Standing Opponent',
    ],
    coachTip: 'Something new should be working at purple belt that was not there before. If nothing is new, you are refining — not developing.',
  },

  'purple_1': {
    phase: 'LEG LOCK INTEGRATION',
    phaseDesc: 'Your back system is developed. Leg locks are now part of the game — not isolated attacks.',
    objective: 'Chain the Back Sequence',
    objectiveNote: 'RNC → Bow and Arrow → Armbar if defended. In drilling.',
    requirements: [
      'Inside Heel Hook — Awareness, Entry ID, Defense Protocol',
      'Ashi Garami — Basic Outside, Inside, Cross Positions',
      'Back System — RNC → Bow and Arrow → Armbar Full Chain',
      'Guard Recovery Under Pressure — Timing and Knee Shield',
      'Berimbolo Concept — Enter and Understand the Positional Logic',
    ],
    coachTip: 'Leg lock entries are intentional or they are accidents. There is nothing in between.',
  },

  'purple_2': {
    phase: 'COMPETITION PROFICIENCY',
    phaseDesc: 'A second guard is operational. You are dangerous in multiple positions now.',
    objective: 'Tap a Brown Belt',
    objectiveNote: 'Even once is enough to show you belong in the conversation.',
    requirements: [
      'Second Guard Developed and Functional',
      'Inside Heel Hook — Controlled Execution with Coach-Approved Partner',
      'Pressure AND Movement Passing — Can Identify and Switch Systems',
      '3+ Competition Events or Coach Discretion Equivalent',
      'Can Run a Class and Accurately Teach Blue Belt Curriculum',
    ],
    coachTip: 'Brown belts take you seriously now. Not consistently — but you are no longer just a challenge for them. That is the signal.',
  },

  'purple_3': {
    phase: 'DEFINED AND KNOWN',
    phaseDesc: 'Near-brown proficiency. Your game is defined. The room knows who you are on the mat.',
    objective: 'Define Your A-Game',
    objectiveNote: 'Coach describes it in two sentences without hesitation.',
    requirements: [
      'Leg Lock System — Connected to Passing and Guard Game Naturally',
      'Full Guard Repertoire — Functional from Any Common Guard Position',
      'Two Working Takedown Entries with Live Finishes',
      'Character — Leader on the Mat Without Being Asked',
      'Brown Belt Evaluation Formally Initiated by Coach',
    ],
    coachTip: 'Brown belts and black belts take this athlete seriously in rolling. You know you are ready when they feel it before the coach says it.',
  },

  // ── BROWN BELT ───────────────────────────────────────────────────────────────

  'brown_0': {
    phase: 'REFINEMENT',
    phaseDesc: 'Filling in the holes. The refinement belt. Nothing is an accident anymore.',
    objective: 'Create a Problem for Black Belts',
    objectiveNote: 'Not winning the round. Landing something real.',
    requirements: [
      'Full Leg Lock System — Entry to Finish Chain Connected',
      'Turtle Attacks — Clock Choke, Leg Drag, Shoulder Roll, Turk',
      'Defensive Wrestling Complete — No Position Causes Freeze',
      'Teaching — Can Run Any Class Including Purple Belt Topics',
      'Ankle Picks and Foot Sweeps — Two Working Entries',
    ],
    coachTip: 'Coaching ability is as important as rolling ability at brown belt. If you cannot teach it, you do not fully own it.',
  },

  'brown_1': {
    phase: 'DEFENSE MATCHES OFFENSE',
    phaseDesc: 'Your defensive game matches your offense. You control the pace of the roll.',
    objective: 'Control the Pace',
    objectiveNote: 'Slow a live roll down intentionally — not because you are tired.',
    requirements: [
      'Scramble Control — Choose Chaotic or Methodical by Intention',
      'Submission Defense — Identifies Attack Before It Is Fully Locked',
      'Fatigue Game — Slow Partner by Controlling Pace, Grips, Position',
      'Judo Entries — Osoto, Kouchi, Ouchi — Two Viable Live Entries',
      'Documented Structural Weakness Being Addressed',
    ],
    coachTip: 'You know what you know and what you do not know. That self-awareness is rare. It is also what separates brown from black.',
  },

  'brown_2': {
    phase: 'NO MAJOR HOLES',
    phaseDesc: 'The black belt is visible. Not a question in the room anymore — a matter of time.',
    objective: 'Sweep a Black Belt',
    objectiveNote: 'Witnessed by coach. In live rolling.',
    requirements: [
      'All Major Submission Families — Joint, Choke, Leg Lock',
      'Guard Sweep Against Black Belt — Coach Witnessed',
      'Instruction at All Levels — Including Leg Lock Safety',
      'Competition Record — Regional Podium or Coach-Certified Equivalent',
      'First Person Newer Students Go to for Help — Not Assigned, Earned',
    ],
    coachTip: 'The black belt is no longer hypothetical. The coach is not deciding if — only when.',
  },

  'brown_3': {
    phase: 'BLACK BELT READINESS',
    phaseDesc: 'The room already calls you a black belt in conversation. The formal step is what remains.',
    objective: 'Embody the Culture',
    objectiveNote: 'This is not a technique conversation.',
    requirements: [
      'Age 19+ (IBJJF Standard)',
      'Minimum 18 Months at Brown Belt',
      'No Technical Holes the Coach Considers Disqualifying',
      'Character — Teaches Without Being Asked, Competes with Integrity',
      'The Room Already Calls You a Black Belt',
    ],
    coachTip: 'This is not a technique decision. It is a character, culture, and craft decision. The techniques are already there.',
  },

  // ── BLACK BELT (degrees) ──────────────────────────────────────────────────────

  'black_0': {
    phase: 'A NEW BEGINNING',
    phaseDesc: 'The black belt is not the end of the journey. It is the beginning of a new one.',
    objective: 'Build the Post-Black Belt Game',
    objectiveNote: 'Something new that was not present at brown belt.',
    requirements: [
      'Continue Competing or High-Level Rolling',
      'Teaching — Running Classes at All Levels',
      'Developing the Next Generation of Practitioners',
      'Minimum 1 Year at Black Belt',
      'Continue Asking Questions',
    ],
    coachTip: 'The black belt means you know enough to know how much you do not know. That is where real progress begins.',
  },

  'black_1': {
    phase: 'FIRST DEGREE — THE TEACHER',
    phaseDesc: 'The first degree is a teaching belt. Your mat is producing practitioners who reflect your understanding.',
    objective: 'Produce a Blue Belt',
    objectiveNote: 'An athlete you personally guided to blue belt.',
    requirements: [
      'Minimum 3 Years at Black Belt',
      'Teaching Consistently — Classes, Private Instruction, or Both',
      'First Practitioner You Personally Promoted to Blue Belt',
      'Active Competitor or High-Level Rolling Partner',
      'Recognized Instructor in the Community',
    ],
    coachTip: 'The first degree is earned by what you gave to the sport — not by what you took from it.',
  },

  'black_2': {
    phase: 'SECOND DEGREE — THE LINEAGE',
    phaseDesc: 'Your lineage is real. Athletes you have trained are now training others.',
    objective: 'Build a Lineage',
    objectiveNote: 'A student you promoted who has since promoted another.',
    requirements: [
      'Minimum 6 Years at Black Belt',
      'Promoted at Least One Black Belt or Multiple Colored Belt Practitioners',
      'Program or School — Running or Mentoring a Team',
      'Active in Competition or High-Level Practice Community',
      'Contribution to the Art Beyond Your Own Mat',
    ],
    coachTip: 'The second degree is the first time the belt stops being about you.',
  },

  'black_3': {
    phase: 'THIRD DEGREE — THE LEGACY',
    phaseDesc: 'Your impact on the art is documented. Other black belts trained under you.',
    objective: 'Shape the Next Generation of Black Belts',
    objectiveNote: 'Multiple black belt promotions with documented lineage.',
    requirements: [
      'Minimum 9 Years at Black Belt',
      'Multiple Black Belt Promotions',
      'Institutional Contribution — School, Organization, or National Body',
      'Recognized Authority on Technical and Cultural Standards',
      'Ongoing Teaching and Competition Presence',
    ],
    coachTip: 'At third degree, people are watching how you do things not just what you do.',
  },

  'black_4': {
    phase: 'FOURTH DEGREE — THE ELDER',
    phaseDesc: 'You are part of the history of the art. The mat respects you before you step on it.',
    objective: 'Define the Standard',
    objectiveNote: 'Your example is the curriculum.',
    requirements: [
      'Minimum 13 Years at Black Belt',
      'Distinguished Teaching Career',
      'Significant Competitive Legacy or High-Level Coaching Record',
      'Contribution to the Global Spread of the Art',
      'Character — The Belt Means the Same Thing It Did on Day One',
    ],
    coachTip: 'You have been doing this long enough to know that none of it was about the belt. That is the lesson.',
  },

};

export default async function CriteriaPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const params = await searchParams;
  const fromRank = params.from ?? '';

  // Parse fromRank: "white_2" → belt = "white", currentStripe = 2
  const parts = fromRank.split('_');
  const beltKey = parts[0] ?? 'white';
  const currentStripe = parseInt(parts[1] ?? '0', 10);
  const meta = BELT_META[beltKey] ?? BELT_META['white']!;

  // Black belt degree images — all degrees use the degree-specific images.
  // No plain black-belt.png in public; degree 0 defaults to first-degree.png.
  const BLACK_DEGREE_IMAGES: Record<number, string> = {
    0: '/first-degree.png',
    1: '/first-degree.png',
    2: '/second-degree.png',
    3: '/third-degree.png',
    4: '/fourth-degree.png',
  };
  const beltImage = beltKey === 'black'
    ? (BLACK_DEGREE_IMAGES[currentStripe] ?? '/first-degree.png')
    : meta.image;

  // Header title
  const headerTitle = beltKey === 'black' && currentStripe > 0
    ? `BLACK BELT • ${currentStripe}${currentStripe === 1 ? 'ST' : currentStripe === 2 ? 'ND' : currentStripe === 3 ? 'RD' : 'TH'} DEGREE`
    : currentStripe > 0
    ? `${meta.label} • STRIPE ${currentStripe}`
    : meta.label;

  // Next label
  const nextLabel = currentStripe < meta.maxStripes
    ? `STRIPE ${currentStripe + 1}`
    : meta.nextBelt;

  // Try DB for criteria
  const { data: criteriaRows } = await supabase
    .from('promotion_criteria')
    .select('from_rank, to_rank, criteria_json')
    .eq('gym_id', IRON_ARMY_GYM_ID)
    .eq('discipline', 'bjj')
    .eq('from_rank', fromRank)
    .eq('is_default', true)
    .limit(1);

  const dbRow = criteriaRows?.[0];

  // Lookup: exact fromRank first, then belt key fallback, then white_0
  const demoData =
    DEMO_PHASES[fromRank] ??
    DEMO_PHASES[`${beltKey}_0`] ??
    DEMO_PHASES['white_0']!;

  const requirements: string[] =
    (dbRow?.criteria_json as { must_show?: string[] } | null)?.must_show ??
    demoData.requirements;

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 100, position: 'relative' }}>

      {/* Full-screen BJJ background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src="/bjj-background.png" alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top',
        }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,4,3,0.82)' }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px 12px',
          borderBottom: '1px solid rgba(200,148,58,0.12)',
          background: 'rgba(5,4,3,0.60)',
          backdropFilter: 'blur(8px)',
        }}>
          <Link href="/progression" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(242,239,232,0.14)',
            }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="#F2EFE8" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
          </Link>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: fonts.header, fontSize: 17, letterSpacing: '0.06em',
              color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.80)',
            }}>{headerTitle}</div>
          </div>

          {/* Info icon */}
          <div style={{
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(242,239,232,0.14)',
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                 stroke="rgba(242,239,232,0.50)" strokeWidth="1.4" strokeLinecap="round">
              <circle cx="8" cy="8" r="6"/>
              <path d="M8 7v5"/>
              <circle cx="8" cy="5" r="0.5" fill="rgba(242,239,232,0.50)" stroke="none"/>
            </svg>
          </div>
        </div>

        {/* Belt image */}
        <div style={{ position: 'relative', width: '100%', height: 148, overflow: 'hidden' }}>
          <Image
            src={beltImage}
            alt={meta.label}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center center', opacity: 0.78 }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(5,4,3,0.88) 0%, transparent 28%, transparent 72%, rgba(5,4,3,0.88) 100%)',
            zIndex: 1,
          }}/>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(5,4,3,0.55) 0%, transparent 40%, rgba(5,4,3,0.70) 100%)',
            zIndex: 1,
          }}/>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: meta.accentColor, opacity: 0.55, zIndex: 2,
          }}/>
        </div>

        {/* Stripe progress */}
        <div style={{
          padding: '12px 16px 14px',
          borderBottom: '1px solid rgba(200,148,58,0.08)',
          background: 'rgba(5,4,3,0.50)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.14em', color: 'rgba(242,239,232,0.55)' }}>
              {currentStripe}/{meta.maxStripes} STRIPES
            </span>
            <span style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.12em', color: 'rgba(200,148,58,0.70)' }}>
              NEXT: {nextLabel}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {Array.from({ length: meta.maxStripes }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 3,
                background: i < currentStripe ? meta.accentColor : 'rgba(242,239,232,0.12)',
                boxShadow: i < currentStripe ? `0 0 6px ${meta.accentColor}88` : 'none',
              }}/>
            ))}
          </div>
        </div>

        {/* Interactive content */}
        <CriteriaClient
          fromRank={fromRank}
          accentColor={meta.accentColor}
          phase={demoData.phase}
          phaseDesc={demoData.phaseDesc}
          objective={demoData.objective}
          objectiveNote={demoData.objectiveNote}
          requirements={requirements}
          coachTip={demoData.coachTip}
        />

      </div>
    </main>
  );
}
