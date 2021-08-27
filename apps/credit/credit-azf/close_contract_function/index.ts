import { AzureFunction, Context } from '@azure/functions';
import * as mongoose from 'mongoose';
import 'reflect-metadata';
import { setupApp } from './src/config/Setup';
import { ClosePaidContracts } from '../core/src';

const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {
  try {
    const kernel = await setupApp();
    const unDeletedPaymentSchedules = await kernel.get(ClosePaidContracts).execute();
    if (unDeletedPaymentSchedules.length)
      context.log(
        'Mongo Error - the following payment schedules (and contracts) should have been closed. Retry is necessary',
        unDeletedPaymentSchedules,
      );
  } catch (e) {
    context.log(e);
  } finally {
    await mongoose.connection.close();
  }
};

export default timerTrigger;
