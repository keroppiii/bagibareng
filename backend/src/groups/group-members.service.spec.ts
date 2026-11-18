import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GroupMembersService } from './group-members.service';

describe('GroupMembersService', () => {
  let service: GroupMembersService;
  const prisma = {
    groupMember: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    expenseSplit: { count: jest.fn() },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        GroupMembersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(GroupMembersService);
  });

  describe('assertMember / assertOwner', () => {
    it('404 jika bukan anggota', async () => {
      prisma.groupMember.findUnique.mockResolvedValue(null);
      await expect(service.assertMember('g1', 'u1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('403 jika anggota biasa mencoba aksi owner', async () => {
      prisma.groupMember.findUnique.mockResolvedValue({ role: 'MEMBER' });
      await expect(service.assertOwner('g1', 'u1')).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('lolos untuk OWNER', async () => {
      prisma.groupMember.findUnique.mockResolvedValue({ role: 'OWNER' });
      await expect(service.assertOwner('g1', 'u1')).resolves.toEqual({
        role: 'OWNER',
      });
    });
  });

  describe('addMember', () => {
    it('409 jika sudah menjadi anggota', async () => {
      prisma.groupMember.findUnique.mockResolvedValue({ id: 'm1' });
      await expect(service.addMember('g1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(prisma.groupMember.create).not.toHaveBeenCalled();
    });

    it('409 jika terjadi race condition (UNIQUE violation)', async () => {
      prisma.groupMember.findUnique.mockResolvedValue(null);
      prisma.groupMember.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('dup', {
          code: 'P2002',
          clientVersion: 'test',
        }),
      );
      await expect(service.addMember('g1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('membuat anggota baru dengan role MEMBER', async () => {
      prisma.groupMember.findUnique.mockResolvedValue(null);
      prisma.groupMember.create.mockResolvedValue({ id: 'm1' });
      await service.addMember('g1', 'u1');
      expect(prisma.groupMember.create).toHaveBeenCalledWith({
        data: { groupId: 'g1', userId: 'u1', role: 'MEMBER' },
      });
    });
  });

  describe('remove', () => {
    // findUnique dipanggil berurutan: (1) requester, (2) target (jika berbeda)
    it('anggota biasa tidak boleh mengeluarkan orang lain (403)', async () => {
      prisma.groupMember.findUnique
        .mockResolvedValueOnce({ role: 'MEMBER' })
        .mockResolvedValueOnce({ role: 'MEMBER' });
      await expect(service.remove('g1', 'u2', 'u1')).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('404 jika target bukan anggota grup', async () => {
      prisma.groupMember.findUnique
        .mockResolvedValueOnce({ role: 'OWNER' })
        .mockResolvedValueOnce(null);
      await expect(service.remove('g1', 'u2', 'u1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('OWNER tidak bisa keluar dari grupnya sendiri (409)', async () => {
      prisma.groupMember.findUnique.mockResolvedValueOnce({ role: 'OWNER' });
      await expect(service.remove('g1', 'u1', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('409 jika masih ada utang/piutang belum lunas', async () => {
      prisma.groupMember.findUnique
        .mockResolvedValueOnce({ role: 'OWNER' })
        .mockResolvedValueOnce({ role: 'MEMBER' });
      prisma.expenseSplit.count.mockResolvedValue(2);
      await expect(service.remove('g1', 'u2', 'u1')).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(prisma.groupMember.delete).not.toHaveBeenCalled();
    });

    it('OWNER berhasil mengeluarkan anggota yang sudah lunas', async () => {
      prisma.groupMember.findUnique
        .mockResolvedValueOnce({ role: 'OWNER' })
        .mockResolvedValueOnce({ role: 'MEMBER' });
      prisma.expenseSplit.count.mockResolvedValue(0);
      await service.remove('g1', 'u2', 'u1');
      expect(prisma.groupMember.delete).toHaveBeenCalledWith({
        where: { groupId_userId: { groupId: 'g1', userId: 'u2' } },
      });
    });

    it('anggota biasa bisa keluar sendiri', async () => {
      prisma.groupMember.findUnique.mockResolvedValueOnce({ role: 'MEMBER' });
      prisma.expenseSplit.count.mockResolvedValue(0);
      await service.remove('g1', 'u2', 'u2');
      expect(prisma.groupMember.delete).toHaveBeenCalledTimes(1);
    });
  });
});