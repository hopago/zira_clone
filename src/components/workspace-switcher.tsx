"use client";

import { useRouter } from "next/navigation";

import { RiAddCircleFill } from "react-icons/ri";

import { useGetWorkspaces } from "@/features/workspaces/services/use-get-workspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";

import { useParamsId } from "@/features/hooks/use-params-id";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateModal } from "@/features/hooks/use-create-modal";

export const WorkspaceSwitcher = () => {
  const workspaceId = useParamsId();
  const router = useRouter();

  const { data: workspaces } = useGetWorkspaces();

  const { open } = useCreateModal("workspace");

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">작업 공간</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      <Select onValueChange={onSelect} value={workspaceId}>
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
