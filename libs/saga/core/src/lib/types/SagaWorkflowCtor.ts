import { Newable } from 'ts-essentials';
import { SagaState } from '../models/SagaState';
import { SagaWorkflow } from '../models/SagaWorkflow';

export type SagaWorkflowCtor<TSagaState extends SagaState = SagaState> = Newable<SagaWorkflow<TSagaState>>;
