export interface FileStorage {
  getFile(name: string): Promise<Buffer>;
}
