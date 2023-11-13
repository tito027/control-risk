import { Module } from '@nestjs/common';
import { SchedulesController } from './shedules.controller';
import {ProxyModule} from "../common/proxy/proxy.module";

@Module({
  imports: [ProxyModule],
  controllers: [SchedulesController]
})
export class ShedulesModule {}
