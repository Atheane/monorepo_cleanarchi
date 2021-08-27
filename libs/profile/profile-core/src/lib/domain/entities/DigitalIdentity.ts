import { Entity } from '@oney/ddd';

export interface DigitalIdentityProps {
  id: string;
  phone?: string;
}
//fixme should be part of Profile AggregateRoot.
export class DigitalIdentity extends Entity<DigitalIdentityProps> {
  props: DigitalIdentityProps;
  constructor(props: DigitalIdentityProps) {
    super(props.id);
    this.props = props;
  }
}
