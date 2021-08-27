import { Data } from './Data';

export interface Element {
  elementId: string;
  lastUpdate: string;
  elementSubCategory: string;
  data: Data;
}
