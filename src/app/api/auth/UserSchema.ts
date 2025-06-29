import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  email: z.string().trim().email("Invalid email format"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long"),
});

export type UserInput = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
