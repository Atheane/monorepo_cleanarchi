export interface TermsService {
  getTerms(file: string): Promise<Buffer>;
}
