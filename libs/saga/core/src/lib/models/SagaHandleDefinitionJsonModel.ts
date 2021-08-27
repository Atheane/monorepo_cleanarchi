export interface SagaHandleDefinitionJsonModel {
  isStartedByDefinition: boolean;
  event: {
    class: string;
    eventName: string;
    namespace: string;
    version: number;
  };
  handle: string;
}
