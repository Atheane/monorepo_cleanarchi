import { Env, Local } from '@oney/env';

@Local()
export class EnvConfig {
  @Env('BLOB_STORAGE_CS')
  blobStorageCs: string;

  @Env('BLOB_STORAGE_CONTAINER_NAME')
  storageContainerName: string;
}

export const envConfiguration = new EnvConfig();
