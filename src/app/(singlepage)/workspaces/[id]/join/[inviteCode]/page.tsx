import { redirect } from "next/navigation";

import { isLoggedIn } from "@/features/auth/server/queries";
import { getWorkspaceInfo } from "@/features/workspaces/server/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { toast } from "sonner";

interface WorkspaceIdJoinPageProps {
  params: {
    id: string;
    inviteCode: string;
  };
}

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
  const user = await isLoggedIn();
  if (!user) redirect("/sign-in");

  const initValues = await getWorkspaceInfo({
    id: params.id,
  });
  if (!initValues) {
    toast.info("확인되지 않은 초대장입니다, 홈 페이지로 이동합니다");
    redirect("/");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        initValues={{
          id: params.id,
          inviteCode: params.inviteCode,
          name: initValues.data.name,
        }}
      />
    </div>
  );
};

export default WorkspaceIdJoinPage;
