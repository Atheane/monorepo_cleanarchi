import { BankConnection } from '../aggregates/BankConnection';
import { ISigninField } from '../types/ISigninField';

export interface BankConnectionGateway {
  askConnection(bankId: string, userId: string, values: ISigninField[]): Promise<BankConnection>;
  updateConnection({
    bankConnection,
    form,
  }: {
    bankConnection: BankConnection;
    form: ISigninField[];
  }): Promise<BankConnection>;
  deleteOne(id: string): Promise<void>;
}
