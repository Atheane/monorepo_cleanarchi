import { DomainEvent } from '@oney/ddd';
import { EventProducer, EventProducerDispatcher } from '@oney/messages-core';
import { Profile } from '@oney/profile-core';
import { AzureServiceBus } from '@oney/az-servicebus-adapters';
import { ProfileMapper } from '@oney/profile-adapters';
import { injectable } from 'inversify';
import { LegacyEvent, LegacyEventPayload, LegacyStepName } from './models/LegacyEvent';
import { domainEventsToLegacyEvents } from './models/domainEventsToLegacyEvents';

@injectable()
export class ProfileEventProducerDispatcher extends EventProducerDispatcher {
  private readonly _legacyTopic = 'topic_odb-account_user-validated-steps';
  private _profile: Profile;
  constructor(
    private readonly _eventDispatcher: EventProducerDispatcher,
    private readonly _eventBus: AzureServiceBus,
    private readonly _profileMapper: ProfileMapper,
  ) {
    super();
  }

  isProfileInstance(input: any): input is Profile {
    return input instanceof Profile;
  }

  async dispatch(producer: EventProducer): Promise<void> {
    if (this.isProfileInstance(producer)) {
      this._profile = producer;
      const legacyEvents: LegacyEvent[] = producer
        .getEvents()
        .filter(domainEvent => domainEventsToLegacyEvents.includes(domainEvent.constructor.name))
        .map(domainEvent => this.getLegacyEvent(domainEvent));

      await this._eventDispatcher.dispatch(producer);

      legacyEvents.forEach(legacyEvent => {
        this.publish(legacyEvent.payload, legacyEvent.topic);
      });
    } else {
      await this._eventDispatcher.dispatch(producer);
    }
  }

  private async publish(eventPayload: LegacyEventPayload, topic: string): Promise<void> {
    const topicClient = this._eventBus.createChannel(topic);
    const sender = topicClient.createSender();
    return await sender.send({
      body: eventPayload,
    });
  }

  private getLegacyEvent(domainEvent: DomainEvent): LegacyEvent {
    const legacyEventProfileData = this._profileMapper.fromDomain(this._profile).user_profile;
    return {
      payload: {
        uid: this._profile.id,
        step: LegacyStepName[domainEvent.constructor.name],
        data: {
          uid: this._profile.id,
          email: this._profile.props.email,
          biometric_key: this._profile.props.biometricKey,
          is_validated: this._profile.props.enabled,
          profile: legacyEventProfileData,
          steps: this._profile.props.kyc.steps,
          status: this._profile.props.informations.status,
          contract_signed_at: this._profile.props.kyc.contractSignedAt,
        },
      },
      topic: this._legacyTopic,
    };
  }
}
