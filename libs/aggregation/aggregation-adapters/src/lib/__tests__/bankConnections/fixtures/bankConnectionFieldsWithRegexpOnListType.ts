export const bankConnectionFields = {
  connectionId: 'connectionId',
  userId: 'userId',
  connectionState: null,
  connection: {
    id: 1554,
    id_user: 2662,
    id_connector: 59,
    last_update: null,
    created: '2020-08-13 10:58:35',
    active: true,
    last_push: null,
    next_try: '2020-08-14 16:16:36',
    state: 'decoupled',
    error: 'decoupled',
    error_message: 'You need to confirm the connection on your bank website',
    expire: null,
    id_provider: 59,
    id_bank: 59,
    connector_uuid: '338178e6-3d01-564f-9a7b-52ca442459bf',
    description: 'You need to confirm the connection on your bank website',
    id_connection: 1554,
    fields: [
      {
        name: 'website',
        label: 'Type de compte',
        regex: '^[0-9]+$',
        type: 'list',
        required: false,
        auth_mechanisms: ['credentials'],
        connector_sources: ['directaccess'],
        values: [
          {
            label: 'Particuliers',
            value: 'par',
          },
          {
            label: 'Professionnels',
            value: 'pro',
          },
          {
            label: 'Entreprises',
            value: 'ent',
          },
        ],
      },
      {
        name: 'login',
        label: 'Code client',
        regex: '^[0-9]+$',
        type: 'text',
        required: true,
        auth_mechanisms: ['credentials'],
        connector_sources: ['directaccess'],
      },
      {
        name: 'password',
        label: 'Code secret',
        regex: '^[0-9]+$',
        type: 'password',
        required: true,
        auth_mechanisms: ['credentials'],
        connector_sources: ['directaccess'],
      },
    ],
  },
};