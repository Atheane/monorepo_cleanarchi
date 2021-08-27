import {
  SplitPaymentScheduleRepository,
  PaymentGateway,
  SplitContractRepository,
  ClosureContractService,
  ProcessPayments,
  ClosePaidContracts,
} from '../../../../core/src';

export interface DomainDependencies {
  processPayments: ProcessPayments;
  closePaidContracts: ClosePaidContracts;
  splitPaymentScheduleRepository: SplitPaymentScheduleRepository;
  splitContractRepository: SplitContractRepository;
  paymentGateway: PaymentGateway;
  closureContractService: ClosureContractService;
}
