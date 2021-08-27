import { ServiceBusClient } from '@azure/service-bus';

export function getBusClient(azureBusEnpoint: string): ServiceBusClient {
  return ServiceBusClient.createFromConnectionString(azureBusEnpoint);
}
