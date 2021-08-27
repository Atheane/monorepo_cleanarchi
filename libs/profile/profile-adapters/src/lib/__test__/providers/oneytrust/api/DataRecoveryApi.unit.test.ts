import * as nock from 'nock';
import { DataRecoveryApi } from '../../../../adapters/providers/oneytrust/api/DataRecoveryApi';
import { OneyTrustCheckSumGenerator } from '../../../../adapters/providers/oneytrust/OneyTrustCheckSumGenerator';

describe('DataRecoveryApi unit test', () => {
  const caseReference = 'SP_2021212_beGe_flCm_frDNGY01Y';
  const entityReference = 1;
  const login = 'fake-login';
  const oneyTrustFolderApiBaseUrl = 'http://localhost:8080';

  it('should return OT data recovery when post request with login', async () => {
    //Arrange
    nock(oneyTrustFolderApiBaseUrl)
      .post(`/tulipe/v2/${entityReference}/cases/${caseReference}/dataRecovery`, { login })
      .reply(200, {
        details: {
          elements: [
            {
              elementId: '119526',
              lastUpdate: '2021-03-24 14:07:25',
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
      });
    const api = new DataRecoveryApi(
      new OneyTrustCheckSumGenerator(''),
      entityReference,
      login,
      oneyTrustFolderApiBaseUrl,
    );

    //Act
    const result = await api.get({ caseReference });

    //Assert
    expect(result).toEqual({
      details: {
        elements: [
          {
            elementId: '119526',
            lastUpdate: '2021-03-24 14:07:25',
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
    });
  });
});
