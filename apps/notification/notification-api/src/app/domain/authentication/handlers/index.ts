import { AuthSignatureVerificationFailed, PhoneProvisioningFailed } from '@oney/authentication-messages';
import { EventManagerRegister } from '@oney/messages-adapters';
import { AuthSignatureVerificationFailedHandler } from './AuthSignatureVerificationFailedHandler';
import { ProvisioningErrorHandler } from './PhoneProvisioningFailedHandler';

export async function initAuthenticationSubscribers(
  em: EventManagerRegister,
  odbAuthenticationTopic: string,
) {
  em.register(PhoneProvisioningFailed, ProvisioningErrorHandler, {
    topic: odbAuthenticationTopic,
  });
  em.register(AuthSignatureVerificationFailed, AuthSignatureVerificationFailedHandler, {
    topic: odbAuthenticationTopic,
  });
}
