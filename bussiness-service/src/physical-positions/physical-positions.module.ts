import { Module } from '@nestjs/common';
import { PhysicalPositionsController } from './physical-positions.controller';
import { PhysicalPositionsService } from './physical-positions.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PhysicalPosition,
  PhysicalPositionSchema,
} from 'control-risk/schemas/physicalPosition.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PhysicalPosition.name,
        schema: PhysicalPositionSchema,
      },
    ]),
  ],
  controllers: [PhysicalPositionsController],
  providers: [PhysicalPositionsService],
})
export class PhysicalPositionsModule {}
