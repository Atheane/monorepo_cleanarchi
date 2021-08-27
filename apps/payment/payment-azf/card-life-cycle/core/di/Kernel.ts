import { buildDomainEventDependencies, MessagingPlugin } from '@oney/ddd';
import { configureLogger } from '@oney/logger-adapters';
import { SymLogger } from '@oney/logger-core';
import { Container } from 'inversify';
import { DomainDependencies } from './DomainDependencies';
import { Identifiers } from './Identifiers';
import { KeyVaultSecrets } from '../../config/config.env';
import { SmoneyEncryptedPanGateway } from '../adapters/gateways/SmoneyEncryptedPanGateway';
import { InMemoryCallbackPayloadRepository } from '../adapters/inmemory/InMemoryCallbackPayloadRepository';
import { InMemoryOdbLegacyBankAccountRepository } from '../adapters/inmemory/InMemoryOdbLegacyBankAccountRepository';
import { MongoDbCallbackPayloadRepository } from '../adapters/mongodb/repositories/MongoDbCallbackPayloadRepository';
import { OdbLegacyBankAccountRepository } from '../adapters/mongodb/repositories/OdbLegacyBankAccountRepository';
import { CallbackPayload } from '../adapters/types/CallbackPayload';
import { LegacyBankAccount } from '../domain/entities/LegacyBankAccount';
import { EncryptedPanGateway } from '../domain/gateways/EncryptedPanGateway';
import { CallbackPayloadRepository } from '../domain/repositories/CallbackPayloadRepository';
import { BankAccountRepository } from '../domain/repositories/LegacyBankAccountRepository';
import { SmoneyApiProvider } from '../odb/partners/SmoneyApiProvider';
import { ProcessCardLifecycleCallback } from '../usecases/ProcessCardLifecycleCallback';

export interface KernelApiProviders {
  smoneyApiProvider: SmoneyApiProvider;
}

export class Kernel extends Container {
  constructor(private inMemory: boolean, private readonly keyVaultSecrets: KeyVaultSecrets) {
    super();

    configureLogger(this);

    const apiProviders = this.getApiProviders(keyVaultSecrets);

    this.initDependencies(apiProviders);
  }

  private initDependencies(apiProviders: KernelApiProviders) {
    const smoneyApiProvider = apiProviders.smoneyApiProvider;
    const inmemoryAccountMap = new Map<string, LegacyBankAccount>();

    this.bind<SmoneyApiProvider>(SmoneyApiProvider).toConstantValue(smoneyApiProvider);
    this.bind<ProcessCardLifecycleCallback>(Identifiers.processCardLifecycleCallback).to(
      ProcessCardLifecycleCallback,
    );

    this.bind<CallbackPayloadRepository>(Identifiers.callbackPayloadRepository).toDynamicValue(() => {
      if (this.inMemory) {
        return new InMemoryCallbackPayloadRepository(
          new InMemoryOdbLegacyBankAccountRepository(inmemoryAccountMap),
          new Map<string, CallbackPayload>(),
        );
      }
      return new MongoDbCallbackPayloadRepository(new OdbLegacyBankAccountRepository(), this.get(SymLogger));
    });

    this.bind<BankAccountRepository>(Identifiers.bankAccountRepository).toDynamicValue(() => {
      if (this.inMemory) {
        return new InMemoryOdbLegacyBankAccountRepository(inmemoryAccountMap);
      }
      return new OdbLegacyBankAccountRepository();
    });

    this.bind<EncryptedPanGateway>(Identifiers.encryptedPanGateway).toDynamicValue(() => {
      if (this.inMemory) {
        return new SmoneyEncryptedPanGateway(
          apiProviders.smoneyApiProvider,
          this.keyVaultSecrets.panPublicKey,
          this.get(SymLogger),
        );
      }
      return new SmoneyEncryptedPanGateway(
        apiProviders.smoneyApiProvider,
        this.keyVaultSecrets.panPublicKey,
        this.get(SymLogger),
      );
    });
  }

  private getApiProviders(keyVaultSecrets: KeyVaultSecrets): KernelApiProviders {
    return {
      smoneyApiProvider: new SmoneyApiProvider(
        keyVaultSecrets.smoneyApiBaseUrl,
        keyVaultSecrets.smoneyApiToken,
      ),
    };
  }

  public getDependencies(): DomainDependencies {
    return {
      processCardLifecycleCallback: this.get(Identifiers.processCardLifecycleCallback),
      callbackPayloadRepository: this.get<CallbackPayloadRepository>(Identifiers.callbackPayloadRepository),
      bankAccountRepository: this.get<BankAccountRepository>(Identifiers.bankAccountRepository),
    };
  }

  public addMessagingPlugin(messagingPlugin: MessagingPlugin): this {
    buildDomainEventDependencies(this).usePlugin(messagingPlugin);
    return this;
  }

  public static async create(inMemory: boolean, keyVaultSecrets: KeyVaultSecrets): Promise<Kernel> {
    return new Kernel(inMemory, keyVaultSecrets);
  }
}
