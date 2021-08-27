import { EncryptedCardPin } from '../types/card/EncryptedCardPin';
import { EncryptedCardHmac } from '../types/card/EncryptedCardHmac';
import { EncryptedCardDetails } from '../types/card/EncryptedCardDetails';

export interface CardGateway {
  displayPin(uid: string, cid: string, rsaPublicKey: string): Promise<EncryptedCardPin>;
  hmac(cid: string, rsaPublicKey: string, hmacData: string): Promise<EncryptedCardHmac>;
  displayDetails(cid: string, rsaPublicKey: string): Promise<EncryptedCardDetails>;
}
