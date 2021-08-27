export interface Message<T = any> {
  id: string;
  timestamp?: number;
  props: T;
  createdAt?: Date;

  [key: string]: any;
}
