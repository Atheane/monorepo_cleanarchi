import 'reflect-metadata';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  const responseMessage = {
    message:
      'Les serveurs sont en cours de maintenance, le service reprendra à 17h, veuillez nous excuser pour la gène occasionnée.',

    code: '01',
  };

  context.res = {
    status: 503 /* Defaults to 200 */,
    body: responseMessage,
  };
};

export default httpTrigger;
