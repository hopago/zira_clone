"use client"

import { Loader } from "lucide-react";

const GlobalLoadingPage = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default GlobalLoadingPage;
