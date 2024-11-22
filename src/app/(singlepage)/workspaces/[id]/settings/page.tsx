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

  const initValues = await getWorkspace({ id });
  if (!initValues) redirect(`/workspaces/${id}`);

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initValues={initValues.data} />
    </div>
  );
};

export default WorkspaceIdSettingsPage;
