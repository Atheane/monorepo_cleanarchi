import { DecisionCallbackEvent } from '../../types/DecisionCallbackEvent';

export interface KycRepositoryWrite {
  save(id: string, data: DecisionCallbackEvent): Promise<void>;
}
