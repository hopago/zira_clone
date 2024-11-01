import { SigninCard } from "@/features/auth/_components/signin-card";
import { isLoggedIn } from "@/features/auth/server/actions";

import { redirect } from "next/navigation";

export default async function SigninPage() {
  const user = await isLoggedIn();
  if (user) redirect("/");

  return <SigninCard />;
}
