import { ApiProvider } from '@oney/common-core';
import { injectable } from 'inversify';
import { DataRecoveryCommand, FiscalData, ScoringDataRecoveryGateway } from '@oney/profile-core';
import { OneytrustApis } from '../providers/oneytrust/OneytrustApiProvider';

@injectable()
export class OneyTrustDataRecoveryGateway implements ScoringDataRecoveryGateway {
  constructor(private readonly _apiProvider: ApiProvider<OneytrustApis>) {}

  async get(cmd: DataRecoveryCommand): Promise<FiscalData> {
    const result = await this._apiProvider.api().dataRecovery.get({ caseReference: cmd.caseReference });

    const taxNoticeFiscalReference = result.details.elements.find(
      element => element.elementSubCategory === 'IRPP',
    );
    return new FiscalData({
      globalGrossIncome: taxNoticeFiscalReference.data.globalGrossIncome,
      personalSituationCode: taxNoticeFiscalReference.data.personalSituation,
      establishmentDate: new Date(taxNoticeFiscalReference.data.establishmentDate),
    });
  }
}
