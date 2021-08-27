import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { IAppConfiguration } from '@oney/aggregation-core';
import { AggregationKernel } from '@oney/aggregation-adapters';

export class AppKernel extends AggregationKernel {
  constructor(private readonly envConfiguration: IAppConfiguration) {
    super(envConfiguration);
  }

  async initAppDependencies(inMemoryMode: boolean): Promise<AggregationKernel> {
    await this.initDependencies(inMemoryMode);
    this.bind(ExpressAuthenticationMiddleware).to(ExpressAuthenticationMiddleware);
    return this;
  }
}
