export interface VerifyBankAccountOwnerCommand {
  uid: string;
  holder: string;
  identity?: string;
  lastName?: string;
  firstName?: string;
  birthDate?: string;
  bankName: string;
}
