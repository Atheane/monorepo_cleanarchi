import { BankConnection } from '../aggregates/BankConnection';
import { ISigninField } from '../types/ISigninField';

export interface ScaConnectionGateway {
  authenticateOtp(connection: BankConnection, form: ISigninField[]): Promise<BankConnection>;
  authenticateThirdParty(connection: BankConnection): Promise<BankConnection>;
  triggerSca(connection: BankConnection): Promise<BankConnection>;
  postScaResult(connection: BankConnection, urlCallBack: string): Promise<void>;
}
