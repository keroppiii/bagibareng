import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmailWithPassword(dto.email);
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    const valid = user
      ? await bcrypt.compare(dto.password, user.passwordHash)
      : false;

    // Pesan sengaja generik: tidak membedakan "email salah" dan "password salah".
    if (!user || !valid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return this.buildAuthResponse({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async updateProfile(userId: string, name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new ConflictException('Nama tidak boleh kosong');
  }

  return this.usersService.updateName(userId, trimmedName);
}

  private async buildAuthResponse(user: {
    id: string;
    name: string;
    email: string;
  }) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    return {
      user,
      accessToken,
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '1d'),
    };
  }
}