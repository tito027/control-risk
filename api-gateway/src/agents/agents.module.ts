import { forwardRef, Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { ConfigModule } from '@nestjs/config';
import { AgentsService } from './agents.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ProxyModule,
    UserModule,
    forwardRef(() => RabbitModule),
    ConfigModule,
  ],
  controllers: [AgentsController],
  providers: [AgentsService],
})
export class AgentsModule {}
