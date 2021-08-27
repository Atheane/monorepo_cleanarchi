import { DomainEventHandler } from '@oney/ddd';
import { PhoneStepValidated } from '@oney/profile-messages';
import { CardSent } from '@oney/payment-messages';
import { SignIn } from '../../usecases/auth/SignIn';
import { OneyTokenKeys } from '../../usecases/partner/oney/OneyTokenKeys';
import { RegisterCreate } from '../../usecases/register/RegisterCreate';
import { RegisterValidate } from '../../usecases/register/RegisterValidate';
import { ConsumeVerifier } from '../../usecases/sca/ConsumeVerifier';
import { RequestSca } from '../../usecases/sca/RequestSca';
import { RequestVerifier } from '../../usecases/sca/RequestVerifier';
import { VerifyCredentials } from '../../usecases/sca/VerifyCredentials';
import { CleanPinCode } from '../../usecases/user/CleanPinCode';
import { SignUpUser } from '../../usecases/user/SignUpUser';
import { GetUser } from '../../usecases/user/GetUser';
import { ProvisionUserPhone } from '../../usecases/user/ProvisionUserPhone';
import { SetPinCode } from '../../usecases/user/SetPinCode';
import {
  AuthRequestGenerator,
  GeneratedEchoRequest,
  GeneratedProvisionRequest,
  UserData,
  UserUid,
} from '../gateways/AuthRequestGenerator';
import { ChannelGateway } from '../gateways/ChannelGateway';
import { ScaVerifierGateway } from '../gateways/ScaVerifierGateway';
import { AuthRequestHandler } from '../handlers/AuthRequestHandler';
import { InvitationRepository } from '../repositories/InvitationRepository';
import { UserRepository } from '../repositories/UserRepository';
import { VerifierRepository } from '../repositories/VerifierRepository';
import { IdentityEncodingService } from '../services/IdentityEncodingService';
import { BlockUser, ProvisionUserPassword } from '../..';

export interface DomainDependencies {
  verifierRepository: VerifierRepository;
  verifierService: ScaVerifierGateway;
  userRepository: UserRepository;
  identityEncoder: IdentityEncodingService;
  requestSca: RequestSca;
  requestVerifier: RequestVerifier;
  consumeVerifier: ConsumeVerifier;
  verifyCredentials: VerifyCredentials;
  signIn: SignIn;
  invitationRepository: InvitationRepository;
  registerCreate: RegisterCreate;
  registerValidate: RegisterValidate;
  setPinCode: SetPinCode;
  cleanPinCode: CleanPinCode;
  getUser: GetUser;
  /*mappers: {
    invitationMappers: InvitationMapper,
    userMapper: JWTUserMapper
  }*/
  getPhoneStep: DomainEventHandler<PhoneStepValidated>;
  getUserCardProvisioningHandler: DomainEventHandler<CardSent>;
  provisionUserPhone: ProvisionUserPhone;
  getProvisioningRequestGenerator: AuthRequestGenerator<UserData, GeneratedProvisionRequest>;
  getAuthRequestHandler: AuthRequestHandler;
  getChannelGateway: ChannelGateway;
  getEchoRequestGenerator: AuthRequestGenerator<UserUid, GeneratedEchoRequest>;
  signUpUser: SignUpUser;
  oneyTokenKeys: OneyTokenKeys;
  provisionUserPassword: ProvisionUserPassword;
  blockUser: BlockUser;
}
