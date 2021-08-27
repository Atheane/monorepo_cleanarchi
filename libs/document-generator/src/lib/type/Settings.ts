import { Body } from './Body';
import { Footer } from './Footer';
import { DocumentOption } from './DocumentOption';

export type Settings = {
  body: Body;
  footer?: Footer;
  option?: DocumentOption;
};
