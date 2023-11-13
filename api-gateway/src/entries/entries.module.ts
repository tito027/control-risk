import { Module, forwardRef } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { EntriesController } from './entries.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';

@Module({
  imports: [ProxyModule, forwardRef(() => RabbitModule)],
  controllers: [EntriesController],
  providers: [EntriesService],
})
export class EntriesModule {}
