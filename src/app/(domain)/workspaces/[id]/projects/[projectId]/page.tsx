import { redirect } from "next/navigation";
import Link from "next/link";

import { PencilIcon } from "lucide-react";

import { isLoggedIn } from "@/features/auth/server/queries";
import { getProject } from "@/features/projects/queries";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Button } from "@/components/ui/button";

interface ProjectIdPageProps {
  params: { projectId: string };
}

const ProjectIdPage = async ({ params: { projectId } }: ProjectIdPageProps) => {
  const user = await isLoggedIn();
  if (!user) redirect("/sign-in");

  const response = await getProject({ projectId });
  if (!response) throw new Error("프로젝트를 가져오지 못했습니다");

  return (
    <section className="flex flex-col gap-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={response.data.name}
            image={response.data.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{response.data.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${response.data.workspaceId}/projects/${response.data.$id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              프로젝트 수정
            </Link>
          </Button>
        </div>
      </header>
    </section>
  );
};

export default ProjectIdPage;
