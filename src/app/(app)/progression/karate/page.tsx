// Karate Roadmap — server page.
// Fetches athlete's current belt and lineage, passes to client component.

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import KarateRoadmapClient from './KarateRoadmapClient';
import { BrandNav } from '@/components/ui/brand-nav';

export const dynamic = 'force-dynamic';

export default async function KarateRoadmapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: rows } = await supabase
    .from('athlete_disciplines')
    .select('rank_color, stripes')
    .eq('athlete_id', user.id)
    .eq('discipline', 'karate')
    .limit(1);

  // rank_color stores belt key: white / orange / green / blue / brown / black
  // stripes stores lineage: 0=shotokan, 1=kyokushin, 2=goju_ryu
  const currentBeltKey = rows?.[0]?.rank_color ?? 'white';
  const lineageNum     = rows?.[0]?.stripes     ?? 0;
  const lineage =
    lineageNum === 1 ? 'kyokushin' :
    lineageNum === 2 ? 'goju_ryu'  :
    'shotokan';

  return <KarateRoadmapClient currentBeltKey={currentBeltKey} lineage={lineage} />;
}
