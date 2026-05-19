// Health check — confirms the app can talk to Supabase under RLS.
// Hits the gyms table (public-read policy) and reports the row count.
// Visit at http://localhost:3000/health

import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function HealthPage() {
  const supabase = await createClient();

  const startedAt = Date.now();
  const { count, error } = await supabase
    .from('gyms')
    .select('*', { count: 'exact', head: true });
  const elapsedMs = Date.now() - startedAt;

  const ok = !error;

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 640 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Cage Logic health check</h1>

      <div
        style={{
          padding: '1rem',
          borderRadius: 8,
          border: `2px solid ${ok ? '#16a34a' : '#dc2626'}`,
          background: ok ? '#f0fdf4' : '#fef2f2',
          marginBottom: '1rem',
        }}
      >
        <strong style={{ color: ok ? '#15803d' : '#b91c1c' }}>
          {ok ? 'Connected to Supabase.' : 'Failed to reach Supabase.'}
        </strong>
      </div>

      <dl style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>
        <dt style={{ fontWeight: 600 }}>Supabase URL</dt>
        <dd style={{ marginBottom: '0.5rem', fontFamily: 'monospace' }}>
          {process.env.NEXT_PUBLIC_SUPABASE_URL ?? '(not set)'}
        </dd>

        <dt style={{ fontWeight: 600 }}>Query</dt>
        <dd style={{ marginBottom: '0.5rem', fontFamily: 'monospace' }}>
          select count(*) from gyms
        </dd>

        <dt style={{ fontWeight: 600 }}>Result</dt>
        <dd style={{ marginBottom: '0.5rem' }}>
          {ok ? `${count ?? 0} row(s)` : <span style={{ color: '#b91c1c' }}>{error?.message}</span>}
        </dd>

        <dt style={{ fontWeight: 600 }}>Round-trip</dt>
        <dd>{elapsedMs} ms</dd>
      </dl>

      <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666' }}>
        This page is a V1 diagnostic. It will be removed before production. If you see
        &quot;Connected&quot; with 0 rows, the schema is reachable and RLS is permitting
        anonymous read on the gyms table — both expected at this stage.
      </p>
    </main>
  );
}
