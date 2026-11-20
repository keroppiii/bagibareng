import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Mengembalikan user lengkap termasuk passwordHash (khusus untuk login). */
  findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  }

  updateName(id: string, name: string) {
  return this.prisma.user.update({
    where: { id },
    data: { name },
    select: publicUserSelect,
  });
}

  create(data: { name: string; email: string; passwordHash: string }) {
    return this.prisma.user.create({ data, select: publicUserSelect });
  }
}