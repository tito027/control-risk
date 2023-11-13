import { forwardRef, Module } from '@nestjs/common';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { CheckInOutController } from './check-in-out.controller';

@Module({
  imports: [ProxyModule, forwardRef(() => RabbitModule)],
  controllers: [CheckInOutController],
})
export class CheckInOutModule {}
