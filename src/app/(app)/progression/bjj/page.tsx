// BJJ Roadmap — server page.
// Fetches athlete's current belt (rank_color) and stripe count.

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BjjRoadmapClient from './BjjRoadmapClient';

export const dynamic = 'force-dynamic';

export default async function BjjRoadmapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: rows } = await supabase
    .from('athlete_disciplines')
    .select('rank_color, stripes')
    .eq('athlete_id', user.id)
    .eq('discipline', 'bjj')
    .limit(1);

  const currentBeltKey = (rows?.[0]?.rank_color as string | null) ?? 'white';
  const currentStripes = (rows?.[0]?.stripes as number | null) ?? 0;

  return <BjjRoadmapClient currentBeltKey={currentBeltKey} currentStripes={currentStripes} />;
}
