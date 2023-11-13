import { forwardRef, Module } from '@nestjs/common';
import { PhysicalPositionController } from './physical-position.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ProxyModule, UserModule, forwardRef(() => RabbitModule)],
  controllers: [PhysicalPositionController],
})
export class PhysicalPositionModule {}
