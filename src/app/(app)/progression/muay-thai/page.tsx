// Muay Thai Roadmap — server component.
// Fetches athlete's current prajied rank from Supabase, renders MuayThaiRoadmapClient.

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MuayThaiRoadmapClient from './MuayThaiRoadmapClient';
import { BrandNav } from '@/components/ui/brand-nav';

export const dynamic = 'force-dynamic';

export default async function MuayThaiRoadmapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: rows } = await supabase
    .from('athlete_disciplines')
    .select('rank_color, stripes')
    .eq('athlete_id', user.id)
    .eq('discipline', 'muay_thai')
    .limit(1);

  const currentRank = rows?.[0]?.rank_color ?? 'prajied_1';

  return <MuayThaiRoadmapClient currentRank={currentRank} />;
}
