import { redirect } from "next/navigation";

import { isLoggedIn } from "@/features/auth/server/actions";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

export default async function Home() {
  const user = await isLoggedIn();
  if (!user) redirect("/sign-in");

  return (
    <div className="bg-neutral-300 p-4 h-full rounded-xl">
      <CreateWorkspaceForm />
    </div>
  );
}
