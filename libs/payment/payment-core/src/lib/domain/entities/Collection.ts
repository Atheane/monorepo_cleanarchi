import { Entity } from '@oney/ddd';

export interface CollectionProperties {
  orderId: string;
  paidAt: Date;
  amount: number;
}

export class Collection extends Entity<CollectionProperties> {
  readonly props: CollectionProperties;

  constructor(CollectionProps: CollectionProperties) {
    super(CollectionProps.orderId);
    this.props = { ...CollectionProps };
  }
}
