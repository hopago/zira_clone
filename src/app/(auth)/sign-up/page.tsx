import { redirect } from "next/navigation";

import { SignupCard } from "@/features/auth/_components/signup-card";
import { isLoggedIn } from "@/features/auth/server/queries";

export default async function SignupPage() {
  const user = await isLoggedIn();
  if (user) redirect("/");

  return <SignupCard />;
}
