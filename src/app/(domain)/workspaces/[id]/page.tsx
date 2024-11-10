import { redirect } from "next/navigation";

import { isLoggedIn } from "@/features/auth/server/queries";

export default async function WorkspaceIdPage() {
  const user = await isLoggedIn();
  if (!user) redirect("/sign-in");

  return (
    <div>
      Workspace Id
    </div>
  )
}
