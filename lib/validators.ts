import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  avatarUrl: z.string().url('Invalid URL').optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(['ADMIN', 'USER']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
