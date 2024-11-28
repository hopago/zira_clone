"use client";

import { Loader } from "lucide-react";

const SinglePageLoading = () => {
  return (
    <div className="h-[calc(100vh-137px)] flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default SinglePageLoading;
