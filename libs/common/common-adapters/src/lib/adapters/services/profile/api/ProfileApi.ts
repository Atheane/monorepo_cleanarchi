import { IHttpBuilder } from '@oney/http';
import { GetProfileInformationResponse } from '../models/GetProfileInformationResponse';
import { VerifyBankAccountOwnerCommand } from '../commands/VerifyBankAccountOwnerCommand';
import { VerifyBankAccountResponse } from '../models/VerifyBankAccountResponse';

export class ProfileApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async getProfileInformation(uid: string): Promise<GetProfileInformationResponse> {
    const result = await this._http.get<GetProfileInformationResponse>(`/profile/user/${uid}`).execute();
    return result.data;
  }

  async createProfile(cmd: { email: string; uid: string; phone: string }): Promise<void> {
    await this._http
      .post('/profile/user', {
        email: cmd.email,
        uid: cmd.uid,
        phone: cmd.phone,
      })
      .execute();
  }

  async verifyBankAccountOwner(cmd: VerifyBankAccountOwnerCommand): Promise<VerifyBankAccountResponse> {
    const result = await this._http
      .setDefaultHeaders({
        Authorization: `Bearer ${cmd.holder}`,
      })
      .post<VerifyBankAccountResponse>(`/profile/user/${cmd.uid}/verify-bankaccount-owner`, {
        identity: cmd.identity,
        lastName: cmd.lastName,
        firstName: cmd.firstName,
        birthDate: cmd.birthDate,
        bankName: cmd.bankName,
      })
      .execute();
    return result.data;
  }
}
