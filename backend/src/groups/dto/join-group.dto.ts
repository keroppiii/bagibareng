import { Transform } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

export class JoinGroupDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString({ message: 'Kode undangan harus berupa teks' })
  @Matches(/^BB-[A-Z0-9]{4,20}$/, { message: 'Format kode undangan tidak valid' })
  inviteCode!: string;
}