export interface AccountTypes {
  total: number;
  accounttypes: AccountType[];
}

interface AccountType {
  id: number;
  name: string;
  is_invest: boolean;
  weboob_type_id: number;
  display_name_p: string;
  display_name: string;
  color?: string;
  product: string;
  id_parent?: number;
}
