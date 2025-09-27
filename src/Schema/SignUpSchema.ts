import { z } from "zod";

export const signupSchema = z.object({
  full_name: z.string().optional(),
  phone: z.string().min(8, "Phone number must be at least 8 digits").optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const updateAccountSchema = z.object({
  full_name: z.string().optional(),
  phone: z.string().min(8, "Phone number must be at least 8 digits").optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});
