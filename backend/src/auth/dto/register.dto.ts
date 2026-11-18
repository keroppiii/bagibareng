import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class RegisterDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Nama harus berupa teks' })
  @Length(2, 100, { message: 'Nama harus 2-100 karakter' })
  name!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Format email tidak valid' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password!: string;

  @IsString()
  @Match('password', { message: 'Konfirmasi password tidak sama' })
  confirmPassword!: string;
}