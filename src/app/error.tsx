"use client";

import Link from "next/link";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

const GlobalErrorPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-y-4">
      <AlertTriangle className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">흠... 무언가 잘못됐군요...</p>
      <Button variant="secondary" size="sm">
        <Link href="/">홈페이지로</Link>
      </Button>
    </div>
  );
};

export default GlobalErrorPage;
