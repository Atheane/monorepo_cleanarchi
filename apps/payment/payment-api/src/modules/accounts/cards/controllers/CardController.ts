import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import {
  AuthenticationError,
  CardHmac,
  CardProperties,
  CreateCard,
  DisplayCardDetails,
  DisplayCardPin,
  GetCard,
  GetCards,
  UpdateCard,
} from '@oney/payment-core';
import { Response } from 'express';
import { injectable } from 'inversify';
import * as httpStatus from 'http-status';
import { Body, Get, JsonController, Param, Put, Req, Res, UseBefore, Post } from 'routing-controllers';
import { CardType } from '@oney/payment-messages';
import { CanExecuteResultEnum, VerifySca } from '@oney/identity-core';
import { envConfiguration } from '../../../../server/config/EnvConfiguration';
import { AuthentifiedRequest } from '../../../../server/config/middlewares/types/AuthentifiedRequest';
import { CreateCardCommand } from '../commands/CreateCardCommand';
import { UpdateCardCommand } from '../commands/UpdateCardCommand';
import { CardWithLimitsMapper } from '../mappers/CardWithLimitsMapper';
import { CardWithLimitsDto } from '../dto/CardWithLimitsDto';
import { DisplayCardPinCommand } from '../commands/DisplayCardPinCommand';
import { DisplayCardDetailsCommand } from '../commands/DisplayCardDetailsCommand';
import { CardHmacCommand } from '../commands/CardHmacCommand';

@JsonController('/accounts/:accountId')
@UseBefore(ExpressAuthenticationMiddleware)
@injectable()
export class CardController {
  constructor(
    private readonly updateCard: UpdateCard,
    private readonly getCard: GetCard,
    private readonly getCards: GetCards,
    private readonly createCard: CreateCard,
    private readonly displayCardPin: DisplayCardPin,
    private readonly displayCardDetails: DisplayCardDetails,
    private readonly cardHmac: CardHmac,
    private readonly cardWithLimitsMapper: CardWithLimitsMapper,
    private readonly _verifySca: VerifySca,
  ) {}

  @Put('/card/:cardId')
  async processUpdateCard(
    @Req() req: AuthentifiedRequest,
    @Body() cmd: UpdateCardCommand,
    @Param('accountId') accountId: string,
    @Param('cardId') cardId: string,
    @Res() res: Response,
  ) {
    if (req.user.uid !== accountId) {
      throw new AuthenticationError.Forbidden('FORBIDDEN');
    }

    const {
      blocked,
      internetPayment,
      foreignPayment,
      atmWeeklyAllowance,
      monthlyAllowance,
      hasPin,
    } = UpdateCardCommand.setProperties(cmd);
    const cardProps = await this.updateCard.execute({
      accountId,
      cardId,
      hasPin,
      preferences: {
        blocked,
        internetPayment,
        foreignPayment,
        atmWeeklyAllowance,
        monthlyAllowance,
      },
    });

    const cardWithLimitsDto: CardWithLimitsDto = this.cardWithLimitsMapper.fromDomain(
      cardProps,
      cardProps.type === CardType.PHYSICAL_CLASSIC
        ? envConfiguration.maxAtmWeeklyAllowanceVisaClassic
        : envConfiguration.maxAtmWeeklyAllowanceVisaPremier,
      cardProps.type === CardType.PHYSICAL_CLASSIC
        ? envConfiguration.maxMonthlyAllowanceVisaClassic
        : envConfiguration.maxMonthlyAllowanceVisaPremier,
    );

    return res.status(200).send(cardWithLimitsDto);
  }

  @Post('/card')
  async processCreateCard(
    @Req() req: AuthentifiedRequest,
    @Body() cmd: CreateCardCommand,
    @Param('accountId') accountId: string,
    @Res() res: Response,
  ) {
    if (req.user.uid !== accountId) {
      throw new AuthenticationError.Forbidden('FORBIDDEN');
    }

    const { cardType } = CreateCardCommand.setProperties(cmd);
    const cardProps = await this.createCard.execute({
      accountId,
      cardType,
    });

    const cardWithLimitsDto: CardWithLimitsDto = this.cardWithLimitsMapper.fromDomain(
      cardProps,
      cardProps.type === CardType.PHYSICAL_CLASSIC
        ? envConfiguration.maxAtmWeeklyAllowanceVisaClassic
        : envConfiguration.maxAtmWeeklyAllowanceVisaPremier,
      cardProps.type === CardType.PHYSICAL_CLASSIC
        ? envConfiguration.maxMonthlyAllowanceVisaClassic
        : envConfiguration.maxMonthlyAllowanceVisaPremier,
    );

    return res.status(200).send(cardWithLimitsDto);
  }

