import { GetSplitContractsResponse } from '@oney/common-adapters';

export interface CreditGateway {
  getDetails(uid: string): Promise<GetSplitContractsResponse[]>;
}
