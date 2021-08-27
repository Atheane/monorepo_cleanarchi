import { AzureFunction, Context } from '@azure/functions';
import { ConfigService } from '@oney/envs';
import { validate } from 'class-validator';
import { ACCEPTED, INTERNAL_SERVER_ERROR } from 'http-status';
import { connection } from 'mongoose';
import * as path from 'path';
import { envConfiguration, keyVaultConfiguration } from './config/EnvConfiguration';
import { ScoringKernel } from './config/ScoringKernel';
import { OtCallbackCommand } from './src/commands/OtCallbackCommand';
import { CommandError } from './src/commands/errors/CommandError';
import { ProcessScoringCallback } from './src/usecases/ProcessScoringCallback';
import InvalidBody = CommandError.InvalidBody;

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {
  const container = await new ScoringKernel(envConfiguration, keyVaultConfiguration);

  try {
    const { body, headers } = context.req;
    context.log('Received OT callback body: ', body);
    context.log('Received OT callback headers: ', headers);

    context.log('Load configuration');
    await loadAppConfig();

    context.log('Init dependencies');
    await container.initDependencies();

    context.log('Validating callback body');
    const callbackRequest = OtCallbackCommand.setProperties(body);
    const commandValidationError = await validate(callbackRequest);
    if (commandValidationError.length > 0) {
      throw new InvalidBody('Invalid request body', commandValidationError);
    }

    context.log('Processing OT Scoring callback');
    const scoringCallbackProcessor = container.get(ProcessScoringCallback);
    await scoringCallbackProcessor.execute(callbackRequest);

    context.res = {
      status: ACCEPTED,
    };
    context.done();
  } catch (e) {
    console.log(e);
    context.log('Error happened while processing the callback:', e);
    context.res = {
      status: INTERNAL_SERVER_ERROR,
      error: e.message,
    };
    context.done(e);
  } finally {
    await connection.close();
  }
};

async function loadAppConfig() {
  const envPath = path.resolve(__dirname + '/local.env');
  /* istanbul ignore next because we don't want to test in production mode */
  await new ConfigService({
    localUri: process.env.NODE_ENV === 'production' ? null : envPath,
    keyvaultUri: process.env.KEYVAULT_URI,
  }).loadEnv();
}

export default httpTrigger;