  @Get('/card/:cardId')
  async processGetCard(
    @Req() req: AuthentifiedRequest,
    @Param('accountId') accountId: string,
    @Param('cardId') cardId: string,
    @Res() res: Response,
  ) {
    if (req.user.uid !== accountId) {
      throw new AuthenticationError.Forbidden('FORBIDDEN');
    }

    const cardProps = await this.getCard.execute({
      accountId,
      cardId,
    });

    const cardWithLimitsDto: CardWithLimitsDto = this.cardWithLimitsMapper.fromDomain(
      cardProps,
      cardProps.type === CardType.PHYSICAL_CLASSIC
        ? envConfiguration.maxAtmWeeklyAllowanceVisaClassic
        : envConfiguration.maxAtmWeeklyAllowanceVisaPremier,
      cardProps.type === CardType.PHYSICAL_CLASSIC
        ? envConfiguration.maxMonthlyAllowanceVisaClassic
        : envConfiguration.maxMonthlyAllowanceVisaPremier,
    );

    return res.status(200).send(cardWithLimitsDto);
  }

  @Get('/cards')
  async processGetCards(
    @Req() req: AuthentifiedRequest,
    @Param('accountId') accountId: string,
    @Res() res: Response,
  ) {
    if (req.user.uid !== accountId) {
      throw new AuthenticationError.Forbidden('FORBIDDEN');
    }

    const cardsProps = await this.getCards.execute({
      accountId,
    });

    const cardsWithLimitsDto: Array<CardWithLimitsDto> = cardsProps.map((cardProps: CardProperties) => {
      return this.cardWithLimitsMapper.fromDomain(
        cardProps,
        cardProps.type === CardType.PHYSICAL_CLASSIC
          ? envConfiguration.maxAtmWeeklyAllowanceVisaClassic
          : envConfiguration.maxAtmWeeklyAllowanceVisaPremier,
        cardProps.type === CardType.PHYSICAL_CLASSIC
          ? envConfiguration.maxMonthlyAllowanceVisaClassic
          : envConfiguration.maxMonthlyAllowanceVisaPremier,
      );
    });

    return res.status(200).send(cardsWithLimitsDto);
  }

  @UseBefore(ExpressAuthenticationMiddleware)
  @Post('/card/:cid/displaypin')
  async processDisplayCardPin(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('accountId') accountId: string,
    @Param('cid') cid: string,
    @Body() cmd: DisplayCardPinCommand,
  ): Promise<Response> {
    const sca = await this.displayCardPin.canExecute(req.user, {
      uid: accountId,
      cardId: cid,
      rsaPublicKey: cmd.rsaPublicKey,
    });
    if (sca.result === CanExecuteResultEnum.SCA_NEEDED) {
      await this._verifySca.execute({
        action: {
          payload: sca.scaPayload.payload,
          type: sca.scaPayload.actionType,
        },
        identity: req.user,
      });
    }

    const body = DisplayCardPinCommand.setProperties(cmd);
    const encryptedData = await this.displayCardPin.execute({
      uid: accountId,
      cardId: cid,
      ...body,
    });

    return res.status(httpStatus.OK).send(encryptedData);
  }

  @UseBefore(ExpressAuthenticationMiddleware)
  @Post('/card/:cid/displaydetails')
  async processDisplayCardDetails(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('accountId') accountId: string,
    @Param('cid') cid: string,
    @Body() cmd: DisplayCardDetailsCommand,
  ): Promise<Response> {
    const sca = await this.displayCardDetails.canExecute(req.user, {
      uid: accountId,
      cardId: cid,
      rsaPublicKey: cmd.rsaPublicKey,
    });
    if (sca.result === CanExecuteResultEnum.SCA_NEEDED) {
      await this._verifySca.execute({
        action: {
          payload: sca.scaPayload.payload,
          type: sca.scaPayload.actionType,
        },
        identity: req.user,
      });
    }

    const body = DisplayCardDetailsCommand.setProperties(cmd);
    const encryptedData = await this.displayCardDetails.execute({
      uid: accountId,
      cardId: cid,
      ...body,
    });

    return res.status(httpStatus.OK).send(encryptedData);
  }

  @UseBefore(ExpressAuthenticationMiddleware)
  @Post('/card/:cid/hmac')
  async processCardHmac(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('accountId') accountId: string,
    @Param('cid') cid: string,
    @Body() cmd: CardHmacCommand,
  ): Promise<Response> {
    const canExecuteResult = await this.cardHmac.canExecute(req.user);
    if (canExecuteResult.result !== CanExecuteResultEnum.ACCESS_GRANTED) {
      return res.sendStatus(401);
    }

    const body = CardHmacCommand.setProperties(cmd);
    const encryptedData = await this.cardHmac.execute({
      uid: accountId,
      cardId: cid,
      ...body,
    });

    return res.status(httpStatus.OK).send(encryptedData);
  }
}
