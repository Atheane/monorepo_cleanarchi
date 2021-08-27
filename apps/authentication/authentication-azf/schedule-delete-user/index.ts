import 'reflect-metadata';
import * as mongoose from 'mongoose';
import { AzureFunction, Context } from '@azure/functions';
import { ConfigService } from '@oney/env';
import { UserProvider } from './src/core/domain/types/UserProvider';
import { AzfKernel } from './src/config/di/AzfKernel';
import { IAzfConfiguration, getAppConfiguration } from './src/config/envs';
import { initMongooseConnection } from './src/config/initMongooseConnection';

const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {
  try {
    await new ConfigService({
      localUri: null,
      keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
    }).loadEnv();
    const config: IAzfConfiguration = getAppConfiguration();

    const { cosmosDbConnectionString } = config.cosmosDbConfiguration;
    const dbConnection = await initMongooseConnection(cosmosDbConnectionString);

    const kernel = new AzfKernel(config).initDependencies(dbConnection);

    const deletedUsers = await kernel
      .getDependencies()
      .deleteUsers.execute({ predicate: { metadata: { provider: UserProvider.PP_DE_REVE } } });

    const userIds = deletedUsers.map(user => user.props.uid);
    context.log(`SUCCESS deleteUsers ${UserProvider.PP_DE_REVE}, users' ids: ${userIds.join(', ')}`);
  } catch (e) {
    context.log(e);
  } finally {
    await mongoose.connection.close();
  }
};

export default timerTrigger;
