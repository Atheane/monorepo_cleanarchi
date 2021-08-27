export type Event = {
  date: Date;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  version: number;
};
