// Boxing Roadmap — server page. Fetches athlete's current tier, passes to client component.

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BoxingRoadmapClient from './BoxingRoadmapClient';
import { BrandNav } from '@/components/ui/brand-nav';

export const dynamic = 'force-dynamic';

export default async function BoxingRoadmapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: rows } = await supabase
    .from('athlete_disciplines')
    .select('rank_color')
    .eq('athlete_id', user.id)
    .eq('discipline', 'boxing')
    .limit(1);

  const currentTierKey = rows?.[0]?.rank_color ?? 'foundation';

  return <BoxingRoadmapClient currentTierKey={currentTierKey} />;
}
