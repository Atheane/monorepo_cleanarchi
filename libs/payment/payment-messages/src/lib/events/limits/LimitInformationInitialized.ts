import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';

namespace LimitInformationInitialized {
  interface GlobalLimits {
    annualAllowance: number;
    monthlyAllowance: number;
    weeklyAllowance: number;
  }

  export interface Properties {
    globalIn?: GlobalLimits;
    globalOut?: GlobalLimits;
    balanceLimit: number;
    technicalLimit: number;
  }
}

export interface LimitInformationInitializedProps {
  uid: string;
  limitInformation: LimitInformationInitialized.Properties;
}

@DecoratedEvent({ version: 1, name: 'LIMIT_INFORMATION_INITIALIZED', namespace: '@oney/payment' })
export class LimitInformationInitialized implements DomainEvent<LimitInformationInitializedProps> {
  id: string = uuidV4();

  props: LimitInformationInitializedProps;

  constructor(props: LimitInformationInitializedProps) {
    this.props = { ...props };
  }
}
