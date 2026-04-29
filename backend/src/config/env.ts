import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGO_URI: z.string().url('MONGO_URI must be a valid URL'),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
  CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL'),
  XAI_API_KEY: z.string().min(1, 'XAI_API_KEY is required for AI generation'),
  XAI_BASE_URL: z.string().default('https://api.x.ai/v1'),
  XAI_MODEL: z.string().default('grok-beta'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required for outreach'),
  SYSTEM_SENDER_EMAIL: z.string().email('SYSTEM_SENDER_EMAIL must be valid'),
  PROXY_URL: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
