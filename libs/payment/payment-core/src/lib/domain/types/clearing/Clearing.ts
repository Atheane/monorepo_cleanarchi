import { FinancialNetworkCode } from './FinancialNetworkCode';
import { OperationType } from '../operation/OperationType';
import { OperationStatus } from '../operation/OperationStatus';

export interface Clearing {
  reference: string;
  originalAmount: number;
  amount: number;
  financialNetworkCode: FinancialNetworkCode;
  exchangeRate: number;
  currency: string;
  status: OperationStatus;
  type: OperationType;
  cardId: string;
  merchant: {
    street: string;
    city: string;
    categoryCode: number;
    name: string;
  };
}
