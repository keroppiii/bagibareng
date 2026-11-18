import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MemberRole, Prisma } from '../generated/prisma/client';
import {
  generateInviteCode,
  normalizeInviteCode,
} from '../common/utils/invite-code';
import { paginate, toSkipTake } from '../common/utils/paginate';
import { isUniqueViolation } from '../common/utils/prisma-error';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { QueryGroupsDto } from './dto/query-groups.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupMembersService } from './group-members.service';

const MAX_INVITE_CODE_ATTEMPTS = 5;

@Injectable()
export class GroupsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly members: GroupMembersService,
  ) {}

  async create(userId: string, dto: CreateGroupDto) {
    for (let attempt = 1; attempt <= MAX_INVITE_CODE_ATTEMPTS; attempt++) {
      try {
        const group = await this.prisma.group.create({
          data: {
            name: dto.name,
            emoji: dto.emoji,
            description: dto.description || null,
            inviteCode: generateInviteCode(),
            ownerId: userId,
            // pembuat otomatis menjadi OWNER (satu transaksi dengan pembuatan grup)
            members: { create: { userId, role: MemberRole.OWNER } },
          },
          select: { id: true },
        });
        return this.findOne(group.id, userId);
      } catch (error) {
        // Kode bentrok dengan grup lain: coba lagi dengan kode baru.
        if (isUniqueViolation(error) && attempt < MAX_INVITE_CODE_ATTEMPTS) {
          continue;
        }
        throw error;
      }
    }
    throw new InternalServerErrorException('Gagal membuat kode undangan');
  }

  async findAll(userId: string, query: QueryGroupsDto) {
    const { page, limit, search } = query;

    const where: Prisma.GroupWhereInput = {
      members: { some: { userId } },
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    };

    const [total, groups] = await Promise.all([
      this.prisma.group.count({ where }),
      this.prisma.group.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...toSkipTake(page, limit),
        include: {
          _count: { select: { members: true } },
          members: { where: { userId }, select: { role: true } },
        },
      }),
    ]);

    const totals = await this.totalExpenseByGroup(groups.map((g) => g.id));

    const items = groups.map((g) => ({
      id: g.id,
      name: g.name,
      emoji: g.emoji,
      description: g.description,
      inviteCode: g.inviteCode,
      myRole: g.members[0]?.role,
      memberCount: g._count.members,
      totalExpense: totals.get(g.id) ?? 0,
      createdAt: g.createdAt,
    }));

    return paginate(items, total, page, limit);
  }

  /** Detail grup. 404 jika grup tidak ada ATAU user bukan anggotanya. */
  async findOne(id: string, userId: string) {
    const group = await this.prisma.group.findFirst({
      where: { id, members: { some: { userId } } },
      include: {
        members: {
          orderBy: { joinedAt: 'asc' },
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
    if (!group) {
      throw new NotFoundException('Grup tidak ditemukan');
    }

    const totals = await this.totalExpenseByGroup([id]);

    return {
      id: group.id,
      name: group.name,
      emoji: group.emoji,
      description: group.description,
      inviteCode: group.inviteCode,
      ownerId: group.ownerId,
      myRole: group.members.find((m) => m.userId === userId)?.role,
      memberCount: group.members.length,
      totalExpense: totals.get(id) ?? 0,
      members: group.members.map((m) => ({
        userId: m.user.id,
        name: m.user.name,
        email: m.user.email,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  }

  async update(id: string, userId: string, dto: UpdateGroupDto) {
    await this.members.assertOwner(id, userId);

    if (
      dto.name === undefined &&
      dto.emoji === undefined &&
      dto.description === undefined
    ) {
      throw new BadRequestException('Tidak ada data yang diubah');
    }

    await this.prisma.group.update({
      where: { id },
      data: {
        name: dto.name,
        emoji: dto.emoji,
        // string kosong = hapus deskripsi
        description:
          dto.description === undefined ? undefined : dto.description || null,
      },
    });
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string) {
    await this.members.assertOwner(id, userId);
    // Anggota, expense, dan split ikut terhapus (onDelete: Cascade di skema).
    await this.prisma.group.delete({ where: { id } });
  }

  /** Pratinjau grup sebelum bergabung. 404 jika kode tidak ditemukan. */
  async previewByCode(code: string, userId: string) {
    const group = await this.prisma.group.findUnique({
      where: { inviteCode: normalizeInviteCode(code) },
      select: {
        name: true,
        emoji: true,
        description: true,
        owner: { select: { name: true } },
        _count: { select: { members: true } },
        members: { where: { userId }, select: { id: true } },
      },
    });
    if (!group) {
      throw new NotFoundException('Kode undangan tidak ditemukan');
    }
    return {
      name: group.name,
      emoji: group.emoji,
      description: group.description,
      ownerName: group.owner.name,
      memberCount: group._count.members,
      alreadyMember: group.members.length > 0,
    };
  }

  async join(userId: string, inviteCode: string) {
    const group = await this.prisma.group.findUnique({
      where: { inviteCode: normalizeInviteCode(inviteCode) },
      select: { id: true },
    });
    if (!group) {
      throw new NotFoundException('Kode undangan tidak ditemukan');
    }
    await this.members.addMember(group.id, userId);
    return this.findOne(group.id, userId);
  }

  /** Total pengeluaran per grup dalam satu query (tanpa N+1). */
  private async totalExpenseByGroup(groupIds: string[]) {
    const totals = new Map<string, number>();
    if (groupIds.length === 0) return totals;

    const rows = await this.prisma.expense.groupBy({
      by: ['groupId'],
      where: { groupId: { in: groupIds } },
      _sum: { amount: true },
    });
    for (const row of rows) {
      totals.set(row.groupId, row._sum.amount ?? 0);
    }
    return totals;
  }
}