export type BudgetInsightUserIdentityResponse = {
  owner?: BudgetInsightUserIdentity;
};

type BudgetInsightUserIdentity = {
  children?: string;
  email?: string;
  name?: string;
  birth_date?: string;
  lastname?: string;
  firstname?: string;
};
