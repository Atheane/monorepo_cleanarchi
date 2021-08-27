import { AggregateRoot } from '@oney/ddd';

export interface CreditorProperties {
  userId: string;
  isEligible: boolean;
}

export class Creditor extends AggregateRoot<CreditorProperties> {
  public props: CreditorProperties;

  constructor(props: CreditorProperties) {
    super(props.userId);
    this.props = props;
  }

  static create(props: CreditorProperties): Creditor {
    return new Creditor(props);
  }

  update(partialProps: Partial<CreditorProperties>): void {
    this.props = {
      ...this.props,
      ...partialProps,
    };
  }
}
