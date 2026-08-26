import { drizzle } from 'drizzle-orm/postgres-js';
import { queryClient } from '../config/database.js';
import * as schema from './schema/index.js';

export const db = drizzle(queryClient, { schema });
