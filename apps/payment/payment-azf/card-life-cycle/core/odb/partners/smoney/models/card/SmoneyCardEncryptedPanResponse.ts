export interface SmoneyCardEncryptedPanResponse {
  TransactionIdentifier: string;

  cardIDToken: string;

  signKeyIndex: any;

  encryptKeyIndex: any;

  signature: any;

  buffer: {
    encryptedData: string;
  };

  IsSuccess: boolean;
}
