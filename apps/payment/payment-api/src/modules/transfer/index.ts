import { Container } from 'inversify';
import { TransferController } from './controllers/TransferController';
import { TransferMapper } from './mapper/TransferMapper';

export function buildTransferModule(container: Container) {
  container.bind(TransferController).to(TransferController);
  container.bind(TransferMapper).to(TransferMapper);
}
