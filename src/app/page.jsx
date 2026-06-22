import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/public/SiteHeader";
import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import Programs from "@/components/public/Programs";
import ImpactDashboard from "@/components/public/ImpactDashboard";
import ImpactGrowth from "@/components/public/ImpactGrowth";
import Achievements from "@/components/public/Achievements";
import VolunteerCTA from "@/components/public/VolunteerCTA";
import FloatingActions from "@/components/public/FloatingActions";
import SiteFooter from "@/components/public/SiteFooter";

export const revalidate = 3600; // refreshed instantly on metric edits via revalidatePath('/')

export default async function HomePage() {
  const supabase = createClient();
  const [{ data: metrics }, { data: achievements }] = await Promise.all([
    supabase.from("impact_metrics").select("*").eq("is_public", true).order("sort"),
    supabase.from("achievements").select("*").eq("published", true)
      .order("happened_on", { ascending: false }).limit(6),
  ]);

  const list = metrics ?? [];
  // Pick 3 headline numbers for the hero teaser.
  const teaserKeys = ["surgeries", "food_baskets", "field_kitchen"];
  const teasers = teaserKeys
    .map((k) => list.find((m) => m.key === k))
    .filter(Boolean);

  return (
    <>
      <SiteHeader />
      <main>
        <Hero teasers={teasers} />
        <About />
        <Programs />
        <ImpactDashboard metrics={list} />
        <ImpactGrowth />
        <Achievements items={achievements ?? []} />
        <VolunteerCTA />
      </main>
      <SiteFooter />
      <FloatingActions />
    </>
  );
}
