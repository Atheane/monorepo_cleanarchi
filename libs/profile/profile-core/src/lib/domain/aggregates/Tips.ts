import { AggregateRoot } from '@oney/ddd';
import { TipsServiceProviders } from '../types/TipsServiceProviders';
import { TemplateName } from '../types/TemplateName';
import { TipsDetails } from '../valuesObjects/TipsDetails';

export interface TipsProperties {
  uid: string;
  provider: TipsServiceProviders;
  templateName: TemplateName;
  title: string;
  subtitle: string;
  redirectLink?: string;
  actionButtonText?: string;
  previewImg?: string;
  details?: TipsDetails;
}

export class Tips extends AggregateRoot<TipsProperties> {
  props: TipsProperties;
  constructor(props: TipsProperties) {
    super(props.uid);
    this.props = props;
  }
}
