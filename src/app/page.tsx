"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useCurrent } from "@/features/auth/services/use-current";
import { useLogout } from "@/features/auth/services/use-logout";

export default function Home() {
  const router = useRouter();

  const { data, isLoading } = useCurrent();
  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in");
    }
  }, [data]);

  return (
    <>
      <div>{JSON.stringify(data)}</div>
      <button onClick={mutate}>로그아웃</button>
    </>
  );
}
