export interface FileStorageService {
  getFile(file: string): Promise<string>;
}
