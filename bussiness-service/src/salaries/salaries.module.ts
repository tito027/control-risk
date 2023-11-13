import { Module } from '@nestjs/common';
import { SalariesService } from './salaries.service';
import { SalariesController } from './salaries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Salary, SalarySchema } from 'control-risk/schemas/salaries.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Salary.name,
        schema: SalarySchema,
      },
    ]),
  ],
  controllers: [SalariesController],
  providers: [SalariesService],
  exports: [SalariesService]
})
export class SalariesModule {}
