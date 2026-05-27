// Sambo Roadmap — server page.
// Fetches athlete's current sambo tier, passes to client component.

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SamboRoadmapClient from './SamboRoadmapClient';

export const dynamic = 'force-dynamic';

export default async function SamboRoadmapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: rows } = await supabase
    .from('athlete_disciplines')
    .select('rank_color, stripes')
    .eq('athlete_id', user.id)
    .eq('discipline', 'sambo')
    .limit(1);

  const currentTierKey = rows?.[0]?.rank_color ?? 'level_1';

  return <SamboRoadmapClient currentTierKey={currentTierKey} />;
}
