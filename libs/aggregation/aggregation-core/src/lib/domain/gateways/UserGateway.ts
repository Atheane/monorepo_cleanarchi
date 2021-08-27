export interface UserGateway {
  setCredentials(credential: string): void;
  getNewCredentials(): Promise<string>;
  deleteOne(): Promise<void>;
}
