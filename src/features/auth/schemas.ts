import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export const registerSchema = z.object({
  username: z.string().min(1, "유저명은 필수 값입니다"),
  email: z.string().email(),
  password: z.string().min(8, "비밀번호는 최소 8글자입니다"),
});
