import 'reflect-metadata';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { setUp } from './utils/setup';
import { receivedCardLifecycleCallbackSchema } from './validation';

/**
 * Manage the kernel as a singleton to prevent a new instantiation at each trigger of the AZF.
 * In fact, the AZF context is shared between all the AZF executions, it's better for performances
 * to manage the Kernel as a singleton to prevent the AZF from executing a new database connection
 * at each execution.
 */
let kernel = null;

/* eslint-disable-next-line consistent-return */
const cardLifecycleHandlerTrigger: AzureFunction = async (context: Context, req: HttpRequest) => {
  try {
    const { body, headers } = req;
    context.log('Received callback body: ', body);
    context.log('Received callback headers: ', headers);

    if (!kernel) {
      kernel = await setUp(context);
    }

    if (!kernel) {
      return (context.res = {
        status: INTERNAL_SERVER_ERROR,
        error: 'Failed to setup kernel',
      });
    }

    const validationResult = receivedCardLifecycleCallbackSchema.validate(body);
    context.log('validationResult : ', validationResult);

    if (validationResult.error) {
      context.log('Validation error:', validationResult.error);
      context.res = {
        status: BAD_REQUEST,
        error: validationResult.error.details,
      };
      return null;
    }

    await kernel.getDependencies().processCardLifecycleCallback.execute(body);
    context.res = {
      status: OK,
    };
  } catch (err) {
    context.log('Error happened while processing the callback:', err);
    context.res = {
      status: INTERNAL_SERVER_ERROR,
      error: err.message,
    };
  }
};

export default cardLifecycleHandlerTrigger;
