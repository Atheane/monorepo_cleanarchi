import { AzureFunction, Context } from '@azure/functions';

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {
  context.log('HTTP trigger health check');
  context.res = {
    body: 'up',
  };
};

export default httpTrigger;
