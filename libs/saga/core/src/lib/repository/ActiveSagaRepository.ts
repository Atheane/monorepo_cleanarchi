import { OneySymbol } from '@oney/core';
import { ActiveSagaDataModel } from './models/ActiveSagaDataModel';
import { SagaState } from '../models/SagaState';

export enum FindOptions {
  UNKNOWN = 'UNKNOWN',
  NOT_COMPLETED = 'NOT_COMPLETED',
  COMPLETED = 'COMPLETED',
  BOTH = 'BOTH',
}

export const SymActiveSagaRepository = OneySymbol('SymActiveSagaRepository');

export interface ActiveSagaRepository {
  persist<TSagaState extends SagaState>(data: ActiveSagaDataModel<TSagaState>): Promise<any>;

  find<TSagaState extends SagaState>(
    namespace: string,
    id: string,
    version: number,
    option: FindOptions,
  ): Promise<ActiveSagaDataModel<TSagaState>[]>;
}
