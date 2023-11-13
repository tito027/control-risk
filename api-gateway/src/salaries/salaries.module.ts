import { Module, forwardRef } from '@nestjs/common';
import { SalariesService } from './salaries.service';
import { SalariesController } from './salaries.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { UserModule } from 'src/user/user.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';

@Module({
  imports: [ProxyModule, UserModule, forwardRef(() => RabbitModule)],
  controllers: [SalariesController],
  providers: [SalariesService],
})
export class SalariesModule {}
