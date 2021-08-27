export interface SmoneyCreationType {
  RelatedCard?: string;
  Action: number;
}

export interface SmoneyCreateCardRequest {
  smoneyId: string;
  AppCardId: string;
  Type: number;
  FintechCultureName: string;
  CreationType: SmoneyCreationType;
  UseRandomPin: number;
}
