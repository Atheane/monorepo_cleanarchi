import { AzureFunction, Context } from '@azure/functions';
import * as mongoose from 'mongoose';
import 'reflect-metadata';
import { setupApp } from './src/config/Setup';
import { ClosePaidContracts, ProcessPayments } from '../core/src';
import { Kernel } from '../adapters';

const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {
  let kernel: Kernel;
  try {
    kernel = await setupApp();
    await kernel.get(ProcessPayments).execute();
  } catch (e) {
    context.log(e);
  } finally {
    await kernel.get(ClosePaidContracts).execute();
    await mongoose.connection.close();
  }
};

export default timerTrigger;
