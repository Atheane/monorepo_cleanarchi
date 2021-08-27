import 'reflect-metadata';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, UNAUTHORIZED } from 'http-status';
import { AzfKernel } from './src/config/di/AzfKernel';
import { IAzfConfiguration } from './src/config/envs';
import { setUp } from './src/config/setUp';
import { Bank } from './src/core/domain/types';
import { BankConnection } from './src/core/domain/entities';

let kernel: AzfKernel;

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    console.log('SHOULD BE LAUNCHED ONCE');
    kernel = await setUp(false);
  })();
}

const authorizeWebhook = async (req: HttpRequest, azfConfiguration: IAzfConfiguration): Promise<boolean> => {
  const { code } = req.query;
  const {
    budgetInsightConfiguration: { tokenUrl },
  } = azfConfiguration;
  if (code !== tokenUrl) {
    return false;
  }
  return true;
};

const accountSyncWebhookHandler: AzureFunction = async (
  context: Context,
  req: HttpRequest,
  knl?: AzfKernel,
) => {
  if (knl) kernel = knl;

  if (!kernel) {
    context.log('Kernel is not set up');
    return (context.res = {
      status: INTERNAL_SERVER_ERROR,
      error: 'Kernel is not set up',
    });
  }

  try {
    await kernel.initSubscribers();
    const {
      headers: { authorization },
      body,
    } = req;
    context.log('req.headers[content-length]', req.headers['content-length']);
    const userTokenBudgetInsight = authorization.replace(/Bearer\s+/, '');
    const azfConfig = await kernel.getDependencies().azfConfiguration;
    const isAuthorized = await authorizeWebhook(req, azfConfig);
    if (!isAuthorized) {
      context.res = {
        status: UNAUTHORIZED,
      };
    } else if (body.id) {
      context.log(`Budget Insight ACCOUNT_SYNC ${body.id}`);
      const { id } = body;

      let bankConnection: BankConnection;
      try {
        bankConnection = await kernel
          .getDependencies()
          .getBankConnectionByAccountId.execute({ bankAccountId: id, userToken: userTokenBudgetInsight });
      } catch (e) {
        context.log(`Could not get bankConnection for account with id ${id}`, e);
      }

      let userId: string;
      const bank = {} as Bank;

      if (bankConnection) {
        userId = bankConnection.userId;
        try {
          bank.id = bankConnection.bankId;
          bank.label = await kernel.getDependencies().getBankByName.execute({
            bankId: bank.id,
            userToken: userTokenBudgetInsight,
          });
        } catch (e) {
          context.log(`Could not get bank name for id ${bank.id}`, e);
        }
      }

      // CosmoDB has a 2MO limit per document: we split ACCOUNT_SYNC event in as many transaction events of the same format
      try {
        await kernel
          .getDependencies()
          .saveEvents.execute({ body, userId, bank, refId: bankConnection?.refId });
        context.log(`Events for account ${id} is saved`);
      } catch (e) {
        /* istanbul ignore next we want to log error */
        context.log(`Error for Events of account ${id}, Detailed error: ${e}`);
      }

      context.res = {
        status: OK,
        message: `Account ${body.id} synchronization event saved and dispatched`,
      };
    } else {
      context.res = {
        status: BAD_REQUEST,
        error: 'Payload should have an id property to identify account_id',
      };
    }
  } catch (e) {
    context.log(`Error ${e}`);
    context.res = {
      status: INTERNAL_SERVER_ERROR,
      error: e,
    };
  }
  context.done();
};

export default accountSyncWebhookHandler;
