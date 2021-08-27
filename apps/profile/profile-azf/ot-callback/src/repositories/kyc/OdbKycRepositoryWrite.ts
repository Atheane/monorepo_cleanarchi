import { WriteService } from '@oney/common-core';
import { DecisionCallbackEvent, KycRepositoryWrite } from '@oney/profile-core';
import { injectable } from 'inversify';

@injectable()
export class OdbKycRepositoryWrite implements KycRepositoryWrite {
  constructor(private readonly _writeService: WriteService) {}

  async save(id: string, data: DecisionCallbackEvent): Promise<void> {
    await this._writeService.updateOne(id, data);
  }
}
