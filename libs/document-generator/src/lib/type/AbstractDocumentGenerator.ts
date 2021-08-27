import { Settings } from './Settings';

export abstract class AbstractDocumentGenerator {
  protected data: Buffer;

  get getData(): Buffer {
    return this.data;
  }

  abstract generate(payload: any, setting: Settings): Promise<AbstractDocumentGenerator>;
  abstract save(path: string, connectionString: string, containerName: string): Promise<Boolean>;
}
