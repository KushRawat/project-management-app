import { PrismaClient } from '@prisma/client';
import { env } from '@/env';

const createPrismaClient = () =>
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

declare global {
  var __db: PrismaClient | undefined;
}

export const db = global.__db ?? createPrismaClient();
if (env.NODE_ENV !== 'production') global.__db = db;
