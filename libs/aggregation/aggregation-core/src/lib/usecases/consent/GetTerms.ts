import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import { FileStorageService, IAppConfiguration } from '../../domain';

export interface GetTermsCommands {
  versionNumber?: string;
}

@injectable()
export class GetTerms implements Usecase<GetTermsCommands, string> {
  constructor(
    @inject(AggregationIdentifier.fileStorageService) private readonly fileStorageService: FileStorageService,
    @inject(AggregationIdentifier.appConfiguration)
    private readonly appConfiguration: IAppConfiguration,
  ) {}

  async execute(request: GetTermsCommands): Promise<string> {
    const fileName = `aggregation_terms_${
      request.versionNumber || this.appConfiguration.blobStorageConfiguration.termsVersion
    }.json`;
    return await this.fileStorageService.getFile(fileName);
  }
}
