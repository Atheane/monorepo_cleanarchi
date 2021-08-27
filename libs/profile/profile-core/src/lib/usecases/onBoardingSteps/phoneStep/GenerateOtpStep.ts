import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { Otp, OtpErrors, OtpRepositoryRead, OtpRepositoryWrite, Steps } from '@oney/profile-core';
import { Identifiers } from '../../../Identifiers';
import { ProfileRepositoryRead } from '../../../domain/repositories/read/ProfileRepositoryRead';
import { OtpGateway } from '../../../domain/gateways/OtpGateway';
import { ProfileErrors } from '../../../domain/models/ProfileError';

export interface GenerateOtpStepRequest {
  uid: string;
  phone: string;
}

@injectable()
export class GenerateOtpStep implements Usecase<GenerateOtpStepRequest, void> {
  constructor(
    @inject(Identifiers.profileRepositoryRead)
    private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.otpGateway)
    private readonly _otpGateway: OtpGateway,
    @inject(Identifiers.otpRepositoryWrite)
    private readonly _otpRepositoryWrite: OtpRepositoryWrite,
    @inject(Identifiers.otpRepositoryRead)
    private readonly _otpRepositoryRead: OtpRepositoryRead,
    @inject(EventProducerDispatcher)
    private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute({ uid, phone }: GenerateOtpStepRequest): Promise<void> {
    const profile = await this._profileRepositoryRead.getUserById(uid);

    if (!profile.hasOnboardingStep(Steps.PHONE_STEP)) {
      throw new OtpErrors.PhoneNumberAlreadyValidated('PHONE_NUMBER_ALREADY_VALIDATED');
    }

    if (profile.props.informations.phone === phone) {
      throw new ProfileErrors.ProfileNotFound('PHONE_NUMBER_ALREADY_USED');
    }

    const code = this._otpGateway.generateCode();

    const codeHash = this._otpGateway.generateCodeHash(code);

    let otp;

    try {
      otp = await this._otpRepositoryRead.getOtpByUid(uid);

      if (this._otpGateway.isMaxAttemptsExceeded(otp) && this._otpGateway.isLockDurationElapsed(otp)) {
        otp.updatePhoneOtp(code, codeHash).resetCreationAttempts();
      } else if (
        this._otpGateway.isMaxAttemptsExceeded(otp) &&
        !this._otpGateway.isLockDurationElapsed(otp)
      ) {
        throw new OtpErrors.MaxAttemptsExceeded('OTP_MAX_ATTEMPTS_EXCEEDED');
      } else {
        otp.updatePhoneOtp(code, codeHash).incrementCreationAttempts();
      }
    } catch (error) {
      if (error instanceof OtpErrors.OtpNotFound) {
        // No OTP found => create a new one
        otp = new Otp({
          uid,
          phone,
          codeHash,
          creationAttempts: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        otp.createPhoneOtp(code);
      } else {
        throw error;
      }
    }

    await this._otpRepositoryWrite.save(otp);
    await this.eventDispatcher.dispatch(otp);
  }

  async canExecute(identity: Identity, request: GenerateOtpStepRequest): Promise<boolean> {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.profile);
    if (!scope) {
      return false;
    }

    return (
      identity.uid === request.uid &&
      scope.permissions.write === Authorization.self &&
      scope.permissions.read === Authorization.self
    );
  }
}
