import { Otp, OtpRepositoryRead, OtpErrors } from '@oney/profile-core';
import { CoreTypes, QueryService } from '@oney/common-core';
import { inject, injectable } from 'inversify';
import { OtpMapper } from '../../mappers/OtpMapper';
import { OtpDbModel } from '../../models/OtpDbModel';

@injectable()
export class OdbOtpRepositoryRead implements OtpRepositoryRead {
  constructor(
    @inject(CoreTypes.queryService) private readonly _queryService: QueryService,
    private readonly _otpMapper: OtpMapper,
  ) {}

  async getOtpByUid(uid: string): Promise<Otp> {
    const savedOtp: OtpDbModel = await this._queryService.findOne({ uid });
    if (!savedOtp) {
      throw new OtpErrors.OtpNotFound('No phone number to validate');
    }
    return this._otpMapper.toDomain(savedOtp);
  }
}
