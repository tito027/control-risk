import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {
  AssignmentHistory,
  AssignmentHistorySchema,
} from 'control-risk/schemas/assignmentHistory.schema';
import { AssignmentHistoryService } from './assignmentHistory.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AssignmentHistory.name,
        schema: AssignmentHistorySchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [AssignmentHistoryService],
  exports: [AssignmentHistoryService],
})
export class AssignmentHistoryModule {}
