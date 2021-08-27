import 'reflect-metadata';
import { EventProducerDispatcher } from '@oney/messages-core';
import { BankAccount, Debt, DebtStatus, SyncAccountDebts } from '@oney/payment-core';
import { Logger } from '@oney/logger-core';
import { BankAccountRepoStub } from './stubs/BankAccountRepoStub';
import { DebtGatewayStub } from './stubs/DebtGatewayStub';
import { EventProducerDispatcherStub } from './stubs/EventDispatcherStub';

describe('test update user debt use case', () => {
  const userId = 'kTDhDRrHv';

  let eventDispatcherStub: EventProducerDispatcher;
  beforeEach(() => {
    eventDispatcherStub = new EventProducerDispatcherStub();
  });

  it('should add a debt to the bank account when it is a new debt', async () => {
    const bankAccountWithNoDebts = getBankAccount();
    const smoDebt = [getDebt()];
    const debtGatewayStub = new DebtGatewayStub(smoDebt);
    const bankAccountRepoStub = new BankAccountRepoStub([bankAccountWithNoDebts]);
    const logger: Logger = {
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };
    const syncAccountDebts = new SyncAccountDebts(
      debtGatewayStub,
      bankAccountRepoStub,
      bankAccountRepoStub,
      eventDispatcherStub,
      logger,
    );

    const result = await syncAccountDebts.execute(userId);

    expect(result.props.debts).toEqual([getDebt()]);
  });

  it('should add a debt to the existing account debts when it is a new debt', async () => {
    const bankAccountWithDebts = getBankAccount([getDebt()]);
    const smoDebt = [getDebt('debt-222')];
    const debtGatewayStub = new DebtGatewayStub(smoDebt);
    const bankAccountRepoStub = new BankAccountRepoStub([bankAccountWithDebts]);
    const logger: Logger = {
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };
    const syncAccountDebts = new SyncAccountDebts(
      debtGatewayStub,
      bankAccountRepoStub,
      bankAccountRepoStub,
      eventDispatcherStub,
      logger,
    );

    const result = await syncAccountDebts.execute(userId);

    expect(result.props.debts).toEqual([getDebt(), getDebt('debt-222')]);
  });

  it('should add the Debt Created domain event when a debt is created', async () => {
    const bankAccountWithNoDebts = getBankAccount();
    const debtGatewayStub = new DebtGatewayStub([getDebt()]);
    const bankAccountRepoStub = new BankAccountRepoStub([bankAccountWithNoDebts]);
    const logger: Logger = {
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };
    const syncAccountDebts = new SyncAccountDebts(
      debtGatewayStub,
      bankAccountRepoStub,
      bankAccountRepoStub,
      eventDispatcherStub,
      logger,
    );

    const result = await syncAccountDebts.execute(userId);

    expect(result.events.length).toEqual(1);
    // FIXME: after fixing mapping eventName -> metadata.eventName
    // expect(result.events[0].metadata.eventName).toEqual('DEBT_CREATED');
  });

  it('should not update the debt when the amounts did not change', async () => {
    const bankAccountWithDebts = getBankAccount([getDebt('debt-111', 200)]);
    const debtGatewayStub = new DebtGatewayStub([getDebt('debt-111', 200)]);
    const bankAccountRepoStub = new BankAccountRepoStub([bankAccountWithDebts]);
    const logger: Logger = {
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };
    const syncAccountDebts = new SyncAccountDebts(
      debtGatewayStub,
      bankAccountRepoStub,
      bankAccountRepoStub,
      eventDispatcherStub,
      logger,
    );

    const result = await syncAccountDebts.execute(userId);

    expect(result.events.length).toEqual(0);
  });
});

const getDebt = (id?: string, debtAmount?: number) =>
  new Debt({
    id: id || 'debt-111',
    userId: 'kTDhDRrHv',
    date: new Date('2020-11-13T10:27:45'),
    debtAmount: debtAmount || 200,
    remainingDebtAmount: 200,
    status: DebtStatus.PENDING,
    reason: 'Cardoperation',
    collections: [],
  });

const getBankAccount = (debts?: Debt[]) => {
  return new BankAccount({ uid: 'kTDhDRrHv', debts: debts || [] });
};
