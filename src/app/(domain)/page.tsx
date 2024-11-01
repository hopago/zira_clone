import { redirect } from "next/navigation";

import { isLoggedIn } from "@/features/auth/server/actions";

export default async function Home() {
  const user = await isLoggedIn();
  if (!user) redirect("/sign-in");

  return <div>홈 컨텐츠</div>;
}
