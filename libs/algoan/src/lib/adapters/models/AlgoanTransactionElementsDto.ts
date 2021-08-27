export type AlgoanTransactionElementsDto = {
  elements: AlgoanElementDto[];
  metadata: {
    failure: number;
    success: number;
    total: number;
  };
};

export type AlgoanElementDto = {
  httpCode: string;
  status: number;
  resource: AlgoanTransactionResourceDto;
};

export type AlgoanTransactionResourceDto = {
  reference: string;
  date: string;
  amount: number;
  description: string;
  type: string;
  category: string;
  currency: string;
  banksUserCardId: string;
  userDescription: string;
  simplifiedDescription: string;
  organizationId: string;
  chatflowId: string;
  accountId: string;
  _id?: string;
  id?: string;

  algoanCategory?: string;
  inserted?: boolean;
  validity?: any;
  algoanType?: string;
  comments?: any[];
};
