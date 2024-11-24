"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { RiAddCircleFill } from "react-icons/ri";

import { useGetProjects } from "@/features/projects/services/use-get-projects";
import { cn } from "@/lib/utils";

export const Projects = () => {
  const projectId = null; // TODO:

  const pathname = usePathname();
  const { id: workspaceId } = useParams();

  const { data } = useGetProjects({ workspaceId: workspaceId as string });

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">프로젝트</p>
        <RiAddCircleFill
          onClick={() => {}}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {data?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${projectId}`;
        const isActive = pathname === href;

        return (
          <Link key={project.$id} href={href}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};