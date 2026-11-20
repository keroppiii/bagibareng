import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const memberships = await this.prisma.groupMember.findMany({
      where: { userId },
      select: { groupId: true },
    });

    const groupIds = memberships.map((membership) => membership.groupId);

    if (groupIds.length === 0) {
      return [];
    }

    return this.prisma.activityLog.findMany({
      where: {
        groupId: { in: groupIds },
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
            emoji: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });
  }
}