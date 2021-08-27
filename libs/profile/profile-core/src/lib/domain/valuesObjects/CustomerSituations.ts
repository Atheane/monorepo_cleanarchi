import { InternalIncidents } from './InternalIncidents';

export class CustomerSituations {
  lead: boolean;
  internalIncidents: InternalIncidents;
  creditAccountsSituation: {
    totalOutstandingCredit: number;
  };

  constructor(customerSituations: CustomerSituations) {
    Object.assign(this, customerSituations);
  }
}
