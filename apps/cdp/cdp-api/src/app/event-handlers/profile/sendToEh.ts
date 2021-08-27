import { AzureFunction, Context } from '@azure/functions';

export async function sendDomainEventToEh(outPayload: Object, ehName: string): Promise<void> {
  const toEh: AzureFunction = function (context: Context) {
    context.bindings.outputEventHubMessage = outPayload;
    context.bindings.name = ehName;
    context.log('Message');
    context.log(outPayload);
    context.done();
  };
}
