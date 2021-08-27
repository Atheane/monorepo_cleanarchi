import { SagaHandleDefinition } from '../../models/SagaHandleDefinition';
import { SagaRegistry, SagaRegistryEntry } from '../../SagaRegistry';
import { SagaActiveStore } from '../../store/SagaActiveStore';
import { SagaDefinitionStore } from '../../store/SagaDefinitionStore';
import { SagaIntegrityChecker } from '../SagaIntegrityChecker';
import { FromEventIntegrityError } from '../types/FromEventIntegrityError';
import { SagaIntegrityCheckResult } from '../types/SagaIntegrityCheckResult';
import { SagaIntegrityError } from '../types/SagaIntegrityError';
import { ToSagaIntegrityError } from '../types/ToSagaIntegrityError';

export class InMemorySagaIntegrityChecker extends SagaIntegrityChecker {
  private _registry: SagaRegistry;
  private _definitionStore: SagaDefinitionStore;
  private _activeStore: SagaActiveStore;

  constructor(registry: SagaRegistry, definitionStore: SagaDefinitionStore, activeStore: SagaActiveStore) {
    super();
    this._registry = registry;
    this._definitionStore = definitionStore;
    this._activeStore = activeStore;
  }

  check() {
    const result: SagaIntegrityCheckResult = new SagaIntegrityCheckResult();

    const sagaCtors = this._registry.read();

    for (const sagaCtor of sagaCtors) {
      const errors = this.verifyIfAllHandleHaveACorrelationMap(sagaCtor);
      result.addErrors(...errors);
    }

    return result;
  }

  verifyIfAllHandleHaveACorrelationMap(entry: SagaRegistryEntry) {
    const errors: SagaIntegrityError[] = [];

    const startedBy = entry.definition.startedByDefinition;
    errors.push(...this.verifyMapForDefinition(startedBy));

    for (const handleDefinition of entry.definition.handles) {
      errors.push(...this.verifyMapForDefinition(handleDefinition));
    }

    return errors;
  }

  verifyMapForDefinition(definition: SagaHandleDefinition) {
    const errors: SagaIntegrityError[] = [];

    if (!this.hasFromEvent(definition)) {
      errors.push(new FromEventIntegrityError(definition));
    }
    if (!this.hasToSaga(definition)) {
      errors.push(new ToSagaIntegrityError(definition));
    }

    return errors;
  }

  hasFromEvent(definition: SagaHandleDefinition) {
    return !!definition.fromEventSelect;
  }

  hasToSaga(definition: SagaHandleDefinition) {
    return !!definition.toSagaSelect;
  }
}
