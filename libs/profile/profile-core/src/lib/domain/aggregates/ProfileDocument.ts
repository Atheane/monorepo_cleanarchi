import { AggregateRoot } from '@oney/ddd';
import * as deepEqual from 'deep-equal';
import { DocumentType } from '../types/DocumentType';
import { ProfileDocumentPartner } from '../types/ProfileDocumentPartner';
import { DocumentSide } from '../types/DocumentSide';

export const FILE_EXTENSION = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'application/pdf': 'pdf',
};

export interface ProfileDocumentProps {
  uid: string;
  type: DocumentType;
  side?: DocumentSide;
  location?: string;
  partner: ProfileDocumentPartner;
}

export class ProfileDocument extends AggregateRoot<ProfileDocumentProps> {
  props: ProfileDocumentProps;

  constructor(props: ProfileDocumentProps) {
    super(props.uid);
    this.props = props;
  }

  createDocumentName(userId: string, mimetype: string, suffix: string) {
    const path = `${userId}/kyc`;
    const name = this.props.side ? `${this.props.type}-${this.props.side}` : `${this.props.type}`;
    return `${path}/${name}_${suffix}.${FILE_EXTENSION[mimetype]}`;
  }

  equals(profileDocument: ProfileDocument): boolean {
    return super.equals(profileDocument) && deepEqual(this, profileDocument);
  }
}
