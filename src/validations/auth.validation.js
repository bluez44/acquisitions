import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().trim().min(3).max(20),
  email: z.string().email().max(255).toLowerCase().trim(),
  password: z.string().min(6).max(128),
  role: z.enum(['user', 'admin']).default('user'),
});

export const loginSchema = z.object({
  email: z.string().email().max(255).toLowerCase().trim(),
  password: z.string().min(6).max(128),
});
