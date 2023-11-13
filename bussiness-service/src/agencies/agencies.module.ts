import { Module } from '@nestjs/common';
import { AgenciesController } from './agencies.controller';
import { AgenciesService } from './agencies.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Agency, AgencySchema } from 'control-risk/schemas/agency.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Agency.name,
        schema: AgencySchema,
      },
    ]),
  ],
  controllers: [AgenciesController],
  providers: [AgenciesService],
  exports: [AgenciesService],
})
export class AgenciesModule {}
