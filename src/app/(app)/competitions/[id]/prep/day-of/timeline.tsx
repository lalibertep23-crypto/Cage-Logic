'use client';

// Timeline computation — pure client-side, no DB reads.
// Anchors to weigh-in time if available, falls back to first match time.

const C = {
  bg: '#1A1713', surface: '#252118', border:  'rgba(245,240,232,0.13)',
  text: '#F5F0E8', dim: 'rgba(245,240,232,0.55)', dimmer: 'rgba(245,240,232,0.22)',
  amber: '#D4922E',
};

type TimelineRow = {
  label: string;
  time: string;
  highlight?: boolean;
};

function addMinutes(base: Date, minutes: number): Date {
  return new Date(base.getTime() + minutes * 60 * 1000);
}

function subtractMinutes(base: Date, minutes: number): Date {
  return addMinutes(base, -minutes);
}

function fmtTime(d: Date): string {
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function buildWeighInTimeline(weighIn: Date, firstMatch: Date | null): TimelineRow[] {
  const rows: TimelineRow[] = [
    { label: 'Wake. Light breakfast.', time: fmtTime(subtractMinutes(weighIn, 540)) },
    { label: 'Last full meal. Carbs + protein.', time: fmtTime(subtractMinutes(weighIn, 420)) },
    { label: 'Stop eating solids. Sip water only.', time: fmtTime(subtractMinutes(weighIn, 180)) },
    { label: 'Arrive venue. Gear check.', time: fmtTime(subtractMinutes(weighIn, 60)) },
    { label: 'Weigh in.', time: fmtTime(weighIn), highlight: true },
    { label: 'Rehydrate. Electrolyte drink, 16–24 oz.', time: fmtTime(addMinutes(weighIn, 15)) },
    { label: 'Light meal.', time: fmtTime(addMinutes(weighIn, 60)) },
    { label: 'Continue hydrating.', time: fmtTime(addMinutes(weighIn, 120)) },
  ];

  if (firstMatch) {
    rows.push(
      { label: 'Begin warm-up.', time: fmtTime(subtractMinutes(firstMatch, 60)) },
      {
        label: 'CAP clench activation. Jaw set, hands closed.',
        time: fmtTime(subtractMinutes(firstMatch, 20)),
        highlight: true,
      },
      { label: 'Compete.', time: fmtTime(firstMatch), highlight: true }
    );
  }

  return rows;
}

function buildMatchOnlyTimeline(firstMatch: Date): TimelineRow[] {
  return [
    { label: 'Wake.', time: fmtTime(subtractMinutes(firstMatch, 540)) },
    { label: 'Breakfast. Carbs + protein.', time: fmtTime(subtractMinutes(firstMatch, 420)) },
    { label: 'Last full meal.', time: fmtTime(subtractMinutes(firstMatch, 240)) },
    { label: 'Arrive venue. Gear check.', time: fmtTime(subtractMinutes(firstMatch, 120)) },
    { label: 'Begin warm-up.', time: fmtTime(subtractMinutes(firstMatch, 60)) },
    {
      label: 'CAP clench activation. Jaw set, hands closed.',
      time: fmtTime(subtractMinutes(firstMatch, 20)),
      highlight: true,
    },
    { label: 'Compete.', time: fmtTime(firstMatch), highlight: true },
  ];
}

// Parse "HH:MM" time string into today's Date
function parseTimeToday(timeStr: string): Date {
  const [hh, mm] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d;
}

export function DayOfTimeline({
  weighInTime,
  firstMatchTime,
}: {
  weighInTime: string | null;
  firstMatchTime: string | null;
}) {
  if (!weighInTime && !firstMatchTime) return null;

  const weighIn = weighInTime ? parseTimeToday(weighInTime) : null;
  const firstMatch = firstMatchTime ? parseTimeToday(firstMatchTime) : null;

  const rows =
    weighIn
      ? buildWeighInTimeline(weighIn, firstMatch)
      : buildMatchOnlyTimeline(firstMatch!);

  return (
    <div style={{ background: C.surface, padding: '14px 14px' }}>
      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 12 }}>
        DAY-OF TIMELINE
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              padding: '8px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${C.border}`,
            }}
          >
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em',
              color: row.highlight ? C.amber : C.dim,
              minWidth: 72, flexShrink: 0,
            }}>
              {row.time}
            </span>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em',
              lineHeight: 1.5,
              color: row.highlight ? C.text : C.dim,
              fontWeight: row.highlight ? 600 : 400,
            }}>
              {row.label}
            </span>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.04em', color: C.dimmer, marginTop: 10 }}>
        BRACKET RELEASES TYPICALLY THURSDAY. UPDATE FIRST MATCH TIME WHEN YOU KNOW IT.
      </p>
    </div>
  );
}
