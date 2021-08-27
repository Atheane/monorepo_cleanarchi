import { injectable } from 'inversify';
import { Observable, Subject } from 'rxjs';
import { RxMessage } from './types/RxMessage';

@injectable()
export class RxServiceBus {
  private _subject: Subject<RxMessage>;

  constructor() {
    this._subject = new Subject<RxMessage>();
  }

  public next(message: RxMessage) {
    this._subject.next(message);
  }

  get bus$(): Observable<RxMessage> {
    return this._subject;
  }
}
