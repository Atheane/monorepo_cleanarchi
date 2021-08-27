import { IHttpBuilder } from '@oney/http';
import { CdpTips } from '../../../models/CdpTips';

export class TipsApi {
  constructor(private readonly http: IHttpBuilder) {}

  async get(uid: string): Promise<CdpTips> {
    const result = await this.http
      .post<CdpTips>('/query-recommender', {
        uId: uid,
        recommenderContext: {
          channel: null,
          offerTag: null,
        },
      })
      .execute();
    return result.data;
  }
}
