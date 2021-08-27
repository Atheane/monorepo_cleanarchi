import { IHttpBuilder } from '@oney/http';
import { CreateBankAccountRequest } from '../models/CreateBankAccountRequest';
import { GetBankAccountIdRequest } from '../models/GetBankAccountIdRequest';
import { GetBankAccountIdResponse } from '../models/GetBankAccountIdResponse';
import { OrderCardRequest } from '../models/OrderCardRequest';
import { CreatePaymentRequest } from '../models/CreatePaymentRequest';

export class PaymentApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async createBankAccount(request: CreateBankAccountRequest): Promise<string> {
    const { data } = await this._http
      .post<GetBankAccountIdResponse>(`/payment/user/${request.uid}`, request)
      .execute();
    return data.bankAccountId;
  }

  async getBankAccountId(request: GetBankAccountIdRequest): Promise<string> {
    const { data } = await this._http
      .get<GetBankAccountIdResponse>(`/payment/user/${request.uid}/bankaccount`)
      .execute();
    return data.bankAccountId;
  }

  async orderCard(cmd: OrderCardRequest): Promise<{ id: string }> {
    const result = await this._http
      .post<{ id: string }>(`/payment/accounts/${cmd.uid}/card`, {
        cardType: cmd.cardType,
      })
      .execute();
    return result.data;
  }

  async createPayment(cmd: CreatePaymentRequest): Promise<void> {
    await this._http.post<{ id: string }>(`/payment/p2p`, cmd).execute();
    return;
  }
}
