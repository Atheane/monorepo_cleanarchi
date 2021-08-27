import { AdenDto } from './AdenDto/AlgoanAdenDto';

export class AlgoanBankUserDto {
  id: string;
  adenTriggers: AdenTriggersDto;
  status: string;
  aden: AdenDto[];
  scoreTriggers: {};
  scores: [];
}

export class AdenTriggersDto {
  onSynchronizationFinished: boolean;
}
