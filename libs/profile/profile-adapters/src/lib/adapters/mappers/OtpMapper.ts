import { Mapper } from '@oney/common-core';
import { Otp } from '@oney/profile-core';
import { injectable } from 'inversify';
import { OtpDbModel } from '../models/OtpDbModel';

@injectable()
export class OtpMapper implements Mapper<Otp, OtpDbModel> {
  toDomain(raw: OtpDbModel): Otp {
    return new Otp({
      uid: raw.uid,
      codeHash: raw.codeHash,
      phone: raw.phone,
      creationAttempts: raw.creation_attempts,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
  }

  fromDomain(otp: Otp): OtpDbModel {
    return {
      uid: otp.props.uid,
      codeHash: otp.props.codeHash,
      phone: otp.props.phone,
      creation_attempts: otp.props.creationAttempts,
      created_at: otp.props.createdAt,
      updated_at: otp.props.updatedAt,
    };
  }
}
