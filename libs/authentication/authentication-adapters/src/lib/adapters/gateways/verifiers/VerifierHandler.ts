import { Container, inject, injectable } from 'inversify';
import { MaybeType } from '@oney/common-core';
import {
  Action,
  AuthFactor,
  AuthIdentifier,
  Channel,
  DefaultDomainErrorMessages,
  StrongAuthVerifier,
  UserError,
  UserRepository,
} from '@oney/authentication-core';
import { Reflection } from '../../../di/Reflection';
import { VerifierBase, VerifierServiceName } from '../../decorators/verifiers';
import './VerifierGateway';
import './ICGVerifierGateway';

@injectable()
export class VerifierHandler implements VerifierBase {
  container: Container;

  constructor(
    @inject(AuthIdentifier.userRepository) private readonly userRepository: UserRepository,
    container: Container,
    private readonly useIcgSmsAuthFactor: boolean,
  ) {
    this.container = container;
  }

  private toggleScaProvider(channel: Channel, authFactor: AuthFactor): VerifierServiceName {
    const shouldICGSmsFactorBeUsed = this.useIcgSmsAuthFactor && channel === Channel.SMS;
    const shouldICGCloudCardBeUsed = channel == null && authFactor === AuthFactor.CLOUDCARD;
    let verifierServiceName = VerifierServiceName.ODB;
    if (shouldICGSmsFactorBeUsed || shouldICGCloudCardBeUsed) {
      // We put either cloudCard or SMS, if cloudCard fails, it will fallback on sms.
      verifierServiceName = VerifierServiceName.ICG;
    }
    return verifierServiceName;
  }

  async generateVerifier(
    userId: string,
    action?: Action,
    byPassPinCode?: boolean,
  ): Promise<StrongAuthVerifier> {
    const maybeUser = await this.userRepository.getById(userId);
    if (maybeUser.type === MaybeType.Nothing) {
      throw new UserError.UserNotFound(DefaultDomainErrorMessages.USER_NOT_FOUND);
    }
    const user = maybeUser.value;
    const { channel, authFactor } = user.getUserAuthenticationMode(byPassPinCode);
    const verifierType = Reflection.getVerifierClassInstance(this.toggleScaProvider(channel, authFactor));
    const verifierBase = this.container.resolve<VerifierBase>(verifierType);
    return await verifierBase.generateVerifier(userId, action, byPassPinCode);
  }

  async verify(verifier: StrongAuthVerifier, credential?: string): Promise<StrongAuthVerifier> {
    const { channel, factor } = verifier;
    const verifierType = Reflection.getVerifierClassInstance(this.toggleScaProvider(channel, factor));
    const verifierBase = this.container.resolve<VerifierBase>(verifierType);
    return await verifierBase.verify(verifier, credential);
  }
}
