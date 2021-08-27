import { QueryService, WriteService } from '@oney/common-core';

export interface DbServices {
  dbWriteService: WriteService;
  dbReadService: QueryService;
}
