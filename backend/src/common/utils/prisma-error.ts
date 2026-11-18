import { Prisma } from '../../generated/prisma/client';

/** True jika error berasal dari pelanggaran constraint UNIQUE (kode Prisma P2002). */
export function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}