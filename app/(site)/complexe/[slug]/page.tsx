import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAgent } from "@/lib/agents";
import { COMPLEXES, COMPLEX_BY_SLUG, complexProperties } from "@/lib/complexes";
import ComplexView from "./ComplexView";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return COMPLEXES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await props.params;
  const complex = COMPLEX_BY_SLUG[slug];
  if (!complex) return {};

  const title = `${complex.name} — ${complex.developer}, ${complex.street}`;
  const description = complex.description.ro.split(". ").slice(0, 2).join(". ");
  const cover = complex.photos[0];

  return {
    title,
    description,
    alternates: { canonical: `/complexe/${complex.slug}` },
    openGraph: {
      type: "website",
      locale: "ro_MD",
      siteName: "ARCA",
      title,
      description,
      url: `/complexe/${complex.slug}`,
      images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt.ro }],
    },
  };
}

export default async function ComplexPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const complex = COMPLEX_BY_SLUG[slug];
  if (!complex) notFound();

  const agent = getAgent(complex.agentSlug);
  if (!agent) notFound();

  return <ComplexView complex={complex} agent={agent} properties={complexProperties(slug)} />;
}
