import { Module } from '@nestjs/common';
import { PsychicService } from './psychic.service';
import { PsychicController } from './psychic.controller';
import { Psychic, PsychicSchema } from 'control-risk/schemas/psychic.schema';
import { Answer, AnswerSchema } from 'control-risk/schemas/answers.schema';

import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Psychic.name,
        schema: PsychicSchema,
      },
      {
        name: Answer.name,
        schema: AnswerSchema,
      },
    ]),
  ],
  controllers: [PsychicController],
  providers: [PsychicService],
  exports: [PsychicService],
})
export class PsychicModule {}
