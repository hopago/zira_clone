"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { AlertCircleIcon, ArrowLeft, ImageIcon } from "lucide-react";

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

import { cn } from "@/lib/utils";

import { useConfirm } from "@/hooks/use-confirm";

import { Project } from "../types";
import { useUpdateProject } from "../services/use-update-project";
import { updateProjectSchema } from "../schemas";
import { useDeleteProject } from "../services/use-delete-project";

interface EditProjectFormFormProps {
  onCancel?: () => void;
  initValues: Project;
}

export const EditProjectForm = ({
  onCancel,
  initValues,
}: EditProjectFormFormProps) => {
  const router = useRouter();

  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initValues,
      image: initValues.imageUrl ?? undefined,
    },
  });

  const [DeleteDialog, confirmDelete] = useConfirm(
    "프로젝트 삭제",
    "프로젝트를 지우는 건 프로젝트뿐만 아니라 연관된 모든 데이터를 지웁니다",
    "destructive"
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) form.setValue("image", file);
  };

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const submitValues = {
      ...values,
      images: values.image instanceof File ? values.image : "",
    };

    mutate(
      { form: submitValues, param: { projectId: initValues.$id } },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteProject(
      {
        param: {
          projectId: initValues.$id,
        },
      },
      {
        onSuccess: () => router.push(`/workspaces/${initValues.workspaceId}`),
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
                      <FormLabel>프로젝트 이름</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="프로젝트명을 입력해주세요"
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
                        {field.value && field.value !== "undefined" ? (
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
              프로젝트를 지우는 건 프로젝트뿐만 아니라 연관된 모든 데이터를
              지웁니다
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isDeletingProject}
              onClick={handleDelete}
            >
              삭제하기
            </Button>
          </div>
        </CardContent>
      </Card>
      <DeleteDialog />
    </div>
  );
};
