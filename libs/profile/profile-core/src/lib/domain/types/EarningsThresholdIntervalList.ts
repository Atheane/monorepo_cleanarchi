import { EarningsThreshold } from './EarningsThreshold';

export interface EarningsThresholdInterval {
  name: string;
  code: string;
}

export const EarningsThresholdIntervalList: EarningsThresholdInterval[] = [
  {
    name: 'Inférieurs à 1000 euros par mois',
    code: EarningsThreshold.THRESHOLD1,
  },
  {
    name: 'Entre 1000 et 1800 euros par mois',
    code: EarningsThreshold.THRESHOLD2,
  },
  {
    name: 'Entre 1800 et 2800 euros par mois',
    code: EarningsThreshold.THRESHOLD3,
  },
  {
    name: 'Entre 2800 et 3600 euros par mois',
    code: EarningsThreshold.THRESHOLD4,
  },
  {
    name: 'Entre 3600 et 4600 euros par mois',
    code: EarningsThreshold.THRESHOLD5,
  },
  {
    name: 'Entre 4600 et 6000 euros par mois',
    code: EarningsThreshold.THRESHOLD6,
  },
  {
    name: 'Supérieurs à 6000 euros par mois',
    code: EarningsThreshold.THRESHOLD7,
  },
];
