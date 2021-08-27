import { DeepPartial } from 'ts-essentials';
import { SagaState } from '../../models/SagaState';
import { SagaWorkflowCtor } from '../../types/SagaWorkflowCtor';

export class SagaIntegrityError {
  constructor(data: DeepPartial<SagaIntegrityError>) {
    Object.assign(this, data);
  }

  public saga: SagaWorkflowCtor<SagaState>;
  public message: string;
  public props: any;
}
