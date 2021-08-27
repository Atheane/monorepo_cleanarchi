export class InternalIncidents {
  worseUnpaidStage: string;
  worseHouseholdFunctioningStatusCode: number;
  worseHouseholdFunctioningStatusCodeLastUpdate: Date;
  storeCreditLimitBlocked: boolean;
  storeCreditLimitBlockReason: string;
  oneyVplusCreditLimitBlocked: boolean;
  oneyVplusCreditLimitBlockReason: string;
  debtRestructured: boolean;
  overIndebted: boolean;
  amicableExitDate: Date;

  constructor(internalIncidents: InternalIncidents) {
    Object.assign(this, internalIncidents);
  }
}
