export const globalOutUpdated = {
  metadata: {
    aggregate: 'BankAccount',
    aggregateId: 'tstUsr106',
  },
  props: {
    globalOut: {
      annualAllowance: 1200000,
      monthlyAllowance: 100000,
      weeklyAllowance: 100000,
    },
  },
};

export const balanceLimitUpdated = {
  metadata: {
    aggregate: 'BankAccount',
    aggregateId: 'tstUsr106',
  },
  props: {
    balanceLimit: 100000,
  },
};
