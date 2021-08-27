export const userWithRevenueData = {
  id: 'K-oZktdWv',
  events: [],
  version: 1,
  props: {
    userId: 'K-oZktdWv',
    consent: true,
    consentDate: new Date('2020-05-21T00:00:00.000Z'),
    credential:
      'hW93vRiX/5AhDqfxU0w6aR0htbDDMOzm_IyYcNgG2H1c_jme41W7c9b6RTnQenMfB_eu9HUgGqbJUDJ5MshGRREoRdRtPErMIG272S9OXkzlSIQX1PB3mT_rdOWZ0zmC',
    creditDecisioningUserId: '6078b7250001ad278b00dc51',
    creditProfile: {
      creditScoring: { rate: 998, indicators: { savings: 1, lifestyle: 2, cash: 2 } },
      creditInsights: {
        budget: {
          cashflows: [
            {
              references: [
                '6078b7270001ad584200dc54',
                '6078b7270001ad9cdf00dc62',
                '6078b7270001ad101400dc6d',
                '6078b7270001ad5ed600dc74',
                '6078b7270001adda7e00dc76',
                '6078b7270001ad0f8400dc78',
                '6078b7270001ad124800dc5e',
              ],
              calendar: [
                { month: '2021-01', amount: -218.75 },
                { month: '2021-02', amount: -84.75 },
                { month: '2021-03', amount: -42.25 },
                { month: '2021-04', amount: -78.35 },
              ],
              type: 'ATM',
              labelRoot: '',
              label: '',
              dueDay: 12,
              nbTransactions: 7,
              totalAmount: -424.1,
              monthlyAmount: -106.02,
              meanAmount: -84.82,
            },
            {
              references: [
                '6078b7270001adb12400dc56',
                '6078b7270001ad036500dc7b',
                '6078b7270001ad788c00dc58',
                '6078b7270001ad2bd100dc6f',
                '6078b7270001adc59e00dc71',
                '6078b7270001ad0dee00dc59',
                '6078b7270001ad768f00dc65',
                '6078b7270001ad8d0c00dc72',
                '6078b7270001adc55c00dc5a',
                '6078b7270001adb27e00dc68',
                '6078b7270001ad252400dc69',
                '6078b7270001ad363200dc75',
                '6078b7270001ad1da000dc5c',
                '6078b7270001ad0e6000dc60',
                '6078b7270001ad02a000dc79',
                '6078b7270001ad4b0600dc5d',
                '6078b7270001ad536700dc6c',
                '6078b7270001ada27000dc6e',
                '6078b7270001ad1cfd00dc7a',
                '6078b7270001ad547d00dc7c',
                '6078b7270001ad273f00dc66',
                '6078b7270001ad208300dc70',
                '6078b7270001ad788200dc73',
              ],
              calendar: [
                { month: '2021-01', amount: -815.99 },
                { month: '2021-02', amount: -1094.0000000000002 },
                { month: '2021-03', amount: -806.42 },
                { month: '2021-04', amount: -67.9 },
              ],
              type: 'CARD_PAYMENT',
              labelRoot: '',
              label: '',
              dueDay: 5,
              nbTransactions: 23,
              totalAmount: -2784.31,
              monthlyAmount: -696.08,
              meanAmount: -556.86,
            },
            {
              references: [
                '6078b7270001ad5ccf00dc53',
                '6078b7270001ad827000dc55',
                '6078b7270001ad334900dc5b',
                '6078b7270001ad7a7400dc61',
                '6078b7270001adae4400dc63',
                '6078b7270001ad5d0b00dc64',
                '6078b7270001ad677e00dc67',
              ],
              calendar: [
                { month: '2021-02', amount: -223.08 },
                { month: '2021-03', amount: -621.39 },
                { month: '2021-04', amount: -584.4300000000001 },
              ],
              type: 'CHECK',
              labelRoot: '',
              label: '',
              dueDay: 4,
              nbTransactions: 7,
              totalAmount: -1428.9,
              monthlyAmount: -476.3,
              meanAmount: -285.78,
            },
            {
              references: [
                '6078b7270001ad1bcf00dc57',
                '6078b7270001adabbd00dc5f',
                '6078b7270001ad17df00dc6a',
              ],
              calendar: [
                { month: '2021-01', amount: 393.31 },
                { month: '2021-02', amount: 1515 },
                { month: '2021-03', amount: 740.59 },
              ],
              type: 'WAGE',
              labelRoot: 'SALAIRE',
              label: 'SALAIRE - 1',
              dueDay: 12,
              nbTransactions: 3,
              totalAmount: 2648.9,
              monthlyAmount: 882.97,
              meanAmount: 529.78,
            },
            {
              references: ['6078b7270001adbb3e00dc6b', '6078b7270001ad673f00dc77'],
              calendar: [
                { month: '2020-12', amount: 252.97 },
                { month: '2021-01', amount: 521.44 },
              ],
              type: 'WAGE',
              labelRoot: 'SALAIRE',
              label: 'SALAIRE - 2',
              dueDay: 16,
              nbTransactions: 2,
              totalAmount: 774.41,
              monthlyAmount: 387.21,
              meanAmount: 154.88,
            },
          ],
          indicators: {
            debtToIncome: 0,
            residualIncome: 1270.18,
            allowancesRatio: 0,
          },
        },
        dataQuality: {
          calendar: [
            { month: '2021-01', nbDays: 31 },
            { month: '2021-02', nbDays: 28 },
            { month: '2021-03', nbDays: 31 },
            { month: '2021-04', nbDays: 14 },
          ],
          lastTransactionGap: 1,
          historicalDepth: 102,
          transactionsFrequency: 13,
          numberOfCheckings: 1,
          numberOfSavings: 0,
          numberOfLoans: 0,
          numberOfCreditCards: 0,
        },
        bureau: {
          credit: {
            locDrawDowns: { count: 0, nbLenders: 0, amount: 0 },
            loans: { count: 0, nbLenders: 0, amount: 0 },
          },
          events: {
            thirdPartyHolderNotice: { nbTransactions: 0, totalAmount: 0, references: [] },
            wageAdvances: { nbTransactions: 0, totalAmount: 0, references: [] },
            bankAccountSeizure: { nbTransactions: 0, totalAmount: 0, references: [] },
          },
          gambling: { nbTransactions: 0, totalAmount: 0, references: [] },
          frequentTransactions: [
            {
              references: [
                '6078b7270001ad5ccf00dc53',
                '6078b7270001ad827000dc55',
                '6078b7270001ad334900dc5b',
                '6078b7270001ad7a7400dc61',
                '6078b7270001adae4400dc63',
                '6078b7270001ad5d0b00dc64',
                '6078b7270001ad677e00dc67',
              ],
              label: 'CHEQUE',
              nbTransactions: 7,
              totalAmount: -1428.9,
            },
            {
              references: [
                '6078b7270001ad584200dc54',
                '6078b7270001ad9cdf00dc62',
                '6078b7270001ad101400dc6d',
                '6078b7270001ad5ed600dc74',
                '6078b7270001adda7e00dc76',
                '6078b7270001ad0f8400dc78',
              ],
              label: 'RETRAIT DAB BANQUE POSTALE',
              nbTransactions: 6,
              totalAmount: -395.74,
            },
            {
              references: [
                '6078b7270001ad4b0600dc5d',
                '6078b7270001ad536700dc6c',
                '6078b7270001ada27000dc6e',
                '6078b7270001ad1cfd00dc7a',
                '6078b7270001ad547d00dc7c',
              ],
              label: 'CB DEBIT GOOGLE BUDGEA',
              nbTransactions: 5,
              totalAmount: -129.04,
            },
            {
              references: [
                '6078b7270001ad1bcf00dc57',
                '6078b7270001adabbd00dc5f',
                '6078b7270001ad17df00dc6a',
                '6078b7270001adbb3e00dc6b',
                '6078b7270001ad673f00dc77',
              ],
              label: 'SALAIRE',
              nbTransactions: 5,
              totalAmount: 3423.31,
            },
            {
              references: [
                '6078b7270001adc55c00dc5a',
                '6078b7270001adb27e00dc68',
                '6078b7270001ad252400dc69',
                '6078b7270001ad363200dc75',
              ],
              label: 'CB DEBIT TABAC REY PARIS',
              nbTransactions: 4,
              totalAmount: -161,
            },
            {
              references: [
                '6078b7270001ad788c00dc58',
                '6078b7270001ad2bd100dc6f',
                '6078b7270001adc59e00dc71',
              ],
              label: 'CB DEBIT DOCTEUR',
              nbTransactions: 3,
              totalAmount: -135.03,
            },
            {
              references: [
                '6078b7270001ad0dee00dc59',
                '6078b7270001ad768f00dc65',
                '6078b7270001ad8d0c00dc72',
              ],
              label: 'DEBIT MENSUEL CARTE',
              nbTransactions: 3,
              totalAmount: -1973,
            },
            {
              references: [
                '6078b7270001ad1da000dc5c',
                '6078b7270001ad0e6000dc60',
                '6078b7270001ad02a000dc79',
              ],
              label: 'CB DEBIT MCDO',
              nbTransactions: 3,
              totalAmount: -87.34,
            },
            {
              references: [
                '6078b7270001ad273f00dc66',
                '6078b7270001ad208300dc70',
                '6078b7270001ad788200dc73',
              ],
              label: 'CB DEBIT FRANPRIX PARIS',
              nbTransactions: 3,
              totalAmount: -231.06,
            },
            {
              references: ['6078b7270001adb12400dc56', '6078b7270001ad036500dc7b'],
              label: 'CB DEBIT THE BOOTLAGERS PARIS',
              nbTransactions: 2,
              totalAmount: -67.84,
            },
          ],
          incidents: {
            paymentRejections: { nbTransactions: 0, totalAmount: 0, references: [] },
            checkRejections: { nbTransactions: 0, totalAmount: 0, references: [] },
            fees: { nbTransactions: 0, totalAmount: 0, references: [] },
          },
          overdraft: {
            max: 0,
            hard: 0,
            total: 0,
            fees: { nbTransactions: 0, totalAmount: 0, references: [] },
          },
          payments: [
            {
              type: 'CHECK',
              nbOfTransactions: undefined,
              references: [
                '6078b7270001ad5ccf00dc53',
                '6078b7270001ad827000dc55',
                '6078b7270001ad334900dc5b',
                '6078b7270001ad7a7400dc61',
                '6078b7270001adae4400dc63',
                '6078b7270001ad5d0b00dc64',
                '6078b7270001ad677e00dc67',
              ],
              totalAmount: -1428.9,
            },
            {
              type: 'ATM',
              nbOfTransactions: undefined,
              references: [
                '6078b7270001ad584200dc54',
                '6078b7270001ad9cdf00dc62',
                '6078b7270001ad101400dc6d',
                '6078b7270001ad5ed600dc74',
                '6078b7270001adda7e00dc76',
                '6078b7270001ad0f8400dc78',
                '6078b7270001ad124800dc5e',
              ],
              totalAmount: -424.1,
            },
            {
              type: 'CARD_PAYMENT',
              nbOfTransactions: undefined,
              references: [
                '6078b7270001adb12400dc56',
                '6078b7270001ad036500dc7b',
                '6078b7270001ad788c00dc58',
                '6078b7270001ad2bd100dc6f',
                '6078b7270001adc59e00dc71',
                '6078b7270001ad0dee00dc59',
                '6078b7270001ad768f00dc65',
                '6078b7270001ad8d0c00dc72',
                '6078b7270001adc55c00dc5a',
                '6078b7270001adb27e00dc68',
                '6078b7270001ad252400dc69',
                '6078b7270001ad363200dc75',
                '6078b7270001ad1da000dc5c',
                '6078b7270001ad0e6000dc60',
                '6078b7270001ad02a000dc79',
                '6078b7270001ad4b0600dc5d',
                '6078b7270001ad536700dc6c',
                '6078b7270001ada27000dc6e',
                '6078b7270001ad1cfd00dc7a',
                '6078b7270001ad547d00dc7c',
                '6078b7270001ad273f00dc66',
                '6078b7270001ad208300dc70',
                '6078b7270001ad788200dc73',
              ],
              totalAmount: -2784.31,
            },
            {
              type: 'INCOMING_TRANSFER',
              nbOfTransactions: undefined,
              references: [
                '6078b7270001ad1bcf00dc57',
                '6078b7270001adabbd00dc5f',
                '6078b7270001ad17df00dc6a',
                '6078b7270001adbb3e00dc6b',
                '6078b7270001ad673f00dc77',
              ],
              totalAmount: 3423.31,
            },
          ],
        },
      },
    },
  },
};
