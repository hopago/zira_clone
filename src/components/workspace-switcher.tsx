"use client";

import { RiAddCircleFill } from "react-icons/ri";

import { useGetWorkspaces } from "@/features/workspaces/services/use-get-workspaces";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";

export const WorkspaceSwitcher = () => {
  const { data: workspaces } = useGetWorkspaces();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">작업 공간</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>
      <Select>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="현재 선택된 작업 공간이 없습니다" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents.map((ws) => (
            <SelectItem key={ws.$id} value={ws.$id} className="cursor-pointer">
              <div className="flex justify-start items-center gap-3 font-medium">
                <WorkspaceAvatar name={ws.name} image={ws.imageUrl} />
                <span className="truncate">{ws.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
