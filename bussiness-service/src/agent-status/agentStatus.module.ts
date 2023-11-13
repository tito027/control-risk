import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {
  AgentStatus,
  AgentStatusSchema,
} from 'control-risk/schemas/agentStatus.schema';
import { AgentStatusService } from './agentStatus.service';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      {
        name: AgentStatus.name,
        schema: AgentStatusSchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [AgentStatusService],
  exports: [AgentStatusService],
})
export class AgentStatusModule {}
