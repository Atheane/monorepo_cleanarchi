import 'reflect-metadata';
import { AzureFunction, Context } from '@azure/functions';
import { BatchUpdateTechnicalLimit } from '@oney/payment-core';
import * as mongoose from 'mongoose';
import { setupApp } from './src/config/Setup';

const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {
  try {
    const kernel = await setupApp();
    await kernel.get(BatchUpdateTechnicalLimit).execute();
  } catch (e) {
    context.log(e);
  } finally {
    await mongoose.connection.close();
  }
};

export default timerTrigger;
