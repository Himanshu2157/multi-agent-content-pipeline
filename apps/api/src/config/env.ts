import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root or current directory
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(),
  LLM_PROVIDER: z.enum(['mock', 'openai', 'gemini']).default('mock'),
  LLM_API_KEY: z.string().optional().default(''),
  LLM_MODEL: z.string().optional().default('gpt-4o-mini'),
  SEARCH_PROVIDER: z.enum(['mock', 'tavily', 'serper', 'duckduckgo']).default('mock'),
  SEARCH_API_KEY: z.string().optional().default(''),
  CLIENT_URL: z.string().default('http://localhost:5173'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
