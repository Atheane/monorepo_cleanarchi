export interface InsuranceWarranties {
  icon: string;
  title: string;
  name: string;
  exclusivity: boolean;
}

export interface Insurance {
  name: string;
  detail: string;
  warranties: InsuranceWarranties[];
}
