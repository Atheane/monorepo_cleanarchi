import { injectable } from 'inversify';
import { UserGateway } from '@oney/aggregation-core';
import { BIConnectionService } from '../partners/budgetinsights/BIConnectionService';

@injectable()
export class BIUserGateway implements UserGateway {
  constructor(private readonly biConnectionService: BIConnectionService) {}

  setCredentials(credential: string): void {
    this.biConnectionService.setCredentials(credential);
  }

  getNewCredentials(): Promise<string> {
    return this.biConnectionService.getNewCredentials();
  }

  async deleteOne(): Promise<void> {
    await this.biConnectionService.deleteUser();
  }
}
