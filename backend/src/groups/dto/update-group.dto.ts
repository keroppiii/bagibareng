import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Semua field opsional; minimal satu field harus dikirim (dicek di service). */
export class UpdateGroupDto {
  @IsOptional()
  @Transform(trim)
  @IsString({ message: 'Nama grup harus berupa teks' })
  @Length(2, 100, { message: 'Nama grup harus 2-100 karakter' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16, { message: 'Emoji maksimal 16 karakter' })
  emoji?: string;

  /** String kosong ("") menghapus deskripsi. */
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(255, { message: 'Deskripsi maksimal 255 karakter' })
  description?: string;
}