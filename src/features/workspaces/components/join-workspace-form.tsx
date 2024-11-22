"use client";

import { useRouter } from "next/navigation";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useJoinWorkspace } from "../services/use-join-workspace";

interface JoinWorkspaceFormProps {
  initValues: {
    name: string;
    inviteCode: string;
    id: string;
  };
}

export const JoinWorkspaceForm = ({ initValues }: JoinWorkspaceFormProps) => {
  const router = useRouter();

  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId: initValues.id },
        json: { code: initValues.inviteCode },
      },
      {
        onSuccess: (response) => {
          if ("data" in response) {
            router.push(`/workspaces/${response.data.$id}`);
          }
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">작업 공간 참여하기</CardTitle>
        <CardDescription>
          &apos;{initValues.name}&apos;에 초대 되셨습니다, 참여하시겠어요?
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row lg:justify-end lg:gap-2">
          <Button
            variant="secondary"
            type="button"
            className="w-full lg:w-fit"
            onClick={() => router.back()}
            size="lg"
          >
            취소하기
          </Button>
          <Button
            type="button"
            size="lg"
            className="w-full lg:w-fit"
            onClick={onSubmit}
            disabled={isPending}
          >
            참여하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
