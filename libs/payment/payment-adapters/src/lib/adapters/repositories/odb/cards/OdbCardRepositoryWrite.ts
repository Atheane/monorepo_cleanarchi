import {
  BankAccountRepositoryRead,
  Card,
  CardRepositoryWrite,
  LegacyBankAccount,
  QueryService,
  PaymentIdentifier,
  BankAccountRepositoryWrite,
} from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { OdbBankAccountMapper } from '../../../mappers/OdbBankAccountMapper';
import { SmoneyCardCreateMapper } from '../../../mappers/SmoneyCardCreateMapper';
import { SmoneyCardUpdateMapper } from '../../../mappers/SmoneyCardUpdateMapper';
import { LegacyCardMapper } from '../../../mappers/LegacyCardMapper';
import { SmoneyNetworkProvider } from '../../../partners/smoney/SmoneyNetworkProvider';

@injectable()
export class OdbCardRepositoryWrite implements CardRepositoryWrite {
  private readonly smoneyCardUpdateMapper: SmoneyCardUpdateMapper;

  private readonly smoneyCardCreateMapper: SmoneyCardCreateMapper;

  private readonly legacyCardMapper: LegacyCardMapper;

  constructor(
    @inject(PaymentIdentifier.accountManagementQueryService) private readonly _queryService: QueryService,
    @inject(PaymentIdentifier.networkProvider) private readonly _networkProvider: SmoneyNetworkProvider,
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
  ) {
    this.smoneyCardUpdateMapper = new SmoneyCardUpdateMapper();
    this.legacyCardMapper = new LegacyCardMapper();
    this.smoneyCardCreateMapper = new SmoneyCardCreateMapper();
  }

  async update(card: Card): Promise<Card> {
    const result = await this._queryService.findOne<LegacyBankAccount>({ uid: card.ownerId });
    const legacyAccount = result;
    const legacyCardIndex = legacyAccount.cards.findIndex(item => item.cid === card.id);

    await this._networkProvider.api().smoneyCardApi.updateCard(this.smoneyCardUpdateMapper.fromDomain(card));

    /*
     Since Smoney does not return a correctly updated card payload, we're forced to call them back in order
     to get the fully updated data. But in the process, we loose the hasPin value sent by the user
     */
    // const updatedCard = await this._cardRepositoryRead.findByAccountAndCardId(card.ownerId, card.id);
    // updatedCard.hasPin = card.hasPin;
    // updatedCard.props.status = card.status;

    const legacyCard = this.legacyCardMapper.fromDomain(card);
    legacyAccount.cards[legacyCardIndex] = { ...legacyAccount.cards[legacyCardIndex], ...legacyCard };
    const bankAccount = new OdbBankAccountMapper().toDomain(legacyAccount);
    await this._bankAccountRepositoryWrite.save(bankAccount);
    return card;
  }

  async create(card: Card): Promise<Card> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(card.ownerId);
    const createdCard = this.smoneyCardCreateMapper.toDomain(
      await this._networkProvider
        .api()
        .smoneyCardApi.createCard(this.smoneyCardCreateMapper.fromDomain(card)),
    );
    bankAccount.props.cards.push(createdCard);
    await this._bankAccountRepositoryWrite.save(bankAccount);
    return createdCard;
  }
}
