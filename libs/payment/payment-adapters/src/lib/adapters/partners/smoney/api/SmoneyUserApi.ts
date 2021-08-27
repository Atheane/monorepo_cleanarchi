import { IHttpBuilder, Result } from '@oney/http';
import { SmoneyDeclarativeFiscalSituationRequest } from '../models/declarativeFiscalSituation/SmoneyDeclarativeFiscalSituationRequest';
import { SmoneyFatcaRequest } from '../models/fatca/SmoneyFatcaRequest';
import {
  SmoneyUpdateLimitGlobalOut,
  SmoneyUpdateLimitInformationRequest,
} from '../models/bankAccount/LimitInformationRequest';
import { SmoneyCreateUserRequest } from '../models/user/SmoneyCreateUserRequest';
import { SmoneyUpdateUserRequest } from '../models/user/SmoneyUpdateUserRequest';
import { SmoneyUserRequest } from '../models/user/SmoneyUserRequest';
import { SmoneyUserResponse } from '../models/user/SmoneyUserResponse';
import { SmoneyAddBeneficiaryRequest } from '../models/user/SmoneyAddBeneficiaryRequest';
import { SmoneyAddBeneficiaryResponse } from '../models/user/SmoneyAddBeneficiaryResponse';

export class SmoneyUserApi {
  constructor(private readonly _http: IHttpBuilder, private readonly _bic: string) {}

  async getUserInfos(userRequest: SmoneyUserRequest): Promise<SmoneyUserResponse> {
    const { data } = await this._http.get<SmoneyUserResponse>(`users/${userRequest.appUserId}`).execute();
    return data;
  }

  async updateUser(
    appUserId: string,
    userUpdateRequest: SmoneyUpdateUserRequest,
  ): Promise<SmoneyUserResponse> {
    const { data } = await this._http
      .setAdditionnalHeaders({
        'Content-Type': 'application/vnd.s-money.v1+json',
      })
      .put<SmoneyUserResponse>(`users/${appUserId}`, userUpdateRequest)
      .execute();
    return data;
  }

  updateDeclarativeFiscalSituation(
    appUserId: string,
    declarativeInfos: SmoneyDeclarativeFiscalSituationRequest,
  ): Promise<Result<void>> {
    return this._http.post<void>(`users/${appUserId}/declarative`, declarativeInfos).execute();
  }

  updateFatca(appUserId: string, fatcaInfos: SmoneyFatcaRequest): Promise<Result<void>> {
    return this._http.patch<void>(`user/${appUserId}/fatcaeai`, fatcaInfos).execute();
  }

  async createUser(request: SmoneyCreateUserRequest): Promise<SmoneyUserResponse> {
    const result = await this._http.post<SmoneyUserResponse>('users', request).execute();
    return result.data;
  }

  updateLimit(appUserId: string, limitInfos: SmoneyUpdateLimitInformationRequest): Promise<Result<void>> {
    return this._http.put<void>(`users/${appUserId}/limits`, limitInfos).execute();
  }

  updateLimitGlobalOut(appUserId: string, limitInfos: SmoneyUpdateLimitGlobalOut): Promise<Result<void>> {
    return this._http.put<void>(`users/${appUserId}/limits`, limitInfos).execute();
  }

  async addBeneficiary(request: SmoneyAddBeneficiaryRequest): Promise<SmoneyAddBeneficiaryResponse> {
    const { uid, DisplayName, Bic, Iban, IsMine } = request;
    const { data } = await this._http
      .post<SmoneyAddBeneficiaryResponse>(`/users/${uid}/bankaccounts`, {
        DisplayName,
        Bic,
        Iban,
        IsMine,
      })
      .execute();
    return data;
  }
}
