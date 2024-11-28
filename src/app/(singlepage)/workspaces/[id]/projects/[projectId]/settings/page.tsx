import { redirect } from "next/navigation";

import { isLoggedIn } from "@/features/auth/server/queries";
import { getProject } from "@/features/projects/queries";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";

interface ProjectIdSettingsPageProps {
  params: {
    projectId: string;
  };
}

const ProjectIdSettingsPage = async ({
  params: { projectId },
}: ProjectIdSettingsPageProps) => {
  const user = await isLoggedIn();
  if (!user) redirect("/sign-in");

  const response = await getProject({ projectId });
  if (!response) throw new Error(response ?? "프로젝트를 불러오지 못했습니다");

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initValues={response.data} />
    </div>
  );
};

export default ProjectIdSettingsPage;
