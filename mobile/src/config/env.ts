import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url('EXPO_PUBLIC_API_URL must be a valid URL').default('http://10.0.2.2:5000/api'),
});

const _env = envSchema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
});

if (!_env.success) {
  console.error('❌ Invalid environment variables on Mobile:', _env.error.format());
}

export const env = _env.success ? _env.data : { EXPO_PUBLIC_API_URL: 'http://10.0.2.2:5000/api' };
