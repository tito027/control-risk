import { DefaultDto } from './default.dto';

export class AnswerDto extends DefaultDto {
  readonly userID: string;
  readonly testID: string;
  readonly answers: AnswersDto[];
  readonly comment: string;
}

export class AnswersDto extends DefaultDto {
  readonly name: string;
  readonly needResponse: boolean;
  readonly question: string;
  readonly answer: string;
}
