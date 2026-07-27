import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { livePortfolio } from "@/app/api/_data/live";
import { AGENTS, getAgent } from "@/lib/agents";
import AgentView from "./AgentView";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return AGENTS.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) return {};

  return {
    title: `${agent.name} — ${agent.role.ro}`,
    description: agent.bio.ro.split("\n")[0].slice(0, 180),
    alternates: { canonical: `/agenti/${agent.slug}` },
    openGraph: {
      type: "profile",
      title: `${agent.name} · ARCA`,
      description: agent.role.ro,
      images: [agent.photo.src],
    },
  };
}

export default async function AgentPage({ params }: Props) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  const all = await livePortfolio();
  const properties = all.filter((p) => p.agentSlug === slug && p.status !== "arhivat");

  return <AgentView agent={agent} properties={properties} />;
}
