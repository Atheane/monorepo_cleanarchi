import { Context } from '@azure/functions';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import debtCallBackHandler from '../../index';
import { Kernel } from '../bootstrap/Kernel';

jest.mock('@azure/service-bus', () => {
  return {
    ReceiveMode: {
      peekLock: 1,
      receiveAndDelete: 2,
    },
    ServiceBusClient: {
      createFromConnectionString: jest.fn().mockReturnValue({
        createTopicClient: jest.fn().mockReturnValue({
          createSender: jest.fn().mockReturnValue({
            send: jest.fn(),
          }),
        }),
      }),
    },
  };
});

describe('Test smoney debt call back', () => {
  it('should use the same kernel for two runs', async () => {
    const kernelSpy = jest.spyOn(Kernel.prototype, 'initDependencies');
    const context = {
      req: {
        body: {
          id: '96523',
          appUserId: 'client-112',
          date: '2020-12-10T10:27:45',
          debtAmount: 1000,
          remainingDebtAmount: 500,
          status: 0,
          reason: 'P2P',
        },
      },
      log: () => undefined,
      done: () => undefined,
    } as Context;

    await debtCallBackHandler(context, {});
    await debtCallBackHandler(context, {});

    expect(kernelSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle call back', async () => {
    const context = {
      req: {
        body: {
          id: '96523',
          appUserId: 'client-112',
          date: '2020-12-10T10:27:45',
          debtAmount: 1000,
          remainingDebtAmount: 500,
          status: 0,
          reason: 'P2P',
        },
      },
      log: () => undefined,
      done: () => undefined,
    } as Context;

    await debtCallBackHandler(context, {});

    expect(context.res.error).toBeUndefined();
    expect(context.res.status).toEqual(OK);
    expect(context.res.body).toEqual({
      id: '96523',
      appUserId: 'client-112',
      date: '2020-12-10T10:27:45',
      debtAmount: 1000,
      remainingDebtAmount: 500,
      status: 0,
      reason: 'P2P',
    });
  });

  it('should handle exception', async () => {
    const context = {
      req: null,
      log: () => undefined,
      done: () => undefined,
    } as Context;

    await debtCallBackHandler(context, {});

    expect(context.res.status).toEqual(INTERNAL_SERVER_ERROR);
  });
});
