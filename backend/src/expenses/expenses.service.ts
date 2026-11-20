
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, SplitMethod } from '../generated/prisma/client';
import { GroupMembersService } from '../groups/group-members.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groupMembersService: GroupMembersService,
  ) {}

  private readonly expenseInclude = {
    paidBy: {
      select: { id: true, name: true, email: true },
    },
    createdBy: {
      select: { id: true, name: true },
    },
    splits: {
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { user: { name: 'asc' as const } },
    },
  };

    private async assertCanManageExpense(
    groupId: string,
    userId: string,
    createdById: string,
  ) {
    if (createdById === userId) {
      return;
    }

    const membership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
      select: {
        role: true,
      },
    });

    if (membership?.role !== 'OWNER') {
      throw new ForbiddenException(
        'Hanya pembuat pengeluaran atau OWNER grup yang dapat mengubah pengeluaran ini',
      );
    }
  }

  private calculateSplits(
    amount: number,
    splitMethod: SplitMethod,
    splits: { userId: string; amountOwed?: number }[],
  ) {
    const userIds = splits.map((split) => split.userId);

    if (new Set(userIds).size !== userIds.length) {
      throw new BadRequestException(
        'Anggota dalam pembagian tidak boleh duplikat',
      );
    }

    if (splitMethod === SplitMethod.EQUAL) {
      if (amount < splits.length) {
        throw new BadRequestException(
          'Nominal terlalu kecil untuk jumlah anggota yang dipilih',
        );
      }

      const baseAmount = Math.floor(amount / splits.length);
      const remainder = amount % splits.length;

      return splits.map((split, index) => ({
        userId: split.userId,
        amountOwed: baseAmount + (index < remainder ? 1 : 0),
      }));
    }

    if (splits.some((split) => split.amountOwed === undefined)) {
      throw new BadRequestException(
        'Nominal tanggungan wajib diisi untuk Custom Split',
      );
    }

    const total = splits.reduce(
      (sum, split) => sum + (split.amountOwed ?? 0),
      0,
    );

    if (splits.some((split) => !Number.isInteger(split.amountOwed) || (split.amountOwed ?? 0) <= 0)) {
      throw new BadRequestException(
        'Setiap nominal tanggungan Custom Split harus berupa bilangan bulat lebih dari nol',
      );
    }

    if (total !== amount) {
      throw new BadRequestException(
        'Total tanggungan harus sama dengan nominal pengeluaran',
      );
    }

    return splits.map((split) => ({
      userId: split.userId,
      amountOwed: split.amountOwed!,
    }));
  }

  private async validateParticipants(
    groupId: string,
    paidById: string,
    splits: { userId: string; amountOwed: number }[],
  ) {
    const userIds = [...new Set([paidById, ...splits.map((s) => s.userId)])];

    const members = await this.prisma.groupMember.findMany({
      where: {
        groupId,
        userId: { in: userIds },
      },
      select: { userId: true },
    });

    if (members.length !== userIds.length) {
      throw new BadRequestException(
        'Pembayar dan seluruh anggota pembagian harus terdaftar dalam grup',
      );
    }
  }

  async create(
    groupId: string,
    userId: string,
    dto: CreateExpenseDto,
  ) {
    await this.groupMembersService.assertMember(groupId, userId);

    const calculatedSplits = this.calculateSplits(
      dto.amount,
      dto.splitMethod,
      dto.splits,
    );

    await this.validateParticipants(
      groupId,
      dto.paidById,
      calculatedSplits,
    );

    return this.prisma.$transaction(async (tx) => {
        const expense = await tx.expense.create({
            data: {
            groupId,
            title: dto.title,
            description: dto.description || null,
            category: dto.category,
            amount: dto.amount,
            paidById: dto.paidById,
            createdById: userId,
            expenseDate: dto.expenseDate
                ? new Date(dto.expenseDate)
                : new Date(),
            splitMethod: dto.splitMethod,
            splits: {
                create: calculatedSplits,
            },
            },
            include: this.expenseInclude,
        });

        await tx.activityLog.create({
            data: {
            type: 'EXPENSE_ADDED',
            actorId: userId,
            groupId,
            expenseId: expense.id,
            expenseTitle: expense.title,
            },
        });

        return expense;
        });
  }

  async findAll(
    groupId: string,
    userId: string,
    query: QueryExpensesDto,
  ) {
    await this.groupMembersService.assertMember(groupId, userId);

    const page = query.page;
    const limit = query.limit;

    const where: Prisma.ExpenseWhereInput = {
      groupId,
      ...(query.category ? { category: query.category } : {}),
    };

    const [total, expenses] = await this.prisma.$transaction([
      this.prisma.expense.count({ where }),
      this.prisma.expense.findMany({
        where,
        include: this.expenseInclude,
        orderBy: [
          { expenseDate: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: expenses,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(
    groupId: string,
    expenseId: string,
    userId: string,
  ) {
    await this.groupMembersService.assertMember(groupId, userId);

    const expense = await this.prisma.expense.findFirst({
      where: { id: expenseId, groupId },
      include: this.expenseInclude,
    });

    if (!expense) {
      throw new NotFoundException('Pengeluaran tidak ditemukan');
    }

    return expense;
  }

  async update(
    groupId: string,
    expenseId: string,
    userId: string,
    dto: UpdateExpenseDto,
  ) {
    await this.groupMembersService.assertMember(groupId, userId);

    const existing = await this.prisma.expense.findFirst({
      where: { id: expenseId, groupId },
      include: { splits: true },
    });

    if (!existing) {
      throw new NotFoundException('Pengeluaran tidak ditemukan');
    }

    await this.assertCanManageExpense(
        groupId,
        userId,
        existing.createdById,
    );

    if (Object.keys(dto).length === 0) {
      throw new BadRequestException(
        'Minimal satu field harus diperbarui',
      );
    }

    const financialChange =
      dto.amount !== undefined ||
      dto.splitMethod !== undefined ||
      dto.paidById !== undefined ||
      dto.splits !== undefined;

    if (financialChange && existing.splits.some((s) => s.isPaid)) {
      throw new BadRequestException(
        'Pengeluaran tidak dapat mengubah pembagian karena sudah ada tanggungan yang dibayar',
      );
    }

    let calculatedSplits:
      | { userId: string; amountOwed: number }[]
      | undefined;

    if (financialChange) {
      const amount = dto.amount ?? existing.amount;
      const splitMethod = dto.splitMethod ?? existing.splitMethod;
      const paidById = dto.paidById ?? existing.paidById;

      const splitInput =
        dto.splits ??
        existing.splits.map((split) => ({
          userId: split.userId,
          amountOwed: split.amountOwed,
        }));

      calculatedSplits = this.calculateSplits(
        amount,
        splitMethod,
        splitInput,
      );

      await this.validateParticipants(
        groupId,
        paidById,
        calculatedSplits,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      return tx.expense.update({
        where: { id: expenseId },
        data: {
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.description !== undefined && {
            description: dto.description || null,
          }),
          ...(dto.category !== undefined && {
            category: dto.category,
          }),
          ...(dto.amount !== undefined && { amount: dto.amount }),
          ...(dto.paidById !== undefined && {
            paidById: dto.paidById,
          }),
          ...(dto.expenseDate !== undefined && {
            expenseDate: new Date(dto.expenseDate),
          }),
          ...(dto.splitMethod !== undefined && {
            splitMethod: dto.splitMethod,
          }),
          ...(calculatedSplits && {
            splits: {
              deleteMany: {},
              create: calculatedSplits,
            },
          }),
        },
        include: this.expenseInclude,
      });
    });
  }

  async remove(
    groupId: string,
    expenseId: string,
    userId: string,
  ) {
    await this.groupMembersService.assertMember(groupId, userId);

    const expense = await this.prisma.expense.findFirst({
      where: { id: expenseId, groupId },
      include: { splits: true },
    });

    if (!expense) {
      throw new NotFoundException('Pengeluaran tidak ditemukan');
    }

    await this.assertCanManageExpense(
        groupId,
        userId,
        expense.createdById,
     );

    if (expense.splits.some((split) => split.isPaid)) {
      throw new BadRequestException(
        'Pengeluaran tidak dapat dihapus karena sudah ada tanggungan yang dibayar',
      );
    }

    await this.prisma.expense.delete({
      where: { id: expenseId },
    });
  }
  async getBalances(groupId: string, userId: string) {
    await this.groupMembersService.assertMember(groupId, userId);

    const members = await this.prisma.groupMember.findMany({
        where: { groupId },
        include: {
        user: {
            select: {
            id: true,
            name: true,
            email: true,
            },
        },
        },
        orderBy: {
        user: {
            name: 'asc',
        },
        },
    });

    const splits = await this.prisma.expenseSplit.findMany({
        where: {
        isPaid: false,
        expense: {
            groupId,
        },
        },
        include: {
        expense: {
            select: {
            paidById: true,
            },
        },
        },
    });

    return members.map((member) => {
        let totalOwed = 0;
        let totalOwing = 0;

        for (const split of splits) {
        if (split.userId === split.expense.paidById) {
            continue;
        }

        if (split.userId === member.userId) {
            totalOwing += split.amountOwed;
        }

        if (split.expense.paidById === member.userId) {
            totalOwed += split.amountOwed;
        }
        }

        return {
        userId: member.user.id,
        name: member.user.name,
        email: member.user.email,
        totalOwed,
        totalOwing,
        balance: totalOwed - totalOwing,
        };
    });
  }
    async getSettlements(groupId: string, userId: string) {
    await this.groupMembersService.assertMember(groupId, userId);

    const splits = await this.prisma.expenseSplit.findMany({
      where: {
        isPaid: false,
        expense: {
          groupId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        expense: {
          select: {
            id: true,
            title: true,
            amount: true,
            expenseDate: true,
            paidBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        expense: {
          expenseDate: 'desc',
        },
      },
    });

    return splits
      .filter((split) => split.userId !== split.expense.paidBy.id)
      .map((split) => ({
        splitId: split.id,
        expenseId: split.expense.id,
        expenseTitle: split.expense.title,
        expenseAmount: split.expense.amount,
        expenseDate: split.expense.expenseDate,
        debtor: split.user,
        creditor: split.expense.paidBy,
        amount: split.amountOwed,
        status: 'UNPAID',
      }));
  }
    async confirmPayment(
    groupId: string,
    expenseId: string,
    splitId: string,
    userId: string,
  ) {
    await this.groupMembersService.assertMember(groupId, userId);

    const split = await this.prisma.expenseSplit.findFirst({
      where: {
        id: splitId,
        expenseId,
        expense: {
          groupId,
        },
      },
      include: {
        expense: {
          select: {
            paidById: true,
                title: true,
          },
        },
      },
    });

    if (!split) {
      throw new NotFoundException('Tanggungan tidak ditemukan');
    }

    if (split.expense.paidById !== userId) {
      throw new BadRequestException(
        'Hanya pembayar yang dapat mengonfirmasi pembayaran',
      );
    }

    if (split.userId === split.expense.paidById) {
      throw new BadRequestException(
        'Tanggungan pembayar sendiri tidak perlu dikonfirmasi',
      );
    }

    if (split.isPaid) {
      throw new BadRequestException(
        'Pembayaran ini sudah dikonfirmasi lunas',
      );
    }

    return this.prisma.$transaction(async (tx) => {
        const updatedSplit = await tx.expenseSplit.update({
            where: { id: splitId },
            data: {
            isPaid: true,
            paidAt: new Date(),
            },
            include: {
            user: {
                select: {
                id: true,
                name: true,
                },
            },
            },
        });

        await tx.activityLog.create({
            data: {
            type: 'PAYMENT_CONFIRMED',
            actorId: userId,
            groupId,
            expenseId,
            expenseTitle: split.expense.title,
            },
        });

        return updatedSplit;
        });
  }
}
