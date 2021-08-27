import { Aden } from './aden-analysis/Aden';

export interface AlgoanBankUser {
  id: string;
  adenTriggers: AdenTriggers;
  status: string;
  aden: Aden[];
  scoreTriggers: {};
  scores: [];
}

export interface AdenTriggers {
  onSynchronizationFinished: boolean;
}
