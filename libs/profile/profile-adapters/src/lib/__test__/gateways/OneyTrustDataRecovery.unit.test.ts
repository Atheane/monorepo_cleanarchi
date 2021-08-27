import { OneyTrustDataRecoveryGateway } from '../../adapters/gateways/OneyTrustDataRecoveryGateway';
import { ApiProviderStub } from '../__stubs__/ApiProviderStub';

describe('OneyTrustDataRecoveryGateway unit test', () => {
  it('should ', async () => {
    const caseReference = 'SP_2021212_beGe_flCm_frDNGY01Y';

    const api = new OneyTrustDataRecoveryGateway(new ApiProviderStub());
    const result = await api.get({ caseReference });

    expect(result).toEqual({
      establishmentDate: new Date('2019-07-09'),
      globalGrossIncome: '22',
      personalSituationCode: '2',
    });
  });
});
