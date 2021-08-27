import { BankConnectionRepository, EventRepository } from '../../core/domain/repositories';
import { GetBankConnectionByAccountId, GetBankByName, SaveEvents } from '../../core/usecases';
import { IAzfConfiguration } from '../envs/IAzfConfiguration';

export interface DomainDependencies {
  azfConfiguration: IAzfConfiguration;
  getBankConnectionByAccountId: GetBankConnectionByAccountId;
  getBankByName: GetBankByName;
  saveEvents: SaveEvents;
  bankConnectionRepository: BankConnectionRepository;
  eventRepository: EventRepository;
}
