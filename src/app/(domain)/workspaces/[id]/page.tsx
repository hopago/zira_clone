import { redirect } from "next/navigation";

import { isLoggedIn } from "@/features/auth/server/queries";

interface WorkspaceIdPageParams {
  params: {
    id: string;
  };
}

export default async function WorkspaceIdPage({
  params,
}: WorkspaceIdPageParams) {
  const user = await isLoggedIn();
  if (!user) redirect("/sign-in");

  return <div>Workspace Id: {params.id}</div>;
}
