import { Dictionary } from '@oney/common-core';

export interface SensitiveAction {
  url: URL;
  request: {
    headers: Dictionary<string | string[]>;
    body: string;
  };
}
