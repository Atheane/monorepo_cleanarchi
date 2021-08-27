export interface BicProperties {
  bankCode: string;
  countryCode: string;
  locationCode: string;
  branchCode?: string;
}

export class Bic {
  readonly props: BicProperties;

  private constructor(props: BicProperties) {
    this.props = props;
  }

  static create(props: BicProperties): Bic {
    return new Bic(props);
  }
}
