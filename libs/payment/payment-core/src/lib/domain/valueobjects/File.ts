import { FileExtensions } from '../types/FileExtensions';
import { IdTypes } from '../types/IdTypes';

export class File {
  type: IdTypes;

  extString: FileExtensions;

  file?: Buffer;

  constructor(file: File) {
    Object.assign(this, file);
  }
}
