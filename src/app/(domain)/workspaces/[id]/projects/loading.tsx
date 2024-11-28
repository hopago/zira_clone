"use client";

import { Loader } from "lucide-react";

const ProjectsLoadingPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default ProjectsLoadingPage;