import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "작업 공간 이름은 필수값입니다")
    .max(20, "작업 공간 이름은 최대 21글자 내로 작성해주세요"),
});
