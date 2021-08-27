import {
  Action,
  AuthenticationError,
  AuthFactor,
  AuthIdentifier,
  AuthStatus,
  Channel,
  ChannelGateway,
  Customer,
  DefaultDomainErrorMessages,
  HashGateway,
  HashType,
  IdentityEncodingService,
  IdGenerator,
  OtpGenerator,
  ScaVerifierGateway,
  StrongAuthVerifier,
  UserError,
  UserRepository,
} from '@oney/authentication-core';
import { MaybeType } from '@oney/common-core';
import { inject, injectable } from 'inversify';
import { Verifier, VerifierServiceName } from '../../decorators/verifiers';
import { VerifierMapper } from '../../mappers/jwt/VerifierMapper';

@Verifier(VerifierServiceName.ODB)
@injectable()
export class VerifierGateway implements ScaVerifierGateway {
  private readonly scaTokenMapper: VerifierMapper;

  constructor(
    @inject(AuthIdentifier.idGenerator) private readonly idGenerator: IdGenerator,
    @inject(AuthIdentifier.otpGenerator) private readonly otpGenerator: OtpGenerator,
    @inject(AuthIdentifier.channelGateway) private readonly channelGateway: ChannelGateway,
    @inject(AuthIdentifier.userRepository) private readonly userRepository: UserRepository,
    @inject(AuthIdentifier.hashGateway) private readonly hashGateway: HashGateway,
    @inject(AuthIdentifier.identityEncodingService)
    private readonly identityEncodingService: IdentityEncodingService,
  ) {
    this.scaTokenMapper = new VerifierMapper();
  }

  async generateVerifier(
    userId: string,
    action?: Action,
    byPassPinCode?: boolean,
  ): Promise<StrongAuthVerifier> {
    let credentials: string;
    const maybeUser = await this.userRepository.getById(userId);
    if (maybeUser.type === MaybeType.Nothing) {
      throw new UserError.UserNotFound(DefaultDomainErrorMessages.USER_NOT_FOUND);
    }
    const user = maybeUser.value;
    const { email, pinCode } = user.props;
    const { channel, authFactor } = user.getUserAuthenticationMode(byPassPinCode);
    const expired = new Date();
    if (authFactor === AuthFactor.PIN_CODE) {
      credentials = pinCode.value;
    } else if (authFactor === AuthFactor.PASSWORD) {
      credentials = user.props.password;
    } else {
      credentials = await this.otpGenerator.generateOTP();
    }
    expired.setMinutes(expired.getMinutes() + 5);

    const verifier = new StrongAuthVerifier({
      status: AuthStatus.PENDING,
      verifierId: this.idGenerator.generateUniqueID(),
      factor: authFactor,
      expirationDate: expired,
      valid: false,
      channel,
      credential: credentials,
      action,
      customer: new Customer({
        uid: userId,
        email: email.address,
      }),
      metadatas:
        (channel === Channel.SMS && authFactor === AuthFactor.OTP && { otpLength: credentials.length }) ||
        null,
    });

    if (channel === Channel.EMAIL) {
      const verifierIdToken = this.identityEncodingService.scaToken.encode(
        this.scaTokenMapper.fromDomain(verifier),
      );
      await this.channelGateway.send<Channel.EMAIL>(channel, {
        otp: credentials,
        token: verifierIdToken,
        email: email.address,
      });
    }

    if (channel === Channel.SMS) {
      await this.channelGateway.send(channel, credentials);
    }

    return verifier;
  }

  async verify(verifier: StrongAuthVerifier, credential?: string): Promise<StrongAuthVerifier> {
    if (verifier.isVerifierExpired()) {
      return Promise.resolve(
        new StrongAuthVerifier({
          ...verifier,
          status: AuthStatus.EXPIRED,
          valid: false,
        }),
      );
    }
    if (verifier.factor === AuthFactor.PIN_CODE) {
      // eslint-disable-next-line no-param-reassign
      credential = await this.hashGateway.hash(credential, HashType.MD5);
    }
    let isValid: boolean;
    if (verifier.factor === AuthFactor.PASSWORD) {
      isValid = await this.hashGateway.compareHash(credential, verifier.credential);
    } else {
      isValid = verifier.isCredentialsValid(credential);
    }
    if (isValid) {
      const expired = new Date();
      expired.setMinutes(expired.getMinutes() + 5);
      const updatedVerifier = new StrongAuthVerifier({
        ...verifier,
        status: AuthStatus.DONE,
        expirationDate: expired,
        valid: isValid,
      });
      return Promise.resolve(updatedVerifier);
    }

    const e = new AuthenticationError.BadCredentials();
    e.cause = verifier;
    return Promise.reject(e);
  }
}
