import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const users = {
    findByEmailWithPassword: jest.fn(),
    create: jest.fn(),
  };
  const jwt = { signAsync: jest.fn().mockResolvedValue('signed-token') };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: users },
        { provide: JwtService, useValue: jwt },
        { provide: ConfigService, useValue: { get: () => '1d' } },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  describe('register', () => {
    const dto = {
      name: 'Raia',
      email: 'raia@email.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('menolak email yang sudah terdaftar', async () => {
      users.findByEmailWithPassword.mockResolvedValue({ id: '1' });
      await expect(service.register(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(users.create).not.toHaveBeenCalled();
    });

    it('menyimpan password sebagai hash dan mengembalikan token', async () => {
      users.findByEmailWithPassword.mockResolvedValue(null);
      users.create.mockImplementation(({ name, email }) =>
        Promise.resolve({ id: 'u1', name, email }),
      );

      const result = await service.register(dto);

      const saved = users.create.mock.calls[0][0];
      expect(saved.passwordHash).not.toBe(dto.password);
      expect(await bcrypt.compare(dto.password, saved.passwordHash)).toBe(true);
      expect(result.accessToken).toBe('signed-token');
      expect(result.user).toEqual({
        id: 'u1',
        name: 'Raia',
        email: 'raia@email.com',
      });
    });
  });

  describe('login', () => {
    it('menolak email yang tidak ditemukan', async () => {
      users.findByEmailWithPassword.mockResolvedValue(null);
      await expect(
        service.login({ email: 'x@email.com', password: 'password123' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('menolak password yang salah', async () => {
      users.findByEmailWithPassword.mockResolvedValue({
        id: 'u1',
        name: 'Raia',
        email: 'raia@email.com',
        passwordHash: await bcrypt.hash('benar-benar', 4),
      });
      await expect(
        service.login({ email: 'raia@email.com', password: 'salah-salah' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('mengembalikan user dan token jika kredensial benar', async () => {
      users.findByEmailWithPassword.mockResolvedValue({
        id: 'u1',
        name: 'Raia',
        email: 'raia@email.com',
        passwordHash: await bcrypt.hash('password123', 4),
      });
      const result = await service.login({
        email: 'raia@email.com',
        password: 'password123',
      });
      expect(result.accessToken).toBe('signed-token');
      expect(result.user).not.toHaveProperty('passwordHash');
    });
  });
});