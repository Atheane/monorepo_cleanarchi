import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { GetFiscalCountriesList, GetProfessionalActivitiesList } from '@oney/profile-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Get, JsonController, Res, UseBefore } from 'routing-controllers';
import { GetKycDocuments } from '@oney/profile-core';

@JsonController('/resources')
@UseBefore(ExpressAuthenticationMiddleware)
@injectable()
export class ResourcesController {
  constructor(
    private readonly _getFiscalCountriesList: GetFiscalCountriesList,
    private readonly _getProfessionalActivitiesList: GetProfessionalActivitiesList,
    private readonly _getKycDocuments: GetKycDocuments,
  ) {}

  @Get('/onboarding/step/fiscalstatus/countrieslist')
  async getFicalCountriesList(@Res() res: Response) {
    const fiscalCountriesList = await this._getFiscalCountriesList.execute();
    return res.status(httpStatus.OK).send(fiscalCountriesList);
  }

  @Get('/onboarding/step/fiscalstatus/professionalactivitieslist')
  async getProfessionalActivitiesList(@Res() res: Response) {
    const professionalActivitiesList = await this._getProfessionalActivitiesList.execute();
    return res.status(httpStatus.OK).send(professionalActivitiesList);
  }

  @Get('/kyc-document')
  async getKycDocuments(@Res() res: Response) {
    const kycDocuments = await this._getKycDocuments.execute();
    return res.status(httpStatus.OK).send(kycDocuments);
  }
}
