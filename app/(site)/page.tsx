import AgentStrip, { type AgentCard } from "@/components/AgentStrip";
import ComplexStrip, { type ComplexItem } from "@/components/ComplexStrip";
import CtaBand from "@/components/CtaBand";
import GuideCards from "@/components/GuideCards";
import Hero from "@/components/Hero";
import HomePicks from "@/components/HomePicks";
import MarketBand, { type MarketTile } from "@/components/MarketBand";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import SectorGrid, { type SectorTile } from "@/components/SectorGrid";
import Stats from "@/components/Stats";
import { livePortfolio } from "@/app/api/_data/live";
import { AGENTS } from "@/lib/agents";
import { COMPLEXES, complexProperties } from "@/lib/complexes";
import { formatCount } from "@/lib/format";
import { CITY_SALE, INDEX_ROWS, INDEX_UPDATED } from "@/lib/market-index";
import { CITY_SECTORS } from "@/lib/sectors";

/* The six dearest sectors that have enough offers for an honest median. */
const marketTiles: MarketTile[] = INDEX_ROWS.filter((r) => r.sale)
  .slice(0, 6)
  .map((r) => ({ sector: r.sector, median: r.sale?.median ?? 0, offers: r.offers }));

const complexes: ComplexItem[] = COMPLEXES.map((complex) => ({
  complex,
  offers: complexProperties(complex.slug).length,
})).slice(0, 4);

export default async function Home() {
  const properties = await livePortfolio();
  const total = properties.length;

  /* The selection leads with exclusives: those are the listings only we carry,
     and they are the reason to look here instead of on a portal. */
  const picks = properties
    .filter((p) => p.featured)
    .sort(
      (a, b) =>
        Number(b.flags.includes("exclusivitate")) - Number(a.flags.includes("exclusivitate"))
    )
    .slice(0, 3);

  const picked = new Set(picks.map((p) => p.slug));
  const fresh = [...properties]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .filter((p) => !picked.has(p.slug))
    .slice(0, 3);

  const tiles: SectorTile[] = CITY_SECTORS.map((s) => ({
    slug: s.slug,
    name: s.name,
    // CITY_SECTORS is already filtered to the six sectors that have a tile photo.
    image: s.image as string,
    count: properties.filter((p) => p.sector === s.slug).length,
  }));

  const team: AgentCard[] = AGENTS.map((agent) => ({
    agent,
    count: properties.filter((p) => p.agentSlug === agent.slug).length,
  }));

  return (
    <>
      <Hero total={total} />
      <SearchBar total={total} />

      <HomePicks
        kicker={{ ro: "Selecția ARCA", ru: "Выбор ARCA" }}
        title={{
          ro: "Ofertele pe care le arătăm primele",
          ru: "Объекты, которые мы показываем первыми",
        }}
        note={{
          ro: "Fotografiate de noi, cu actele verificate înainte de publicare.",
          ru: "Сняты нами, документы проверены до публикации.",
        }}
        href="/proprietati"
        linkLabel={{
          ro: `Vezi toate cele ${formatCount(total, "proprietate", "proprietăți", "ro")} →`,
          ru: `Смотреть все объекты (${total}) →`,
        }}
      >
        {/* No priority on these: the hero photograph is the LCP element and
            nothing else on the page should compete with it for bandwidth. */}
        {picks.map((p, i) => (
          <PropertyCard key={p.slug} property={p} delay={i * 90} />
        ))}
      </HomePicks>

      <SectorGrid tiles={tiles} />

      <MarketBand tiles={marketTiles} city={CITY_SALE} updated={INDEX_UPDATED} />

      <HomePicks
        kicker={{ ro: "Proaspăt în portofoliu", ru: "Новое в портфеле" }}
        title={{ ro: "Adăugate recent", ru: "Добавлены недавно" }}
        href="/proprietati"
        linkLabel={{ ro: "Vezi toate ofertele →", ru: "Смотреть все предложения →" }}
        variant="rail"
      >
        {fresh.map((p, i) => (
          <PropertyCard
            key={p.slug}
            property={p}
            delay={i * 90}
            // The rail shows one card at 84% of the screen, not a full-width one.
            sizes="(max-width: 699px) 84vw, (max-width: 1099px) 50vw, 358px"
          />
        ))}
      </HomePicks>

      <ComplexStrip items={complexes} />

      <Stats properties={total} />

      <GuideCards />

      <AgentStrip items={team} />

      <CtaBand />
    </>
  );
}
