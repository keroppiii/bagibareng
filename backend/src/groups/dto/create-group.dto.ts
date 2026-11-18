import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateGroupDto {
  @Transform(trim)
  @IsString({ message: 'Nama grup harus berupa teks' })
  @Length(2, 100, { message: 'Nama grup harus 2-100 karakter' })
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(16, { message: 'Emoji maksimal 16 karakter' })
  emoji?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(255, { message: 'Deskripsi maksimal 255 karakter' })
  description?: string;
}