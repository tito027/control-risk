import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersInformationsModule } from '../users-informations/users-informations.module';
import { User, UserSchema } from 'control-risk/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { PaymentMethodUserModule } from 'src/payment-method-user/payment-method-user.module';
import { AgentStatusModule } from 'src/agent-status/agentStatus.module';
import { RolesModule } from 'src/roles/roles.module';
import { AssignmentHistoryModule } from 'src/assignment-history/assignmentHistory.module';
@Module({
  imports: [
    UsersInformationsModule,
    PaymentMethodUserModule,
    AgentStatusModule,
    RolesModule,
    forwardRef(() => AgentStatusModule),
    AssignmentHistoryModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
