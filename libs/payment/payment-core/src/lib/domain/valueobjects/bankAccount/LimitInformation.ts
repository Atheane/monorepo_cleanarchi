export interface GlobalLimits {
  annualAllowance: number;
  monthlyAllowance: number;
  weeklyAllowance: number;
}

export interface LimitInformationProperties {
  globalIn?: GlobalLimits;
  globalOut?: GlobalLimits;
  balanceLimit: number;
  technicalLimit?: number;
}

export interface SettableLimitInformation {
  globalIn?: GlobalLimits;
  globalOut?: GlobalLimits;
  balanceLimit?: number;
}

export class LimitInformation {
  props: LimitInformationProperties;
  constructor(props: LimitInformationProperties) {
    this.props = props;
  }
}
