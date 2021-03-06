export const CreditIdentifiers = {
  configuration: Symbol.for('configuration'),
  mappers: {
    splitSimulationMapper: Symbol.for('splitSimulationMapper'),
    splitContractMapper: Symbol.for('splitContractMapper'),
    paymentExecutionMapper: Symbol.for('paymentExecutionMapper'),
  },
  termsService: Symbol.for('termsService'),
  paymentService: Symbol.for('paymentService'),
  fileStorage: Symbol.for('fileStorage'),
  splitSimulationRepository: Symbol.for('splitSimulationRepository'),
  splitContractRepository: Symbol.for('splitContractRepository'),
  splitPaymentScheduleRepository: Symbol.for('splitPaymentScheduleRepository'),
  guardGateway: Symbol.for('guardGateway'),
  longIdGenerator: Symbol.for('longIdGenerator'),
  paymentScheduleService: Symbol.for('paymentScheduleService'),
  encodeIdentity: Symbol.for('encodeIdentity'),
  creditorRepository: Symbol.for('creditorRepository'),
  creditGetAllSplitContract: Symbol.for('creditGetAllSplitContract'),
  checkUserId: Symbol.for('checkUserId'),
  createCreditor: Symbol.for('createCreditor'),
  getCreditor: Symbol.for('getCreditor'),
  updateCreditor: Symbol.for('updateCreditor'),
  createSplitContract: Symbol.for('createSplitContract'),
  getOneSplitContract: Symbol.for('getOneSplitContract'),
  getPaymentSchedule: Symbol.for('getPaymentSchedule'),
  getSplitContracts: Symbol.for('getSplitContracts'),
  simulateSplit: Symbol.for('simulateSplit'),
  validateSplitSimulation: Symbol.for('validateSplitSimulation'),
  getTerms: Symbol.for('getTerms'),
};
