import {
  EventActionCodes,
  EventCallbackTypes,
  EventCardStatuses,
  EventCardTypes,
  EventOpposedReason,
} from '@oney/payment-messages';
import * as Joi from 'joi';

export const receivedCardLifecycleCallbackSchema = Joi.object()
  .keys({
    id: Joi.number().required(),
    reference: Joi.string().required(),
    type: Joi.number().required().equal(EventCallbackTypes.CARD_LIFECYCLE),
    cardType: Joi.number()
      .required()
      .equal(...Object.values(EventCardTypes)),
    action: Joi.number()
      .required()
      .equal(...Object.values(EventActionCodes)),
    status: Joi.number()
      .required()
      .equal(...Object.values(EventCardStatuses)),
    opposedReason: Joi.number()
      .required()
      .equal(...Object.values(EventOpposedReason)),
  })
  .unknown();
