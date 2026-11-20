import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  ExpenseCategory,
  SplitMethod,
} from '../../generated/prisma/client';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class ExpenseSplitDto {
  @IsUUID('4', { message: 'ID anggota tidak valid' })
  userId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Nominal tanggungan harus berupa bilangan bulat' })
  @Min(0, { message: 'Nominal tanggungan tidak boleh negatif' })
  amountOwed?: number;
}

export class CreateExpenseDto {
  @Transform(trim)
  @IsString({ message: 'Nama pengeluaran harus berupa teks' })
  @MaxLength(100, { message: 'Nama pengeluaran maksimal 100 karakter' })
  title!: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(255, { message: 'Deskripsi maksimal 255 karakter' })
  description?: string;

  @IsEnum(ExpenseCategory, { message: 'Kategori pengeluaran tidak valid' })
  category!: ExpenseCategory;

  @Type(() => Number)
  @IsInt({ message: 'Nominal harus berupa bilangan bulat' })
  @Min(1, { message: 'Nominal minimal Rp1' })
  amount!: number;

  @IsUUID('4', { message: 'ID pembayar tidak valid' })
  paidById!: string;

  @IsOptional()
  @IsDateString({}, { message: 'Tanggal pengeluaran tidak valid' })
  expenseDate?: string;

  @IsEnum(SplitMethod, { message: 'Metode pembagian tidak valid' })
  splitMethod!: SplitMethod;

  @IsArray({ message: 'Daftar pembagian harus berupa array' })
  @ArrayMinSize(1, { message: 'Minimal satu anggota harus dipilih' })
  @ValidateNested({ each: true })
  @Type(() => ExpenseSplitDto)
  splits!: ExpenseSplitDto[];
}
