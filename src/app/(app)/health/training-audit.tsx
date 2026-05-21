'use client';

import { useActionState, useState } from 'react';
import { saveActivityProfileAction, type ActivityProfileState } from './actions';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:       '#1A1713',
  bgSunk:   '#13110E',
  surface:  '#252118',
  border:  'rgba(245,240,232,0.13)',
  text:     '#F5F0E8',
  dim:      'rgba(245,240,232,0.55)',
  dimmer:   'rgba(245,240,232,0.35)',
  amber:    '#D4922E',
  amberLow: 'rgba(201,130,42,0.35)',
  green:    '#3D8B55',
  greenLow: 'rgba(42,92,63,0.4)',
  brick:    '#8B3A1E',
  brickLow: 'rgba(139,58,30,0.35)',
  midLow:   '#B8B2A8',
};

const REGION_LABELS: Record<string, string> = {
  head: 'HEAD', neck: 'NECK', shoulder: 'SHOULDER', elbow: 'ELBOW',
  wrist_hand: 'WRIST/HAND', ribs: 'RIBS', upper_back: 'UPPER BACK',
  low_back: 'LOWER BACK', hip_groin: 'HIP/GROIN', knee: 'KNEE',
  ankle_foot: 'ANKLE/FOOT', other: 'OTHER',
};

const JOB_OPTIONS = [
  { value: 'construction',   label: 'CONSTRUCTION / TRADES' },
  { value: 'manual_labor',   label: 'MANUAL LABOR' },
  { value: 'mixed',          label: 'MIXED — DESK + PHYSICAL' },
  { value: 'sedentary',      label: 'DESK / SEDENTARY' },
  { value: 'other',          label: 'OTHER' },
];

const INTENSITY_OPTIONS = [
  { value: 'heavy',    label: 'HEAVY — max effort compound lifts' },
  { value: 'moderate', label: 'MODERATE — working sets, not maxing' },
  { value: 'light',    label: 'LIGHT — machines, accessory work' },
  { value: 'none',     label: 'NO LIFTING' },
];

// ── Load mode helpers ─────────────────────────────────────────────────────────
function loadModeColor(mode: string) {
  if (mode === 'RECOVER') return C.brick;
  if (mode === 'BUILD')   return C.green;
  return C.amber;
}

function loadModeDescription(
  mode: string,
  acwr: number,
  dayJobCategory: string | null,
  liftingDays: number | null,
  liftingIntensity: string | null
): string {
  const isManual = ['construction', 'manual_labor'].includes(dayJobCategory ?? '');
  const heavyLifts = liftingDays && liftingDays >= 3 && liftingIntensity === 'heavy';

  if (mode === 'RECOVER') {
    if (isManual && heavyLifts) {
      return `Your load this week spiked significantly (ACWR ${acwr.toFixed(2)}). Combined with a physical job and heavy lifting, your system is carrying more than most people realize. A recovery week — technique-only sessions, lighter lifting, extra sleep — will return more than pushing through.`;
    }
    return `Your load spiked this week (ACWR ${acwr.toFixed(2)}). Acute load is running well above your training base. A reduced week now is a performance investment, not a setback.`;
  }

  if (mode === 'BUILD') {
    return `Your recent training load is below your baseline (ACWR ${acwr.toFixed(2)}). This is a good week to push — your body is recovered and ready for higher stimulus. Add a session or increase intensity on a roll.`;
  }

  // MAINTAIN
  if (isManual && heavyLifts) {
    return `Load is balanced this week (ACWR ${acwr.toFixed(2)}). Your combination of physical work, heavy lifting, and BJJ is already a high total load. Maintaining this rhythm is the goal — adding volume here often breaks the pattern in week 3 or 4.`;
  }
  return `Load is well-calibrated this week (ACWR ${acwr.toFixed(2)}). Keep training at this rhythm and your adaptation will compound.`;
}

function crossTrainingRec(
  liftingDays: number | null,
  liftingIntensity: string | null,
  dayJobCategory: string | null,
  mode: string
): string | null {
  const isManual = ['construction', 'manual_labor'].includes(dayJobCategory ?? '');
  const days = liftingDays ?? 0;
  const intensity = liftingIntensity ?? 'none';

  if (mode === 'RECOVER') {
    if (intensity === 'heavy' && days >= 4) {
      return 'Four or more days of heavy lifting plus BJJ is a high collision load. Swapping one heavy day for yoga or a mobility session this week reduces connective tissue stress without losing training density.';
    }
    if (isManual && days >= 3) {
      return 'Your job already generates significant physical load every workday. Three or more gym sessions on top adds up fast. Consider dropping to two moderate lifting days this week.';
    }
  }

  if (mode === 'MAINTAIN' && intensity === 'heavy' && days >= 4) {
    return 'Four or more heavy lifting days plus regular BJJ is a high weekly load. Research supports two to three strength sessions being equally effective for retention with significantly lower injury risk when combined with a combat sport.';
  }

  return null;
}

