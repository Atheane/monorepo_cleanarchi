export const limitsInitializedEvent = {
  id: 'uuid_v4_example',
  metadata: {
    aggregate: 'BankAccount',
    aggregateId: 'tstUsr106',
  },
  props: {
    limitInformation: {
      balanceLimit: 1000,
      globalIn: {
        annualAllowance: 45000,
        monthlyAllowance: 3000,
        weeklyAllowance: 3000,
      },
      globalOut: {
        annualAllowance: 45000,
        monthlyAllowance: 1000,
        weeklyAllowance: 1000,
      },
      technicalLimit: 1000,
    },
    uid: 'tstUsr106',
  },
};
