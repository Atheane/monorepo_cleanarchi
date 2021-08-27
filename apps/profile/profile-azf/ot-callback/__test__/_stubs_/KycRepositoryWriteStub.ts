import { DecisionCallbackEvent, KycRepositoryWrite } from '@oney/profile-core';

export class KycRepositoryWriteStub implements KycRepositoryWrite {
  Kyc = [];

  clear() {
    this.Kyc = [];
  }

  async save(id: string, data: DecisionCallbackEvent): Promise<void> {
    this.Kyc.push(data);
  }
}
