import { CardType } from '@oney/payment-messages';
import { CustomerType, OfferCategory, OfferRef, OfferType } from '@oney/subscription-messages';
import { DurationType } from '@oney/subscription-core';

export const offers = [
  {
    id: '0d84b88b-e93a-4de7-b52e-44eacd9e7b18',
    name: 'Original',
    ref: OfferRef.ONEY_ORIGINAL,
    category: OfferCategory.ONEY_PLUS,
    type: OfferType.ONEY_ORIGINAL,
    description: 'Une carte VISA Classic et une protection de vos achats en ligne pour 2,50 € par mois',
    price: 2.5,
    freeWithdrawal: 3,
    periodicity: 'monthly',
    offersIncentives: [
      {
        incentiveIcon: 'card',
        incentiveDescription: 'Visa Classic',
      },
      {
        incentiveIcon: 'withdrawal',
        incentiveDescription: '3 retraits inclus',
      },
      {
        incentiveIcon: 'internationnal',
        incentiveDescription: 'Tous vos paiements en devise sans frais',
      },
    ],
    card: {
      cardType: CardType.PHYSICAL_CLASSIC,
      cardImg: 'carte/classic',
      blocked: false,
      foreignPayment: true,
      internetPayment: true,
      atmWeeklyAllowance: 2.5,
      atmMonthlyAllowance: 5,
      price: 2.0,
      assistance: [
        {
          icon: 'visa-assistance',
          title: 'Couverture médicale d’urgence',
          exclusivity: false,
          details:
            '24h/24 dans le monde entier en cas de blessure ou de maladie, je peux contacter mon assistance médicale par téléphone ou via le site internet (information dans ma notice).',
        },
      ],
    },
    insurances: [
      {
        name: 'Couverture Perte et Vol',
        title: 'Couverture contre la perte et le vol',
        detail:
          'https://firebasestorage.googleapis.com/v0/b/odb-f622c.appspot.com/o/797F.pdf?alt=media&token=923ee060-41e0-4a81-bb96-877ad57e1892',
        warranties: [
          {
            icon: 'internet',
            title: 'Protection de vos achats sur internet',
            name: 'Achat sur internet',
            exclusivity: false,
          },
        ],
      },
    ],
    discounts: [
      {
        discountName: 'Pack Classic launching campaign',
        discountDescription: '3 mois gratuit MVP',
        discountValue: {
          type: 'RATE',
          value: 1,
        },
        discountApplicationRules: {
          matchingTags: ['launchingCampaign'],
          matchingCustomerType: [
            CustomerType.VIP,
            CustomerType.COLLABORATOR,
            CustomerType.LEAD,
            CustomerType.DEFAULT,
          ],
          duration: DurationType.FIXED,
          campaignStart: new Date('06-01-2021'),
          campaignEnd: new Date('08-31-2021'),
          nbIndex: 3,
        },
        cumulative: false,
      },
      {
        discountName: 'Oney collaborator discount',
        discountDescription: 'Free of charge for Oney collaborators',
        discountValue: {
          type: 'RATE',
          value: 1,
        },
        discountApplicationRules: {
          matchingTags: [],
          matchingCustomerType: [CustomerType.COLLABORATOR],
          duration: DurationType.UNLIMITED,
          campaignStart: null,
          campaignEnd: null,
          nbIndex: null,
        },
        cumulative: true,
      },
      {
        discountName: 'VIP discount',
        discountDescription: 'Free of charge for VIP members',
        discountValue: {
          type: 'RATE',
          value: 1,
        },
        discountApplicationRules: {
          matchingTags: [],
          matchingCustomerType: [CustomerType.VIP],
          duration: DurationType.UNLIMITED,
          campaignStart: null,
          campaignEnd: null,
          nbIndex: null,
        },
        cumulative: true,
      },
    ],
  },
  {
    id: 'c7cf068d-77ae-46b0-bf1f-afd938f4fc85',
    name: 'First',
    ref: OfferRef.ONEY_FIRST,
    type: OfferType.ONEY_FIRST,
    category: OfferCategory.ONEY_PLUS,
    description: 'Une carte VISA Premier et une couverture étendue pour 5,90 € par mois',
    price: 5.9,
    freeWithdrawal: 5,
    periodicity: 'monthly',
    offersIncentives: [
      {
        incentiveIcon: 'card',
        incentiveDescription: 'Visa Premier',
      },
      {
        incentiveIcon: 'withdrawal',
        incentiveDescription: '5 retraits inclus',
      },
      {
        incentiveIcon: 'internationnal',
        incentiveDescription: 'Tous vos paiements en devise sans frais',
      },
    ],
    card: {
      cardType: CardType.PHYSICAL_PREMIER,
      cardImg: 'carte/premier-png',
      blocked: false,
      foreignPayment: true,
      internetPayment: true,
      atmWeeklyAllowance: 2.5,
      atmMonthlyAllowance: 5,
      price: 4.9,
      assistance: [
        {
          icon: 'visa-assistance',
          title: 'Couverture médicale d’urgence',
          exclusivity: false,
          details:
            '24h/24 dans le monde entier en cas de blessure ou de maladie, je peux contacter mon assistance médicale par téléphone ou via le site internet (information dans ma notice).',
        },
        {
          icon: 'visa-annulation-vol',
          title: 'Garantie annulation ou retard transport',
          exclusivity: true,
          details:
            'Si pour des raisons personnelles (maladie, accident, ...) ou professionnelles éligibles vous devez annuler ou modifier votre voyage, vous pouvez bénéficier d’une indemnisation allant jusqu’à 5 000 € par an.',
        },
        {
          icon: 'visa-vol-bagage',
          title: 'Couverture vol de bagages',
          exclusivity: true,
          details:
            'Que vous preniez l’avion ou le train, en cas de retard de vos bagages, bénéficiez d’une indemnité allant jusqu’à 400 € TTC pour vos dépenses de première nécessité (vêtements, articles de toilette).',
        },
        {
          icon: 'visa-location-voiture',
          title: 'Garantie location de voiture',
          exclusivity: true,
          details:
            'Si vous avez un accident avec votre voiture de location, le montant des réparations ou de remise en état du véhicule de location restant à votre charge en application du contrat de location est remboursé (sans franchise).',
        },
        {
          icon: 'visa-rapatriement',
          title: 'Assistance médicale rapatriement',
          exclusivity: true,
          details:
            'Si pour des raisons personnelles (maladie, accident, ...) ou professionnelles éligibles vous devez interrompre votre voyage, vous pouvez bénéficier d’une indemnisation allant jusqu’à 5 000 € par an.',
        },
      ],
    },
    insurances: [
      {
        name: 'Couverture Perte et Vol',
        title: 'Couverture contre la perte et le vol',
        detail:
          'https://firebasestorage.googleapis.com/v0/b/odb-f622c.appspot.com/o/797F.pdf?alt=media&token=923ee060-41e0-4a81-bb96-877ad57e1892',
        warranties: [
          {
            icon: 'internet',
            title: 'Protection de vos achats sur internet',
            name: 'Achat sur internet',
            exclusivity: false,
          },
          {
            icon: 'insurance-lost-wallet',
            title: 'Protection des moyens de paiement',
            name: 'Protection des moyens de paiement',
            exclusivity: true,
          },
        ],
      },
      {
        name: 'Dommage téléphone et tablette ',
        title: 'Protection contre les dommages accidentels de votre téléphone et/ou tablette ',
        detail:
          'https://firebasestorage.googleapis.com/v0/b/odb-f622c.appspot.com/o/797F.pdf?alt=media&token=923ee060-41e0-4a81-bb96-877ad57e1892',
        warranties: [
          {
            icon: 'insurance-phone-first',
            title: 'Couverture contre vol et dommages accidentels jusqu’à 350€/an',
            name: 'Protection vol et dommages téléphone et tablette',
            exclusivity: true,
          },
        ],
      },
    ],
    discounts: [
      {
        discountName: 'Pack Premium launching campaign',
        discountDescription: '3 mois gratuit MVP',
        discountValue: {
          type: 'FIXED_PRICE',
          value: 3.4,
        },
        discountApplicationRules: {
          matchingTags: ['launchingCampaign'],
          matchingCustomerType: [CustomerType.LEAD, CustomerType.DEFAULT],
          duration: DurationType.FIXED,
          campaignStart: '06/01/2021',
          campaignEnd: '08/31/2021',
          nbIndex: 3,
        },
        cumulative: false,
      },
      {
        discountName: 'Special subscribers - Pack Premium launching campaign',
        discountDescription: '3 mois gratuit MVP',
        discountValue: {
          type: 'FIXED_PRICE',
          value: 1.4,
        },
        discountApplicationRules: {
          matchingTags: ['launchingCampaign'],
          matchingCustomerType: [CustomerType.VIP, CustomerType.COLLABORATOR],
          duration: DurationType.FIXED,
          campaignStart: new Date('06-01-2021'),
          campaignEnd: new Date('08-31-2021'),
          nbIndex: 3,
        },
        cumulative: false,
      },
      {
        discountName: 'Oney collaborator discount',
        discountDescription: 'Premier at a Classic price discount for Oney collaborators',
        discountValue: {
          type: 'FIXED_PRICE',
          value: 2.5,
        },
        discountApplicationRules: {
          matchingTags: [],
          matchingCustomerType: [CustomerType.COLLABORATOR],
          duration: DurationType.UNLIMITED,
          campaignStart: null,
          campaignEnd: null,
          nbIndex: null,
        },
        cumulative: true,
      },
      {
        discountName: 'VIP discount',
        discountDescription: 'Premier at a Classic price discount for VIP members',
        discountValue: {
          type: 'FIXED_PRICE',
          value: 2.5,
        },
        discountApplicationRules: {
          matchingTags: [],
          matchingCustomerType: [CustomerType.VIP],
          duration: DurationType.UNLIMITED,
          campaignStart: null,
          campaignEnd: null,
          nbIndex: null,
        },
        cumulative: true,
      },
    ],
  },
  {
    id: '12a5f819-89c9-48ff-a524-6c1e73be2457',
    name: 'Carte visa classic',
    ref: OfferRef.PHYS_CLASSIC,
    type: OfferType.VISA_CLASSIC,
    category: OfferCategory.STANDALONE,
    description: 'Une carte VISA Classic et une couverture étendue pour 5,90 € par mois',
    price: 2.0,
    freeWithdrawal: 0,
    periodicity: 'monthly',
    theme: {
      primary: null,
      secondary: null,
    },
    offersIncentives: [],
    card: {
      cardType: CardType.PHYSICAL_CLASSIC,
      cardImg: 'carte/classique',
      blocked: false,
      foreignPayment: true,
      internetPayment: true,
      atmWeeklyAllowance: 2.5,
      atmMonthlyAllowance: 5,
      price: 2.0,
      assistance: [
        {
          icon: 'common/ico-library/0120-visa-assistance',
          title: 'Couverture médicale d’urgence',
          exclusivity: false,
          details:
            '24h/24 dans le monde entier en cas de blessure ou de maladie, je peux contacter mon assistance médicale par téléphone ou via le site internet (information dans ma notice).',
        },
      ],
    },
    insurances: [],
    discounts: [
      {
        discountName: 'VISA Classic launching campaign',
        discountDescription: '3 mois gratuit MVP',
        discountValue: {
          type: 'FIXED_PRICE',
          value: 2,
        },
        discountApplicationRules: {
          matchingTags: ['launchingCampaign'],
          matchingCustomerType: [
            CustomerType.VIP,
            CustomerType.COLLABORATOR,
            CustomerType.LEAD,
            CustomerType.DEFAULT,
          ],
          duration: DurationType.FIXED,
          campaignStart: new Date('06-01-2021'),
          campaignEnd: new Date('08-31-2021'),
          nbIndex: 3,
        },
        cumulative: false,
      },
      {
        discountName: 'Oney collaborator discount',
        discountDescription: 'Free of charge for Oney collaborators',
        discountValue: {
          type: 'RATE',
          value: 1,
        },
        discountApplicationRules: {
          matchingOffers: ['Account management fees', 'Pack Oney+', 'VISA Classic'],
          matchingTags: [],
          matchingCustomerType: [CustomerType.COLLABORATOR],
          duration: DurationType.UNLIMITED,
          campaignStart: null,
          campaignEnd: null,
          nbIndex: null,
        },
        cumulative: true,
      },
      {
        discountName: 'VIP discount',
        discountDescription: 'Free of charge for VIP members',
        discountValue: {
          type: 'RATE',
          value: 1,
        },
        discountApplicationRules: {
          matchingOffers: ['Account management fees', 'Pack Oney+', 'VISA Classic'],
          matchingTags: [],
          matchingCustomerType: [CustomerType.VIP],
          duration: DurationType.UNLIMITED,
          campaignStart: null,
          campaignEnd: null,
          nbIndex: null,
        },
        cumulative: true,
      },
    ],
  },
  {
    id: '3c268607-8e11-4781-8293-cb3191bbc90d',
    name: 'Carte visa premier',
    type: OfferType.VISA_PREMIER,
    ref: OfferRef.PHYS_PREMIER,
    category: OfferCategory.STANDALONE,
    description: 'Une carte VISA Premier et une couverture étendue pour 5,90 € par mois',
    price: 4.9,
    freeWithdrawal: 0,
    periodicity: 'monthly',
    offersIncentives: [],
    card: {
      cardType: CardType.PHYSICAL_PREMIER,
      cardImg: 'carte/premier',
      blocked: false,
      foreignPayment: true,
      internetPayment: true,
      atmWeeklyAllowance: 2.5,
      atmMonthlyAllowance: 5,
      price: 4.9,
      assistance: [
        {
          icon: 'visa-assistance',
          title: 'Couverture médicale d’urgence',
          exclusive: false,
          promotional: false,
          details:
            '24h/24 dans le monde entier en cas de blessure ou de maladie, je peux contacter mon assistance médicale par téléphone ou via le site internet (information dans ma notice).',
        },
        {
          icon: 'visa-annulation vol',
          title: 'Garantie annulation ou retard transport',
          exclusive: false,
          promotional: false,
          details:
            'Si pour des raisons personnelles (maladie, accident, ...) ou professionnelles éligibles vous devez annuler ou modifier votre voyage, vous pouvez bénéficier d’une indemnisation allant jusqu’à 5 000 € par an.',
        },
        {
          icon: 'visa-vol-bagage',
          title: 'Couverture vol de bagages',
          exclusive: false,
          promotional: false,
          details:
            'Que vous preniez l’avion ou le train, en cas de retard de vos bagages, bénéficiez d’une indemnité allant jusqu’à 400 € TTC pour vos dépenses de première nécessité (vêtements, articles de toilette).',
        },
        {
          icon: 'visa-location-voiture',
          title: 'Garantie location de voiture',
          exclusive: false,
          promotional: false,
          details:
            'Si vous avez un accident avec votre voiture de location, le montant des réparations ou de remise en état du véhicule de location restant à votre charge en application du contrat de location est remboursé (sans franchise).',
        },
        {
          icon: 'visa-rapatriement',
          title: 'Assistance médicale rapatriement',
          exclusive: false,
          promotional: false,
          details:
            'Si pour des raisons personnelles (maladie, accident, ...) ou professionnelles éligibles vous devez interrompre votre voyage, vous pouvez bénéficier d’une indemnisation allant jusqu’à 5 000 € par an.',
        },
      ],
    },
    insurances: [],
    discounts: [
      {
        discountName: 'VISA Premier launching campaign',
        discountDescription: '3 mois gratuit MVP',
        discountValue: {
          type: 'FIXED_PRICE',
          value: 3.9,
        },
        discountApplicationRules: {
          matchingTags: ['launchingCampaign'],
          matchingCustomerType: [
            CustomerType.VIP,
            CustomerType.COLLABORATOR,
            CustomerType.LEAD,
            CustomerType.DEFAULT,
          ],
          duration: DurationType.FIXED,
          campaignStart: new Date('06-01-2021'),
          campaignEnd: new Date('08-31-2021'),
          nbIndex: 3,
        },
        cumulative: false,
      },
      {
        discountName: 'VIP discount',
        discountDescription: 'Premier at a Classic price discount for VIP members',
        discountValue: {
          type: 'FIXED_PRICE',
          value: 2.5,
        },
        discountApplicationRules: {
          matchingTags: [],
          matchingCustomerType: [CustomerType.VIP],
          duration: DurationType.UNLIMITED,
          campaignStart: null,
          campaignEnd: null,
          nbIndex: null,
        },
        cumulative: true,
      },
      {
        discountName: 'Oney collaborator discount',
        discountDescription: 'Premier at a Classic price discount for Oney collaborators',
        discountValue: {
          type: 'FIXED_PRICE',
          value: 2.5,
        },
        discountApplicationRules: {
          matchingTags: [],
          matchingCustomerType: [CustomerType.COLLABORATOR],
          timeline: DurationType.UNLIMITED,
          campaignStart: null,
          campaignEnd: null,
          duration: null,
        },
        cumulative: true,
      },
    ],
  },
  {
    id: '29540f78-db46-4a2b-8ff5-49d982773d51',
    name: 'Account management fee',
    type: OfferType.ACCOUNT_FEE,
    ref: OfferRef.ACCOUNT_FEE,
    category: OfferCategory.STANDALONE,
    description: 'Frais de gestion de compte',
    price: 1.5,
    freeWithdrawal: 0,
    periodicity: 'monthly',
    offersIncentives: [],
    card: null,
    insurances: [],
    discounts: [
      {
        discountName: 'Account management fees launching campaign',
        discountDescription: '3 mois gratuit MVP',
        discountValue: {
          type: 'FIXED_PRICE',
          value: 1.5,
        },
        discountApplicationRules: {
          matchingTags: ['launchingCampaign'],
          matchingCustomerType: [
            CustomerType.VIP,
            CustomerType.COLLABORATOR,
            CustomerType.LEAD,
            CustomerType.DEFAULT,
          ],
          duration: DurationType.FIXED,
          campaignStart: new Date('06-01-2021'),
          campaignEnd: new Date('08-31-2021'),
          nbIndex: 3,
        },
        cumulative: false,
      },
      {
        discountName: 'Oney collaborator discount',
        discountDescription: 'Free of charge for Oney collaborators',
        discountValue: {
          type: 'RATE',
          value: 1,
        },
        discountApplicationRules: {
          matchingTags: [],
          matchingCustomerType: [CustomerType.COLLABORATOR],
          duration: DurationType.UNLIMITED,
          campaignStart: null,
          campaignEnd: null,
          nbIndex: null,
        },
        cumulative: true,
      },
      {
        discountName: 'VIP discount',
        discountDescription: 'Free of charge for VIP members',
        discountValue: {
          type: 'RATE',
          value: 1,
        },
        discountApplicationRules: {
          matchingTags: [],
          matchingCustomerType: [CustomerType.VIP],
          duration: DurationType.UNLIMITED,
          campaignStart: null,
          campaignEnd: null,
          nbIndex: null,
        },
        cumulative: true,
      },
    ],
  },
];
