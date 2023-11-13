import { forwardRef, Module } from '@nestjs/common';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { ReasonsController } from './reasons.controller';

@Module({
  imports: [ProxyModule, forwardRef(() => RabbitModule)],
  controllers: [ReasonsController],
})
export class ReasonsModule {}
