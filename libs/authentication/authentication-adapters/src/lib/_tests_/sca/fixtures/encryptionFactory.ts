import { constants, createPrivateKey, createPublicKey, KeyPairSyncResult } from 'crypto';
import { RSAKeyPairOptions } from 'crypto';
import { generateKeyPairSync, publicEncrypt, privateDecrypt } from 'crypto';
import { DecryptedCardData } from '../../../adapters/types/sca/DecryptedCardData';

const testCardData: DecryptedCardData = {
  alea: 'qD1ey9Z9p0X2X2cV',
  primaryAccountNumber: '4539588089085589',
  cardExpirationDate: '0923',
  cvv2: '512',
};
let testCardDataCiphertext64: string;

export const getKeyPair = (): KeyPairSyncResult<string, string> => {
  const options: RSAKeyPairOptions<'pem', 'pem'> = {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: '',
    },
  };
  return generateKeyPairSync('rsa', options);
};

export const { privateKey: generatedPriv, publicKey: generatedPub } = getKeyPair();

export const encryptCardDataWithPublicKey = (cardData?: DecryptedCardData, publicKey64?: string): string => {
  cardData = cardData ?? testCardData;
  const createKey = () => createPublicKey(Buffer.from(publicKey64, 'base64'));
  const publicKey = publicKey64 ? createKey() : generatedPub;
  const cardDataJson = JSON.stringify(cardData);
  const cardDataJsonBuffer = Buffer.from(cardDataJson, 'utf8');
  const ciphertext = publicEncrypt(publicKey, cardDataJsonBuffer);
  testCardDataCiphertext64 = ciphertext.toString('base64');
  return testCardDataCiphertext64;
};

export const decryptWithPrivateKey = (ciphertext64?: string, privateKey64?: string): string => {
  const ciphertext64Buffer = ciphertext64
    ? Buffer.from(ciphertext64, 'base64')
    : Buffer.from(testCardDataCiphertext64, 'base64');
  const privateKey = privateKey64
    ? createPrivateKey({ key: Buffer.from(privateKey64, 'base64').toString('utf8'), passphrase: '' })
    : createPrivateKey({ key: generatedPriv, passphrase: '' });
  const plaintext = privateDecrypt(
    { key: privateKey, padding: constants.RSA_PKCS1_OAEP_PADDING },
    ciphertext64Buffer,
  ).toString('utf8');
  return plaintext;
};

export const ciphertext64FromSmoney =
  'DzcLjw41xcKBz3sSEgwmrIgT2shf3pz3+O93BKXhpIPfQ0vvm/sd8D3/N2R0LCw9eD' +
  'rdaGOKRKfA1l/IeC+Ro4Z5lXbrXdvHG0Eghe4gCag2LEbR9CjuSA/Rd0Rd9RuLPL+WbgUu4TzK3kmBE' +
  'uLiz95OHMoT2jmLAAWONLU6QcEpc44F0dhNGTZ7aDu8ewuIG53V8Whsk1Rdl5DEKMVyJ/P4fsTffuUuT' +
  'XoolrHU8apWstZKojthNNYBn5KRI4ACs7086qqCyWpSkknOIhq0vafcAtSHtMs7dgA2kaU8nA7f/Pv+k' +
  'xyIvIIfWROeLUpvjV2MqrAgciO34wUQ6RsVlGeXD6mnybt7zQ4lM9/gWjWvCLnTaEC6XwJUkjPUMicdO' +
  'bjAw/BaP68BC3wNfgHRFmub04tcCeWUewx/L/q+x/MYA6Xz/egfaa8oelsmNOR6B27JRPPZ9mY9Bkg6kF' +
  '9AgXBBDFjV45OHoI2JTMc2vGClKeBGMwhwDvOCPLbCcO02DfYXHZVn/KXIugqNEbdaNbCejO8oVmpJLA3' +
  'G2/D01vKHCN/7iq/vRUt0tSz45JJwh3/WlXHhzmn8yuaxf9Awvd2Erp/xQmj0qop6TEbcqkNyZrx/1Kg' +
  'ciyhz/KKgPS8hTx/VldrJXLfOB4Tsr7ND4lOWlBpDgFLZBiaAY1PFQk8=';

export const ciphertext64GeneratedFromPrivateKey =
  'NqpGPoBNy5cMSJcdRaWpdiNCxFuzJxlgn56CTxQtCA1OyNzxZHxwI7s4Po0pjK4pNTMakr2l+5Uztueb/poRcOe2FeNhUB0WVDsXIdzd0fASkA4dSvMf8zjcb8o3nsN2ru2VYdL3ngDavx9oUyt97Sje6oCf+6DMexMAAHdeL/Kf0yZ/5D0nig9BcGyStV2Ipaq096tAAccYwms2lVj4gz4m8m6CL/mK+SpoVK0Zopmol5y34J0khNS6iLK/PM8pNEHnIowTcUW2yDp340E6TlayGV6ipETOH8IjoADNX/d3Wu85P2sUtfAOTeHnyG9peZuLIK28NFMEoaFvXk2p8D7ncbu+NZmahDJkldelg7EBwwu4ArG//zUrM2Xdg36riWGCSmW5LsJ3vwXx2NJFal2fehUIRx1vjlWKYU1/lb4xdPnfihTaFV6MFuCoZ5FWdLbuJxI9lkp3U9vSvxmENAtunEZ3ZRyt2gRtMDFB/64f+qS529G6X67paZ2/u+iXtqWEa4K42vzn6quGWGs4xObJFzFIfZ7HBfbPkQ3nR1Wl7ok3LK515J7z32JaCP8WlM/PSV74CHdUYpEKWSR98Dlwl6j6A05iJcIbEam2fCqHDpaOSqA56g2c/ZFKRRT8rTp2C6Uy8E5T+NiGLdRCCh8Sj3F8Ayr0B8aVMl0F4g0=';
