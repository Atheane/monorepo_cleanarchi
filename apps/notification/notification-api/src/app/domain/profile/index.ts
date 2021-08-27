import { EventManagerRegister } from '@oney/messages-adapters';
import {
  ConsentUpdated,
  CustomerServiceDemandSent,
  IdentityDocumentValidated,
  PhoneOtpCreated,
  PhoneOtpUpdated,
  ProfileActivated,
  ProfileStatusChanged,
} from '@oney/profile-messages';
import { IdentityDocumentValidatedHandler } from './IdentityDocumentValidatedHandler';
import { ProfileActivatedHandler } from './ProfileActivatedHandler';
import { CustomerServiceDemandSentHandler } from './CustomerServiceDemandSentHandler';
import { ProfileStatusChangedHandler } from './ProfileStatusChangedHandler';
import { PhoneOtpCreatedHandler } from './PhoneOtpCreatedHandler';
import { PhoneOtpUpdatedHandler } from './PhoneOtpUpdatedHandler';
import { ConsentUpdatedHandler } from '../payment/handlers/ConsentUpdatedHandler';

export async function initProfileSubscribers(em: EventManagerRegister, odbProfileTopic: string) {
  // @oney/profile -> odbProfileTopic
  em.register(ProfileActivated, ProfileActivatedHandler, { topic: odbProfileTopic });
  em.register(IdentityDocumentValidated, IdentityDocumentValidatedHandler, { topic: odbProfileTopic });
  em.register(CustomerServiceDemandSent, CustomerServiceDemandSentHandler, { topic: odbProfileTopic });
  em.register(ConsentUpdated, ConsentUpdatedHandler, {
    topic: odbProfileTopic,
  });
  em.register(ProfileStatusChanged, ProfileStatusChangedHandler, { topic: odbProfileTopic });
  em.register(PhoneOtpCreated, PhoneOtpCreatedHandler, {
    topic: odbProfileTopic,
  });
  em.register(PhoneOtpUpdated, PhoneOtpUpdatedHandler, {
    topic: odbProfileTopic,
  });
}
