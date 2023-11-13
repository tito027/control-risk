import { forwardRef, Module } from '@nestjs/common';
import { PsychicController } from './psychic.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ProxyModule, forwardRef(() => RabbitModule), UserModule],
  controllers: [PsychicController],
})
export class PsychicModule {}
