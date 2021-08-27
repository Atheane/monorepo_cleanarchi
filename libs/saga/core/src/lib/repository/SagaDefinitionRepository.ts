import { OneySymbol } from '@oney/core';
import { SagaDefinitionDataModel } from './models/SagaDefinitionDataModel';

export const SymSagaDefinitionRepository = OneySymbol('SymSagaDefinitionRepository');

export interface SagaDefinitionRepository {
  persist(definition: SagaDefinitionDataModel): Promise<void>;
}
