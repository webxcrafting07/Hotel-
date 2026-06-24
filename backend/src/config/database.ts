import { PrismaClient } from '@prisma/client';
import { ENV } from './env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ENV.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (ENV.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function connectDB(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}
