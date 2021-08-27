export interface OtpDbModel {
  uid: string;
  codeHash: string;
  phone: string;
  creation_attempts: number;
  created_at: string;
  updated_at: string;
}