// ── Props ─────────────────────────────────────────────────────────────────────
export type TrainingAuditProps = {
  acwr: number;
  loadMode: 'BUILD' | 'MAINTAIN' | 'RECOVER';
  avgSoreness7: number | null;
  sessionCount7: number;
  activeInjuryCount: number;
  topRegions: { key: string; count: number }[];
  dayJobCategory: string | null;
  dayJobPhysical: number | null;
  weeklyLiftingDays: number | null;
  liftingIntensity: string | null;
};

// ── Component ─────────────────────────────────────────────────────────────────
export function TrainingAudit({
  acwr,
  loadMode,
  avgSoreness7,
  sessionCount7,
  activeInjuryCount,
  topRegions,
  dayJobCategory,
  dayJobPhysical,
  weeklyLiftingDays,
  liftingIntensity,
}: TrainingAuditProps) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [state, formAction, pending] = useActionState<ActivityProfileState, FormData>(
    saveActivityProfileAction,
    {}
  );

  const modeColor = loadModeColor(loadMode);
  const modeDescription = loadModeDescription(loadMode, acwr, dayJobCategory, weeklyLiftingDays, liftingIntensity);
  const crossTrainTip = crossTrainingRec(weeklyLiftingDays, liftingIntensity, dayJobCategory, loadMode);
  const profileSet = weeklyLiftingDays !== null && liftingIntensity !== null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

      {/* ── Load mode card ───────────────────────────────────────────── */}
      <div style={{
        background: C.surface,
        borderLeft: `3px solid ${modeColor}`,
        padding: '18px 16px 18px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
          <span style={{
            fontFamily: 'var(--font-anton)', fontSize: 28,
            letterSpacing: '0.06em', color: modeColor, lineHeight: 1,
          }}>
            {loadMode}
          </span>
          <span style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 9,
            letterSpacing: '0.12em', color: C.dimmer,
          }}>
            THIS WEEK
          </span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 14 }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-anton)', fontSize: 20,
              color: acwr > 1.3 ? C.brick : acwr < 0.8 ? C.green : C.amber,
              lineHeight: 1,
            }}>
              {acwr.toFixed(2)}
            </div>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 8,
              letterSpacing: '0.1em', color: C.dimmer, marginTop: 2,
            }}>ACWR</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 20, color: C.dim, lineHeight: 1 }}>
              {sessionCount7}
            </div>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 8,
              letterSpacing: '0.1em', color: C.dimmer, marginTop: 2,
            }}>SESSIONS / 7 DAYS</div>
          </div>
          {avgSoreness7 !== null && (
            <div>
              <div style={{
                fontFamily: 'var(--font-anton)', fontSize: 20,
                color: avgSoreness7 >= 7 ? C.brick : avgSoreness7 >= 4 ? C.amber : C.green,
                lineHeight: 1,
              }}>
                {avgSoreness7.toFixed(1)}
              </div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 8,
                letterSpacing: '0.1em', color: C.dimmer, marginTop: 2,
              }}>AVG SORENESS</div>
            </div>
          )}
          {activeInjuryCount > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-anton)', fontSize: 20, color: C.brick, lineHeight: 1 }}>
                {activeInjuryCount}
              </div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 8,
                letterSpacing: '0.1em', color: C.dimmer, marginTop: 2,
              }}>ACTIVE INJUR{activeInjuryCount === 1 ? 'Y' : 'IES'}</div>
            </div>
          )}
        </div>

        <p style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 10,
          letterSpacing: '0.03em', lineHeight: 1.75,
          color: C.dim, margin: 0,
        }}>
          {modeDescription}
        </p>

        {/* Cross-training rec */}
        {crossTrainTip && (
          <div style={{
            marginTop: 14, paddingTop: 12,
            borderTop: `1px solid ${C.border}`,
          }}>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 8,
              letterSpacing: '0.14em', color: C.dimmer,
            }}>
              LOAD RECOMMENDATION —{' '}
            </span>
            <p style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10,
              letterSpacing: '0.03em', lineHeight: 1.75,
              color: C.dim, margin: '6px 0 0',
            }}>
              {crossTrainTip}
            </p>
          </div>
        )}
      </div>

      {/* ── Top soreness regions ─────────────────────────────────────── */}
      {topRegions.length > 0 && (
        <div style={{ background: C.surface, padding: '16px 16px' }}>
          <span style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 8,
            letterSpacing: '0.14em', color: C.dimmer,
            display: 'block', marginBottom: 12,
          }}>
            MOST FLAGGED REGIONS — 30 DAYS
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topRegions.map(({ key, count }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontFamily: 'var(--font-bebas)', fontSize: 13,
                  letterSpacing: '0.16em', color: '#FFD97A',
                  minWidth: 100,
                }}>
                  {REGION_LABELS[key] ?? key.toUpperCase()}
                </span>
                <div style={{ flex: 1, height: 3, background: C.border }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (count / 30) * 100)}%`,
                    background: count >= 5 ? C.amber : count >= 2 ? 'rgba(212,146,46,0.6)' : C.dimmer,
                  }} />
                </div>
                <span style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                  color: C.dimmer, minWidth: 24, textAlign: 'right',
                }}>
                  {count}×
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Activity profile ─────────────────────────────────────────── */}
      <div style={{ background: C.surface, padding: '16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 8,
            letterSpacing: '0.14em', color: C.dimmer,
          }}>
            YOUR WEEK OUTSIDE BJJ
          </span>
          {profileSet && !editingProfile && (
            <button
              onClick={() => setEditingProfile(true)}
              style={{
                background: 'none', border: 'none',
                fontFamily: 'var(--font-dm-mono)', fontSize: 8,
                letterSpacing: '0.1em', color: C.dimmer,
                cursor: 'pointer',
              }}
            >
              EDIT
            </button>
          )}
        </div>

        {!editingProfile && profileSet ? (
          <div style={{ display: 'flex', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.14em', color: C.dim }}>
                {JOB_OPTIONS.find(j => j.value === dayJobCategory)?.label ?? dayJobCategory?.toUpperCase()}
              </div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 8,
                letterSpacing: '0.1em', color: C.dimmer, marginTop: 2,
              }}>JOB TYPE</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.14em', color: C.dim }}>
                {weeklyLiftingDays} DAY{weeklyLiftingDays !== 1 ? 'S' : ''} / {liftingIntensity?.toUpperCase()}
              </div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 8,
                letterSpacing: '0.1em', color: C.dimmer, marginTop: 2,
              }}>LIFTING</div>
            </div>
          </div>
        ) : (
          <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!profileSet && (
              <p style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                letterSpacing: '0.03em', lineHeight: 1.7,
                color: C.dim, margin: 0,
              }}>
                Tell us about your week outside BJJ. This makes your load recommendation accurate.
              </p>
            )}

            {/* Lifting days */}
            <div>
              <span style={{
                fontFamily: 'var(--font-bebas)', fontSize: 13,
                letterSpacing: '0.18em', color: C.midLow,
                display: 'block', marginBottom: 8,
              }}>
                LIFTING DAYS / WEEK
              </span>
              <div style={{ display: 'flex', background: C.bgSunk, gap: 1 }}>
                {[0,1,2,3,4,5,6,7].map((n) => (
                  <button
                    key={n}
                    type="button"
                    style={{
                      flex: 1, height: 40,
                      background: weeklyLiftingDays === n ? C.amber : 'transparent',
                      color: weeklyLiftingDays === n ? C.bg : C.midLow,
                      border: 'none',
                      fontFamily: 'var(--font-dm-mono)',
                      fontSize: 11, cursor: 'pointer',
                    }}
                    onClick={() => {
                      const fd = new FormData();
                      fd.set('weekly_lifting_days', String(n));
                      fd.set('lifting_intensity', liftingIntensity ?? 'moderate');
                      formAction(fd);
                      setEditingProfile(false);
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Lifting intensity */}
            <div>
              <span style={{
                fontFamily: 'var(--font-bebas)', fontSize: 13,
                letterSpacing: '0.18em', color: C.midLow,
                display: 'block', marginBottom: 8,
              }}>
                LIFTING INTENSITY
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {INTENSITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      const fd = new FormData();
                      fd.set('weekly_lifting_days', String(weeklyLiftingDays ?? 0));
                      fd.set('lifting_intensity', opt.value);
                      formAction(fd);
                      setEditingProfile(false);
                    }}
                    style={{
                      background: liftingIntensity === opt.value ? C.amberLow : C.bgSunk,
                      border: `1px solid ${liftingIntensity === opt.value ? C.amber : C.border}`,
                      color: liftingIntensity === opt.value ? C.amber : C.dim,
                      padding: '10px 14px',
                      fontFamily: 'var(--font-dm-mono)',
                      fontSize: 10, letterSpacing: '0.06em',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'background 100ms',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {state?.error && (
              <p style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                color: C.brick, margin: 0,
              }}>
                {state.error}
              </p>
            )}
          </form>
        )}
      </div>

      {/* ACWR explainer */}
      <div style={{
        background: C.surface, padding: '12px 16px',
        borderTop: `1px solid rgba(245,240,232,0.06)`,
      }}>
        <p style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 8,
          letterSpacing: '0.06em', lineHeight: 1.7,
          color: C.dimmer, margin: 0,
        }}>
          ACWR (Acute:Chronic Workload Ratio) compares your last 7 days of training load against your 28-day baseline. Safe zone: 0.8–1.3. Above 1.5 is elevated injury risk. Calculated from your logged session intensity and duration.
        </p>
      </div>

    </div>
  );
}
                                                     