import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MemberRole } from '../generated/prisma/client';
import { isUniqueViolation } from '../common/utils/prisma-error';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupMembersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Pastikan user adalah anggota grup. Jika bukan, 404 (bukan 403)
   * supaya keberadaan grup tidak bocor ke orang luar.
   */
  async assertMember(groupId: string, userId: string) {
    const membership = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
      select: { role: true },
    });
    if (!membership) {
      throw new NotFoundException('Grup tidak ditemukan');
    }
    return membership;
  }

  /** Pastikan user adalah OWNER grup (404 jika bukan anggota, 403 jika bukan owner). */
  async assertOwner(groupId: string, userId: string) {
    const membership = await this.assertMember(groupId, userId);
    if (membership.role !== MemberRole.OWNER) {
      throw new ForbiddenException('Hanya pemilik grup yang dapat melakukan ini');
    }
    return membership;
  }

  async addMember(groupId: string, userId: string) {
    const existing = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('Anda sudah menjadi anggota grup ini');
    }

    try {
      return await this.prisma.groupMember.create({
        data: { groupId, userId, role: MemberRole.MEMBER },
      });
    } catch (error) {
      // Dua request join bersamaan: constraint UNIQUE (groupId, userId) yang menjaga.
      if (isUniqueViolation(error)) {
        throw new ConflictException('Anda sudah menjadi anggota grup ini');
      }
      throw error;
    }
  }

  async list(groupId: string, userId: string) {
    await this.assertMember(groupId, userId);
    const members = await this.prisma.groupMember.findMany({
      where: { groupId },
      orderBy: { joinedAt: 'asc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return members.map((m) => ({
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
      joinedAt: m.joinedAt,
    }));
  }

  /**
   * Mengeluarkan anggota (oleh OWNER) atau keluar sendiri (targetUserId = requesterId).
   * Aturan:
   *  - OWNER tidak bisa dikeluarkan / keluar (hapus grup sebagai gantinya)
   *  - ditolak jika masih ada utang/piutang yang belum lunas
   */
  async remove(groupId: string, targetUserId: string, requesterId: string) {
    const requester = await this.assertMember(groupId, requesterId);

    const target =
      targetUserId === requesterId
        ? requester
        : await this.prisma.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId: targetUserId } },
            select: { role: true },
          });
    if (!target) {
      throw new NotFoundException('Anggota tidak ditemukan');
    }

    if (targetUserId !== requesterId && requester.role !== MemberRole.OWNER) {
      throw new ForbiddenException(
        'Hanya pemilik grup yang dapat mengeluarkan anggota',
      );
    }

    if (target.role === MemberRole.OWNER) {
      throw new ConflictException(
        'Pemilik grup tidak dapat keluar atau dikeluarkan. Hapus grup jika sudah tidak dipakai.',
      );
    }

    const unsettled = await this.prisma.expenseSplit.count({
      where: {
        isPaid: false,
        OR: [
          // anggota ini masih berutang ke orang lain
          {
            userId: targetUserId,
            expense: { groupId, paidById: { not: targetUserId } },
          },
          // orang lain masih berutang ke anggota ini
          {
            userId: { not: targetUserId },
            expense: { groupId, paidById: targetUserId },
          },
        ],
      },
    });
    if (unsettled > 0) {
      throw new ConflictException(
        'Anggota masih memiliki utang/piutang yang belum lunas',
      );
    }

    await this.prisma.groupMember.delete({
      where: { groupId_userId: { groupId, userId: targetUserId } },
    });
  }
}