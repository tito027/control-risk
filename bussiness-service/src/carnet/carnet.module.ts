import { Module } from '@nestjs/common';
import { CarnetController } from './carnet.controller';
import { CarnetService } from './carnet.service';

@Module({
  controllers: [CarnetController],
  providers: [CarnetService]
})
export class CarnetModule {}
