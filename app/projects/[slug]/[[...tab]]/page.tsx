import ProjectAnalytics from "@/components/projects/project-analytics";
import { PROJECT_TABS } from "@/components/projects/project-constants";
import { Contribs } from "@/components/projects/project-contribs";
import ProjectTeam from "@/components/projects/project-team";
import { getContribs } from "@/lib/actions/get-contribs";
import { getProject } from "@/lib/actions/get-project";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return [
    {
      tab: [], // for the root page
    },
    ...PROJECT_TABS.map((tab) => ({
      tab: [tab.tab],
    })),
  ];
}

export default async function Project({
  params: { slug, tab },
}: {
  params: {
    slug: string;
    tab?: string[];
  };
}) {
  const project = await getProject({ slug });

  if (!project) {
    notFound();
  }

  if (!tab) {
    return <ProjectAnalytics project={project} />;
  }

  if (tab[0] === "team") {
    return <ProjectTeam project={project} />;
  }

  const split = project.githubLink.url.split("/");
  const repo = split.pop();
  const owner = split.pop();

  const contribs = await getContribs(owner, repo);

  if (tab[0] === "contributors") {
    return <Contribs contribs={contribs} />;
  }
}
