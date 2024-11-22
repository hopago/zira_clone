"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import {
  AlertCircleIcon,
  ArrowLeft,
  CopyIcon,
  ImageIcon,
  FlameIcon,
} from "lucide-react";

import { updateWorkspaceSchema } from "../schemas";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useUpdateWorkspace } from "../services/use-update-workspace";
import { useDeleteWorkspace } from "../services/use-delete-workspace";

import { cn } from "@/lib/utils";

import { ResponseType, Workspace } from "../types";

import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { useResetInviteCode } from "../services/use-reset-invite-code";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initValues: Workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initValues,
}: EditWorkspaceFormProps) => {
  const router = useRouter();

  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initValues,
      image: initValues.imageUrl ?? "",
    },
  });

  const [DeleteDialog, confirmDelete] = useConfirm(
    "작업 공간 삭제",
    "작업 공간을 지우는 건 작업 공간뿐만 아니라 연관된 모든 데이터를 지웁니다",
    "destructive"
  );

  const [ResetDialog, confirmReset] = useConfirm(
    "초대 링크 재생성",
    "초대 링크를 재생성 하며 기존의 링크로는 작업 공간에 참여할 수 없습니다",
    "destructive"
  );

  const fullInviteLink = `${window.location.origin}/workspaces/${initValues.$id}/join/${initValues.inviteCode}`;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) form.setValue("image", file);
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const submitValues = {
      ...values,
      images: values.image instanceof File ? values.image : "",
    };

    mutate(
      { form: submitValues, param: { workspaceId: initValues.$id } },
      {
        onSuccess: (response) => {
          const { data } = response as ResponseType;

          form.reset();
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteWorkspace(
      { param: { workspaceId: initValues.$id } },
      {
        onSuccess: () => (window.location.href = "/"),
      }
    );
  };

  const handleCopyInviteLink = () =>
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("초대 링크가 복사됐습니다"));

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    resetInviteCode(
      { param: { workspaceId: initValues.$id } },
      {
        onSuccess: () => router.refresh(),
      }
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      {/** 카드 수정 */}
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={onCancel ? onCancel : () => router.back()}
          >
            <ArrowLeft className="size-4" />
            뒤로가기
          </Button>
          <CardTitle className="text-xl font-bold">{initValues.name}</CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>작업 공간 이름</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="작업 공간명을 입력해주세요"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="Logo"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px] cursor-pointer">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">아이콘</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, SVG, JPEG, 1MB 미만
                          </p>
                          <input
                            type="file"
                            className="hidden"
                            accept=".jpg, .png, .jpeg, .svg"
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="destructive"
                              size="xs"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current)
                                  inputRef.current.value = "";
                              }}
                              className="w-fit mt-2"
                            >
                              이미지 삭제
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="teritary"
                              size="xs"
                              onClick={() => inputRef.current?.click()}
                              className="w-fit mt-2"
                            >
                              이미지 업로드
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isPending}
                  className={cn(!onCancel && "invisible")}
                >
                  취소하기
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  disabled={isPending}
                >
                  수정하기
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/** 카드 삭제 */}
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <AlertCircleIcon className="size-4" />
              <h3 className="font-bold">경고 사항</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              작업 공간을 지우는 건 작업 공간뿐만 아니라 연관된 모든 데이터를
              지웁니다
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isDeletingWorkspace || isPending}
              onClick={handleDelete}
            >
              삭제하기
            </Button>
          </div>
        </CardContent>
      </Card>
      {/** 초대 코드 재생성 */}
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <FlameIcon className="size-4" />
              <h3 className="font-bold">맴버 초대 코드</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              당신의 작업 공간에 맴버를 초대해보세요
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteLink} />
                <Button
                  variant="secondary"
                  className="size-12"
                  onClick={handleCopyInviteLink}
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isResettingInviteCode}
              onClick={handleResetInviteCode}
            >
              재생성하기
            </Button>
          </div>
        </CardContent>
      </Card>
      <DeleteDialog />
      <ResetDialog />
    </div>
  );
};
