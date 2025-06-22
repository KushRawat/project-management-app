import { z } from "zod";

const _env = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export const env = {
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .parse(_env.NODE_ENV),

  DATABASE_URL: z.string().min(1).parse(_env.DATABASE_URL),

  NEXTAUTH_SECRET: z.string().min(1).parse(_env.NEXTAUTH_SECRET),

  SUPABASE_URL: z.string().url().parse(_env.SUPABASE_URL),

  SUPABASE_SERVICE_ROLE: z.string().min(1).parse(
    _env.SUPABASE_SERVICE_ROLE
  ),

  NEXT_PUBLIC_SUPABASE_URL: z.string()
    .url()
    .parse(_env.NEXT_PUBLIC_SUPABASE_URL),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1)
    .parse(_env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
};
