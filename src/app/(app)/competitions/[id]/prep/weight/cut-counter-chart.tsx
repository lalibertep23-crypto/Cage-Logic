'use client';

// Cut Counter — weight history bar chart for a comp period.
// Shows logged weights as bars trending toward the target line.
// Uses Recharts. No new dependencies needed.

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from 'recharts';
import { format, parseISO } from 'date-fns';

const C = {
  bg: '#1A1713', surface: '#252118', border: 'rgba(245,240,232,0.08)',
  text: '#F5F0E8', dim: 'rgba(245,240,232,0.38)', dimmer: 'rgba(245,240,232,0.22)',
  amber: '#D4922E', green: '#3D8B55',
};

type Log = { logged_date: string; weight_lbs: number };

function weekOverWeekDelta(logs: Log[], index: number): number | null {
  if (index >= logs.length - 1) return null;
  return logs[index].weight_lbs - logs[index + 1].weight_lbs;
}

export function CutCounterChart({
  logs,
  targetWeightLbs,
}: {
  logs: Log[];
  targetWeightLbs: number | null;
}) {
  if (logs.length === 0) {
    return (
      <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', color: C.dim }}>
        No weight logged yet. Log today above to start the cut counter.
      </p>
    );
  }

  // Chart wants ascending order
  const chartData = [...logs]
    .reverse()
    .map((l) => ({
      date: format(parseISO(l.logged_date), 'M/d'),
      weight: l.weight_lbs,
    }));

  const weights = chartData.map((d) => d.weight);
  const allValues = targetWeightLbs ? [...weights, targetWeightLbs] : weights;
  const minY = Math.floor(Math.min(...allValues)) - 2;
  const maxY = Math.ceil(Math.max(...allValues)) + 2;

  const currentWeight = logs[0].weight_lbs;
  const delta = targetWeightLbs != null ? currentWeight - targetWeightLbs : null;
  const onTrack = delta != null && delta <= 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Headline numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
        {[
          { label: 'CURRENT', value: String(currentWeight), unit: 'LBS', color: C.text },
          { label: 'TARGET',  value: targetWeightLbs != null ? String(targetWeightLbs) : '—', unit: 'LBS', color: C.text },
          {
            label: 'TO CUT',
            value: delta != null ? (delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)) : '—',
            unit: 'LBS',
            color: delta == null ? C.dim : onTrack ? C.green : C.amber,
          },
        ].map((stat) => (
          <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em', color: C.dimmer }}>
              {stat.label}
            </span>
            <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, color: stat.color }}>
              {stat.value}
            </span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, color: C.dimmer }}>
              {stat.unit}
            </span>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      {chartData.length > 0 && (
        <div style={{ height: 144, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: 'rgba(245,240,232,0.38)', fontFamily: 'var(--font-dm-mono)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[minY, maxY]}
                tick={{ fontSize: 9, fill: 'rgba(245,240,232,0.38)', fontFamily: 'var(--font-dm-mono)' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: C.surface,
                  border: `1px solid ${C.amber}`,
                  borderRadius: 0,
                  fontSize: 11,
                  fontFamily: 'var(--font-dm-mono)',
                }}
                labelStyle={{ color: C.dim }}
                itemStyle={{ color: C.amber }}
                formatter={(v: number) => [`${v} lbs`, 'Weight']}
              />
              {targetWeightLbs != null && (
                <ReferenceLine
                  y={targetWeightLbs}
                  stroke={C.amber}
                  strokeDasharray="4 2"
                  label={{
                    value: `Target ${targetWeightLbs}`,
                    position: 'insideTopRight',
                    fill: C.amber,
                    fontSize: 9,
                    fontFamily: 'var(--font-dm-mono)',
                  }}
                />
              )}
              <Bar dataKey="weight" maxBarSize={32} radius={[0, 0, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      targetWeightLbs != null && entry.weight <= targetWeightLbs + 1
                        ? C.green
                        : C.amber
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Week-over-week delta list */}
      {logs.length > 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 11, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 8 }}>
            WEEK OVER WEEK
          </div>
          {logs.slice(0, 5).map((log, i) => {
            const d = weekOverWeekDelta(logs, i);
            const deltaColor = d == null ? C.dim : d < 0 ? C.green : d > 0 ? '#ef4444' : C.dim;
            return (
              <div
                key={log.logged_date}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 0',
                  borderTop: i === 0 ? 'none' : `1px solid ${C.border}`,
                }}
              >
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', color: C.dim }}>
                  {format(parseISO(log.logged_date), 'EEE M/d')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', color: C.text }}>
                    {log.weight_lbs} lbs
                  </span>
                  {d != null && (
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', color: deltaColor, minWidth: 48, textAlign: 'right' }}>
                      {d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
