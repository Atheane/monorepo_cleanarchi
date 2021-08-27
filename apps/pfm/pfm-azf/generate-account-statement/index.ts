import 'reflect-metadata';
import { AzureFunction, Context } from '@azure/functions';
import { ProcessStatements } from '@oney/pfm-core';
import * as mongoose from 'mongoose';
import { setupApp } from './src/config/Setup';

const serviceBusTrigger: AzureFunction = async function (context: Context): Promise<void> {
  const { userIds, date } = context.bindings.message;

  if (!userIds || !userIds.length) {
    context.log('userIds is required');
    return;
  }

  if (!date) {
    context.log('date is required');
    return;
  }
  try {
    const kernelContainer = await setupApp();
    await kernelContainer.get(ProcessStatements).execute({ date, userIds, regenerate: true });
  } catch (e) {
    context.log(e);
  } finally {
    await mongoose.connection.close();
  }
};

export default serviceBusTrigger;
