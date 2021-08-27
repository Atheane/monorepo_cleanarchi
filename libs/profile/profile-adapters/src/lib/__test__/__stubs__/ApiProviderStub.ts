import { ApiProvider } from '@oney/common-core';

export class ApiProviderStub implements ApiProvider<any> {
  api(): any {
    return {
      dataRecovery: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        get: (caseReference: string) => ({
          details: {
            elements: [
              {
                elementId: 'string;',
                lastUpdate: 'string',
                elementSubCategory: 'IRPP',
                data: {
                  documentType: 'IC',
                  referenceIncome: '11',
                  globalGrossIncome: '22',
                  establishmentDate: '2019-07-09',
                  personalSituation: '2',
                },
              },
            ],
          },
        }),
      },
    };
  }
}
