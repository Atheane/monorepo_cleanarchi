import { SagaIntegrityChecker } from './integrity-checker/SagaIntegrityChecker';
import { SagaEventRouter } from './SagaEventRouter';
import { SagaSchemaSynchronizer } from './SagaSchemaSynchronizer';

export class SagaOrchestrator {
  private _integrityChecker: SagaIntegrityChecker;
  private _schemaSynchronizer: SagaSchemaSynchronizer;
  private _router: SagaEventRouter;

  constructor(
    integrityChecker: SagaIntegrityChecker,
    schemaSynchronizer: SagaSchemaSynchronizer,
    router: SagaEventRouter,
  ) {
    this._integrityChecker = integrityChecker;
    this._schemaSynchronizer = schemaSynchronizer;
    this._router = router;
  }

  async start() {
    const checkResult = this._integrityChecker.check();
    if (checkResult.onError) {
      // todo log
      checkResult.throwDetailedError();
    }

    this._schemaSynchronizer.synchronize();
    this._router.initialize();
    await this._router.start();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stop() {}
}
