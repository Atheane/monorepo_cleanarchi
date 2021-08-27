/* eslint-disable @typescript-eslint/no-explicit-any */
export type Currency = {
  id: string;
  symbol: string;
  prefix: boolean;
  crypto: boolean;
  precision: number;
  marketcap?: any;
  datetime?: Date;
  name: string;
};
