import { Otp, OtpRepositoryWrite } from '@oney/profile-core';
import { CoreTypes, WriteService } from '@oney/common-core';
import { inject, injectable } from 'inversify';
import { OtpMapper } from '../../mappers/OtpMapper';

@injectable()
export class OdbOtpRepositoryWrite implements OtpRepositoryWrite {
  constructor(
    @inject(CoreTypes.writeService) private readonly _writeService: WriteService,
    private readonly _otpMapper: OtpMapper,
  ) {}

  async delete(otp: Otp): Promise<void> {
    await this._writeService.deleteOne(otp.id);
  }

  async save(otp: Otp): Promise<Otp> {
    const savedOtp = await this._writeService.updateOne(otp.id, this._otpMapper.fromDomain(otp));
    return this._otpMapper.toDomain(savedOtp);
  }
}
