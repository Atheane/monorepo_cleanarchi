type FieldOption = {
  value: string;
  name?: string;
};

type BankField = {
  label: string;
  name: string;
  type: string;
  validation?: RegExp;
  options?: FieldOption[];
};

export type AggregationBank = {
  uid: string;
  logo?: string;
  name: string;
  form: BankField[];
  code: string;
  featured: boolean;
};
