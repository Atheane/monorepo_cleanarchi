import { Profile } from '../aggregates/Profile';
import { ProfileInformations } from '../valuesObjects/ProfileInformations';
import { BankAccountIdentity } from '../valuesObjects/BankAccountIdentity';

export interface CreateFolderRequest {
  caseReference: string;
  masterReference: string;
  email: string;
  phone: string;
}

export interface CreateFolderResponse {
  location: string;
}

export interface CreateNewCaseRequest {
  caseReference: string;
  uid: string;
}

export interface CreateNewCaseResponse {
  caseId: number;
}

export interface Identity {
  profileInformation: ProfileInformations;
  bankAccountIdentity: BankAccountIdentity;
}

export interface BankAccountIdentityRequest {
  uid: string;
  identity: Identity;
}

export interface FolderGateway {
  create(request: CreateFolderRequest): Promise<CreateFolderResponse>;
  update(profile: Profile): Promise<Profile>;
  sendDataToNewCase(profile: Profile): Promise<Profile>;
  createNewCase(request: CreateNewCaseRequest): Promise<CreateNewCaseResponse>;
  isBankAccountOwner(request: BankAccountIdentityRequest): Promise<boolean>;
  askForDecision(caseReference: string): Promise<void>;
}
