import { SagaHandleDefinitionJsonModel } from './SagaHandleDefinitionJsonModel';

export interface SagaDefinitionJsonModel {
  saga: {
    class: string;
    namespace: string;
    id: string;
    version: number;
  };
  startedByDefinition: SagaHandleDefinitionJsonModel;
  handles: SagaHandleDefinitionJsonModel[];
}
