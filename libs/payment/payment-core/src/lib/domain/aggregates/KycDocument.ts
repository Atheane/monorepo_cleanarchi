import { AggregateRoot } from '@oney/ddd';
import { KycDocumentStatus } from '../types/KycDocumentStatus';
import { File } from '../valueobjects/File';

export interface KycDocumentProperties {
  uid: string;

  files: File[];

  status?: KycDocumentStatus;
}

export class KycDocument extends AggregateRoot<KycDocumentProperties> {
  props: KycDocumentProperties;

  constructor(kycDocumentProps: KycDocumentProperties) {
    super(kycDocumentProps.uid);
    this.props = { ...kycDocumentProps };
  }
}
