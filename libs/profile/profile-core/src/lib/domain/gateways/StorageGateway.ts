export interface StorageGateway {
  storeDocument(name: string, file: any): Promise<string>;
  getDocument(fileName: string): Promise<Buffer>;
}
