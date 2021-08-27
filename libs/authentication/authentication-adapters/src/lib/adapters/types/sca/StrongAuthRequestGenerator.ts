import { URL } from 'url';

export interface AuthRequestGeneratorProps {
  baseUrl: string;
  securityAssertionPath: string;
  verifyPath: string;
}

export interface StrongAuthRequestGenerator {
  generateRequest(uid: string): Promise<{ url: URL }>;
  getRequestConfig(): AuthRequestGeneratorProps;
}
