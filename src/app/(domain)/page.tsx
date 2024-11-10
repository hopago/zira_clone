import { redirect } from "next/navigation";

import { isLoggedIn } from "@/features/auth/server/queries";
import { getWorkspaces } from "@/features/workspaces/server/actions";

export default async function Home() {
  const user = await isLoggedIn();
  if (!user) redirect("/sign-in");

  const { data: workspaces } = await getWorkspaces();
  if (workspaces.total === 0) redirect("/workspaces/create");
  else redirect(`/workspaces/${workspaces.documents[0].$id}`);
}
