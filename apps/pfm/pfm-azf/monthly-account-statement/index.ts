import 'reflect-metadata';
import { AzureFunction, Context } from '@azure/functions';
import { ProcessMonthlyStatements } from '@oney/pfm-core';
import * as mongoose from 'mongoose';
import { setupApp } from './src/config/Setup';

const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {
  try {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const kernelContainer = await setupApp();
    await kernelContainer.get(ProcessMonthlyStatements).execute({ date });
  } catch (e) {
    context.log(e);
  } finally {
    await mongoose.connection.close();
  }
};

export default timerTrigger;
