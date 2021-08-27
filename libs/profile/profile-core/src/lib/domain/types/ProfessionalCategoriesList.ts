export type ProfessionalActivity = {
  code: number;
  label: string;
};

export type ProfessionalCategory = {
  category: string;
  code: number;
  values: ProfessionalActivity[];
};

export const ProfessionalCategoriesList: ProfessionalCategory[] = [
  {
    category: 'Agriculteurs exploitants',
    code: 1,
    values: [
      { code: 11, label: 'Agriculteurs sur petite exploitation' },
      { code: 12, label: 'Agriculteurs sur moyenne exploitation' },
      { code: 13, label: 'Agriculteurs sur grande exploitation' },
    ],
  },
  {
    category: "Artisans, commerçants et chefs d'entreprise",
    code: 2,
    values: [
      { code: 21, label: 'Artisans' },
      { code: 22, label: 'Commerçant et assimilés' },
      { code: 23, label: 'Chefs d’entreprise de 10 salariés ou plus' },
    ],
  },
  {
    category: 'Cadres et professions intellectuelles supérieures',
    code: 3,
    values: [
      { code: 31, label: 'Professions libérales' },
      { code: 33, label: 'Cadres de la fonction publique' },
      { code: 34, label: 'Professeurs, professions scientifiques' },
      { code: 35, label: 'Professions de l’information, des arts et des spectacles' },
      { code: 37, label: 'Cadres administratifs et commerciaux d’entreprise' },
      { code: 38, label: 'Ingénieurs et cadres techniques d’entreprise' },
    ],
  },
  {
    category: 'Professions Intermédiaires',
    code: 4,
    values: [
      { code: 42, label: 'Professeurs des écoles, instituteurs et assimilés' },
      { code: 43, label: 'Professions intermédiaires de la santé et du travail social' },
      { code: 44, label: 'Clergé, religieux' },
      { code: 45, label: 'Professions intermédiaires administratives de la fonction publique' },
      { code: 46, label: 'Professions intermédiaires administratives et commerciales des entreprises' },
      { code: 47, label: 'Techniciens' },
      { code: 48, label: 'Contremaîtres, agents de maîtrise' },
    ],
  },
  {
    category: 'Employés',
    code: 5,
    values: [
      { code: 52, label: 'Employés civils et agents de service de la fonction publique' },
      { code: 54, label: 'Employés administratifs d’entreprise' },
      { code: 55, label: 'Employés de commerce' },
      { code: 56, label: 'Personnels des services directs aux particuliers' },
    ],
  },
  {
    category: 'Ouvriers',
    code: 6,
    values: [
      { code: 62, label: 'Ouvriers qualifiés de type industriel' },
      { code: 63, label: 'Ouvriers qualifiés de type artisanal' },
      { code: 64, label: 'Chauffeurs' },
      { code: 65, label: 'Ouvriers qualifiés de la manutention, du magasinage et du transport' },
      { code: 67, label: 'Ouvriers non qualifiés de type industriel' },
      { code: 68, label: 'Ouvriers non qualifiés de type artisanal' },
      { code: 69, label: 'Ouvriers agricoles' },
    ],
  },
  {
    category: 'Retraités',
    code: 7,
    values: [
      { code: 71, label: 'Anciens agriculteurs exploitants' },
      { code: 72, label: 'Anciens artisans, commerçants et chefs d’entreprise' },
      { code: 74, label: 'Anciens cadres' },
      { code: 75, label: 'Anciennes professions intermédiaires' },
      { code: 77, label: 'Anciens employés' },
      { code: 78, label: 'Anciens ouvriers' },
    ],
  },
  {
    category: 'Autres personnes sans activité professionnelle',
    code: 8,
    values: [
      { code: 81, label: 'Chômeurs n’ayant jamais travaillé' },
      { code: 84, label: 'Élèves, étudiants' },
      {
        code: 85,
        label: 'Personnes diverses sans activité professionnelle de moins de 60 ans (sauf retraités)',
      },
      {
        code: 86,
        label: 'Personnes diverses sans activité professionnelle de 60 ans et plus (sauf retraités)',
      },
    ],
  },
];
