import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  NotFoundException,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ScaErrors } from '@oney/identity-core';
import {
  SplitContractError,
  SplitSimulationError,
  SplitPaymentScheduleError,
  CreditorError,
} from '@oney/credit-core';
import { ScaException } from '../exceptions/ScaException';

@Injectable()
export class ErrorHandlerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (
          error instanceof SplitContractError.NotFound ||
          error instanceof SplitPaymentScheduleError.NotFound ||
          error instanceof SplitSimulationError.NotFound ||
          error instanceof CreditorError.UserNotFound
        ) {
          throw new NotFoundException(error);
        } else if (error instanceof SplitSimulationError.UnkownSplitProduct) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        } else if (error instanceof ScaErrors.ScaRequired) {
          throw new ScaException(error);
        } else {
          throw new HttpException(
            error.details ?? error,
            error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }),
    );
  }
}
