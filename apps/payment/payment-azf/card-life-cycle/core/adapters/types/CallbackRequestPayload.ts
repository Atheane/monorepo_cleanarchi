export interface CallbackRequestPayload {
  id: number;
  reference: string;
  type: number;
  cardType: number;
  action: number;
  status: number;
  opposedReason: number;
}
