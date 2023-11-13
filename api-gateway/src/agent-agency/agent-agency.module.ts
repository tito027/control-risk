import { forwardRef, Module } from '@nestjs/common';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'control-risk/schemas/user.schema';
import { AgentController } from './agent-agency.controller';
import { AgentService } from './agent-agency.service';
import { ProxyModule } from 'src/common/proxy/proxy.module';

// TODO modificar
@Module({
  imports: [
    ProxyModule,
    forwardRef(() => RabbitModule),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AgentController],
  exports: [AgentService],
  providers: [AgentService],
})
export class AgentModule {}
