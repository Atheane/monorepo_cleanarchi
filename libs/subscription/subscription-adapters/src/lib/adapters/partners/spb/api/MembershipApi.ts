import { IHttpBuilder } from '@oney/http';
import { SPBCreateMembershipRequest } from '../models/membership/SPBCreateMembershipRequest';
import { SPBCreateMembershipResponse } from '../models/membership/SPBCreateMembershipResponse';

export class MembershipApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async create(request: SPBCreateMembershipRequest): Promise<SPBCreateMembershipResponse> {
    const { data } = await this._http
      .post<SPBCreateMembershipResponse>(`/api/prospections`, request)
      .execute();
    return data;
  }

  async activate(insuranceMembershipNumber: string): Promise<void> {
    await this._http.get(`/api/subscriptions/${insuranceMembershipNumber}/activate`).execute();
  }
}
