import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "프로젝트 이름은 필수값입니다")
    .max(20, "프로젝트 이름은 최대 21글자 내로 작성해주세요"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, "프로젝트 이름은 필수값입니다")
    .max(20, "프로젝트 이름은 최대 21글자 내로 작성해주세요")
    .optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
