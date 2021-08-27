import { DiligencesType } from '../types/DiligencesType';
import { DiligenceStatus } from '../types/DiligenceStatus';

export interface Diligences {
  reason?: string;

  type: DiligencesType;

  status: DiligenceStatus;
}
