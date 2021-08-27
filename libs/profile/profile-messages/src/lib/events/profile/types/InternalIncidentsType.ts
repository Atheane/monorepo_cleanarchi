export type InternalIncidentsType = {
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
};
