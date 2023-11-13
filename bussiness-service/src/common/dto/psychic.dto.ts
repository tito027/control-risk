import { DefaultDto } from './default.dto';

export class PsychicDto extends DefaultDto {
  readonly name: string;
  readonly indication: string;
  readonly questions: OptionDto[];
  readonly comment: boolean;
  readonly dynamicInput: boolean;
}

export class OptionDto extends DefaultDto {
  readonly label: string;
  readonly value: string;
  readonly parent: string;
}
