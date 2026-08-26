import postgres from 'postgres';
import { env } from './env.js';

export const queryClient = postgres(env.DATABASE_URL);
