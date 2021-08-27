import { AxiosHttpMethod, httpBuilder } from '@oney/http';
import {
  AutorisationGateway,
  ConsumeScaGateway,
  DecodeIdentity,
  EncodeIdentity,
  IdentityDecoder,
  IdentityEncoder,
  IdentityIdentifier,
  IdentityProvider,
  IdentityService,
  ProviderGateway,
  RequestScaGateway,
  RequestScaVerifier,
  ServiceName,
  VerifySca,
  VerifyScaGateway,
} from '@oney/identity-core';
import { Container, interfaces } from 'inversify';
import { VerifyOptions } from 'jsonwebtoken';
import { AzureIdentityDecoder } from '../adapters/gateways/AzureIdentityDecoder';
import { OdbAuthorizationGateway } from '../adapters/gateways/OdbAuthorizationGateway';
import { OdbConsumeScaGateway } from '../adapters/gateways/OdbConsumeScaGateway';
import { OdbIdentityDecoder } from '../adapters/gateways/OdbIdentityDecoder';
import { OdbIdentityEncoder } from '../adapters/gateways/OdbIdentityEncoder';
import { OdbIdentityProvider } from '../adapters/gateways/OdbIdentityProvider';
import { OdbRequestScaGateway } from '../adapters/gateways/OdbRequestScaGateway';
import { OdbVerifyScaGateway } from '../adapters/gateways/OdbVerifyScaGateway';
import { AzureIdentityMapper } from '../adapters/mappers/AzureIdentityMapper';
import { OdbIdentityMapper } from '../adapters/mappers/OdbIdentityMapper';
import { OdbRoleRepository } from '../adapters/repositories/OdbRoleRepository';
import { OdbIdentityService } from '../adapters/services/OdbIdentityService';
import { AzureClientIds, RolesDictionnary } from '../adapters/inmemory/RolesDictionnary';

export interface IdentityConfiguration {
  secret: string;
  azureTenantId: string;
  jwtOptions: VerifyOptions;
  serviceName: string;
  azureClientIds: AzureClientIds;
  applicationId: string;
  /*
   * If provided, you will have access to the sca usecase.
   * */
  frontDoorBaseApiUrl?: string;
}

const httpService = new AxiosHttpMethod();

export async function configureIdentityLib(container: Container, config: IdentityConfiguration) {
  const odbIdentityMapper = new OdbIdentityMapper();
  const rolesConfiguration = new RolesDictionnary(config.azureClientIds);
  container.bind(RolesDictionnary).toConstantValue(rolesConfiguration);
  container.bind(IdentityIdentifier.roleRepository).to(OdbRoleRepository);
  container
    .bind<IdentityDecoder>(IdentityIdentifier.identityDecoder)
    .toConstantValue(new OdbIdentityDecoder(odbIdentityMapper, config.secret, config.jwtOptions))
    .whenParentNamed(IdentityProvider.odb);

  container
    .bind<IdentityDecoder>(IdentityIdentifier.identityDecoder)
    .toConstantValue(
      new AzureIdentityDecoder(
        new AzureIdentityMapper(),
        config.azureTenantId,
        config.jwtOptions,
        config.applicationId,
      ),
    )
    .whenParentNamed(IdentityProvider.azure);

  container
    .bind<IdentityEncoder>(IdentityIdentifier.identityEncoder)
    .toConstantValue(new OdbIdentityEncoder(odbIdentityMapper, config.secret));
  container.bind<IdentityService>(IdentityIdentifier.identityService).to(OdbIdentityService);
  container.bind<ProviderGateway>(IdentityIdentifier.providerGateway).to(OdbIdentityProvider);
  if (config.frontDoorBaseApiUrl) {
    const http = httpBuilder(httpService).setBaseUrl(`${config.frontDoorBaseApiUrl}/authentication`);
    const identityEncoder = container.get<IdentityEncoder>(IdentityIdentifier.identityEncoder);
    container
      .bind<VerifyScaGateway>(IdentityIdentifier.verifyScaGateway)
      .toConstantValue(new OdbVerifyScaGateway(identityEncoder, http));
    container
      .bind<RequestScaGateway>(IdentityIdentifier.requestScaGateway)
      .toConstantValue(new OdbRequestScaGateway(identityEncoder, http));
    container
      .bind<ConsumeScaGateway>(IdentityIdentifier.consumeScaGateway)
      .toConstantValue(new OdbConsumeScaGateway(identityEncoder, http));
    container.bind<VerifySca>(VerifySca).to(VerifySca);
    container.bind<RequestScaVerifier>(RequestScaVerifier).to(RequestScaVerifier);
  }

  container
    .bind<interfaces.Factory<IdentityService>>('Factory<IdentityService>')
    .toFactory<IdentityService>((context: interfaces.Context) => {
      return (named: string) => {
        return context.container.getNamed<IdentityService>(IdentityIdentifier.identityService, named);
      };
    });
  container.bind(DecodeIdentity).to(DecodeIdentity);
  container.bind(EncodeIdentity).to(EncodeIdentity);
  container
    .bind<AutorisationGateway>(IdentityIdentifier.authorizationGateway)
    .toConstantValue(new OdbAuthorizationGateway(config.serviceName));
}

export async function getServiceHolderIdentity(
  container: Container,
  serviceName: ServiceName,
): Promise<string> {
  const encodeIdentity = container.get(EncodeIdentity);
  return await encodeIdentity.execute({
    providerId: serviceName,
    uid: serviceName,
    email: `${serviceName}@${serviceName}.co`,
    provider: IdentityProvider.odb,
  });
}
