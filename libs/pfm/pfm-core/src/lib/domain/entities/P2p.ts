import { Entity } from '@oney/ddd';
import { P2pProperties } from '../valueobjects/p2p/P2pProperties';

export class P2p extends Entity<P2pProperties> {
  public readonly props: P2pProperties;

  constructor(paymentProps: P2pProperties) {
    super(paymentProps.id);
    this.props = paymentProps;
  }
}
