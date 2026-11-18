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
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  type AuthUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { QueryGroupsDto } from './dto/query-groups.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupMembersService } from './group-members.service';
import { GroupsService } from './groups.service';

// Batas percobaan kode undangan: 10 request per menit per IP.
const INVITE_THROTTLE = { default: { limit: 10, ttl: 60_000 } };

@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly membersService: GroupMembersService,
  ) {}

  // ── Route statis HARUS dideklarasikan sebelum route dinamis ':id' ──────────

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateGroupDto) {
    return this.groupsService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query() query: QueryGroupsDto) {
    return this.groupsService.findAll(user.id, query);
  }

  @Get('invite/:code')
  @UseGuards(ThrottlerGuard)
  @Throttle(INVITE_THROTTLE)
  preview(@CurrentUser() user: AuthUser, @Param('code') code: string) {
    return this.groupsService.previewByCode(code, user.id);
  }

  @Post('join')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle(INVITE_THROTTLE)
  join(@CurrentUser() user: AuthUser, @Body() dto: JoinGroupDto) {
    return this.groupsService.join(user.id, dto.inviteCode);
  }

  // ── Route dinamis ──────────────────────────────────────────────────────────

  @Get(':id')
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.groupsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.groupsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.groupsService.remove(id, user.id);
  }

  @Get(':id/members')
  listMembers(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.membersService.list(id, user.id);
  }

  /** OWNER mengeluarkan anggota, atau anggota keluar sendiri (userId = id sendiri). */
  @Delete(':id/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMember(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.membersService.remove(id, userId, user.id);
  }
}