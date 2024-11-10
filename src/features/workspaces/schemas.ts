import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "작업 공간 이름은 필수값입니다")
    .max(20, "작업 공간 이름은 최대 21글자 내로 작성해주세요"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "작업 공간 이름은 1글자 이상이어야 합니다")
    .max(20, "작업 공간 이름은 최대 21글자 내로 작성해주세요")
    // if less then 1 char - skip update name
    .optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
