import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reason, ReasonSchema } from './reason.schema';
import { ReasonsController } from './reasons.controller';
import { ReasonsService } from './reasons.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reason.name, schema: ReasonSchema }]),
  ],
  exports: [ReasonsService],
  controllers: [ReasonsController],
  providers: [ReasonsService],
})
export class ReasonsModule {}
