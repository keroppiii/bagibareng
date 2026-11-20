
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  type AuthUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@Controller('groups/:groupId/expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
  ) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.expensesService.create(groupId, user.id, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Query() query: QueryExpensesDto,
  ) {
    return this.expensesService.findAll(groupId, user.id, query);
  }

@Get('balances')
  getBalances(
    @CurrentUser() user: AuthUser,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ) {
    return this.expensesService.getBalances(groupId, user.id);
  }

    @Get('settlements')
  getSettlements(
    @CurrentUser() user: AuthUser,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ) {
    return this.expensesService.getSettlements(groupId, user.id);
  }

    @Patch(':expenseId/splits/:splitId/confirm-payment')
  confirmPayment(
    @CurrentUser() user: AuthUser,
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('expenseId', ParseUUIDPipe) expenseId: string,
    @Param('splitId', ParseUUIDPipe) splitId: string,
  ) {
    return this.expensesService.confirmPayment(
      groupId,
      expenseId,
      splitId,
      user.id,
    );
  }

  @Get(':expenseId')
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('expenseId', ParseUUIDPipe) expenseId: string,
  ) {
    return this.expensesService.findOne(groupId, expenseId, user.id);
  }

  @Patch(':expenseId')
  update(
    @CurrentUser() user: AuthUser,
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('expenseId', ParseUUIDPipe) expenseId: string,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(
      groupId,
      expenseId,
      user.id,
      dto,
    );
  }

  @Delete(':expenseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: AuthUser,
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('expenseId', ParseUUIDPipe) expenseId: string,
  ) {
    return this.expensesService.remove(groupId, expenseId, user.id);
  }
}
