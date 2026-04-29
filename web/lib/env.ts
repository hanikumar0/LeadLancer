import { z } from 'zod';

// We only validate public vars on the client, but can validate both on server.
// In Next.js, process.env is only available server-side unless prefixed with NEXT_PUBLIC_

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL').default('http://localhost:5000/api'),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!_env.success) {
  console.error('❌ Invalid environment variables on Web Frontend:', _env.error.format());
  // Don't crash browser, just log
}

export const env = _env.success ? _env.data : { NEXT_PUBLIC_API_URL: 'http://localhost:5000/api' };
