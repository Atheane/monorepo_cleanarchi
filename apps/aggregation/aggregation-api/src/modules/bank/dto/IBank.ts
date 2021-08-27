import { IFieldOption } from '@oney/aggregation-core';

type IBankField = {
  label: string;
  name: string;
  type: string;
  validation?: string;
  options?: IFieldOption[];
};

export type IBankWithForm = {
  uid: string;
  logo?: string;
  name: string;
  form: IBankField[];
  code: string;
  featured: boolean;
};

export type IBank = {
  uid: string;
  logo?: string;
  name: string;
  code: string;
};
