import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { GroupMembersService } from './group-members.service';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }])],
  controllers: [GroupsController],
  providers: [GroupsService, GroupMembersService],
  // Dipakai modul Expenses/Balances nanti untuk assertMember/assertOwner
  exports: [GroupMembersService],
})
export class GroupsModule {}