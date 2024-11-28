import { redirect } from "next/navigation";

import { isLoggedIn } from "@/features/auth/server/queries";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { getWorkspace } from "@/features/workspaces/server/queries";

interface WorkspaceIdSettingsPageProps {
  params: {
    id: string;
  };
}

const WorkspaceIdSettingsPage = async ({
  params: { id },
}: WorkspaceIdSettingsPageProps) => {
  const user = await isLoggedIn();
  if (!user) redirect("/sign-in");

  const response = await getWorkspace({ id });
  if (!response) throw new Error(response ?? "작업 공간을 불러오지 못했습니다");

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initValues={response.data} />
    </div>
  );
};

export default WorkspaceIdSettingsPage;
