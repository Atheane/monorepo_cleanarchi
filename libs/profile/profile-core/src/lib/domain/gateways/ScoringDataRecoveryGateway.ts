import { FiscalData } from '../valuesObjects/FiscalData';

export interface DataRecoveryCommand {
  caseReference: string;
}

export interface ScoringDataRecoveryGateway {
  get(cmd: DataRecoveryCommand): Promise<FiscalData>;
}
