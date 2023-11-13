import { forwardRef, Module } from '@nestjs/common';
import { AgenciesController } from './agencies.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ProxyModule, UserModule, forwardRef(() => RabbitModule)],
  controllers: [AgenciesController],
})
export class AgenciesModule {}
