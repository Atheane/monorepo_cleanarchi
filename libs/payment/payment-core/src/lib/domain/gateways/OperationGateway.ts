import { GetCOPPayload } from '../types/GetCOPPayload';
import { Clearing } from '../types/clearing/Clearing';
import { GetSingleClearingPayload } from '../types/GetSingleClearingPayload';
import { OperationProperties } from '../aggregates/OperationProperties';

export interface OperationGateway {
  getSDD(reference: string): Promise<OperationProperties>;
  getCOP(getCOPPayload: GetCOPPayload): Promise<OperationProperties>;
  getClearings(reference: string): Promise<Clearing[]>;
  getSingleClearing(getSingleClearingPayload: GetSingleClearingPayload): Promise<OperationProperties>;
}
