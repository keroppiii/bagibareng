import { IsEnum, IsOptional } from 'class-validator';
import { ExpenseCategory } from '../../generated/prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryExpensesDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ExpenseCategory, {
    message: 'Kategori pengeluaran tidak valid',
  })
  category?: ExpenseCategory;
}
