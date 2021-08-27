import { IHttpBuilder } from '@oney/http';

export interface SmoneyDebtRequest {
  userId: string;
}

export interface SmoneyDebtResponse {
  value: SmoneyDebt[];
  links: [];
}

export interface SmoneyDebt {
  OrderId: string;
  AppUserId: string;
  Date: string;
  DebtAmount: number;
  RemainingDebtAmount: number;
  Status: number;
  Reason: string;
}

export class SmoneyDebtApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async getAll(debtRequest: SmoneyDebtRequest): Promise<SmoneyDebtResponse> {
    const url = `ClientDebts?appuserid=${debtRequest.userId}`;
    const { data } = await this._http.get<SmoneyDebtResponse>(url).execute();
    return data;
  }

  async updateRemaningAmount({ OrderId, RemainingDebtAmount }: SmoneyDebt): Promise<void> {
    const url = `ClientDebts/${OrderId}/RemainingDebtAmount`;
    await this._http
      .put<SmoneyDebtResponse>(url, { RemainingDebtAmount })
      .execute();
  }

  async updateStatus({ OrderId, Status }: SmoneyDebt): Promise<void> {
    const url = `ClientDebts/${OrderId}/Status`;
    await this._http
      .put<SmoneyDebtResponse>(url, { Status: Status })
      .execute();
  }
}
