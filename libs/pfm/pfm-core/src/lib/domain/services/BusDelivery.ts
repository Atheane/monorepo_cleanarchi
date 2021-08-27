export interface BusDelivery {
  send<T>(topic: string, message: T): Promise<void>;
}
