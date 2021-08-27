import { AuthIdentifier, Email, User, UserRepository } from '@oney/authentication-core';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { Container } from 'inversify';

export const userPhoneProvisioned = new User({
  email: Email.from('q1@hello.com'),
  uid: 'uid234',
  pinCode: null,
  phone: '0612345678',
  provisioning: {
    partnerUid: '12869@uid234',
    phone: {
      success: true,
      date: new Date(),
    },
  },
});

export async function getUserPhoneProvisionedToken(container: Container) {
  const encodeIdentity = container.get(EncodeIdentity);
  const userRepository = container.get<UserRepository>(AuthIdentifier.userRepository);
  const registerUser = await userRepository.save(userPhoneProvisioned);
  const { uid, email } = registerUser.props;
  const command = { uid, email: email.address, provider: IdentityProvider.odb };
  return await encodeIdentity.execute(command);
}

const operationReturnCodeOk = '0';

export const consultResponseFixture = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Header><peg:groupContext xmlns:peg="http://www.bpce.fr/xsd/peg/PEG_v0"><peg:requestContext><peg:requestId>270b2f3f-3e60-4217-be72-5e100d575cee</peg:requestId><peg:consumerContext><peg:application><peg:name>ONEY</peg:name><peg:version>1.0</peg:version><peg:organisation>bpce</peg:organisation></peg:application><peg:run><peg:companyCode>12869</peg:companyCode></peg:run></peg:consumerContext></peg:requestContext></peg:groupContext></soap:Header><soap:Body><ns2:consulterClientResponse xmlns:ns2="http://mod_ICG_refAuth_Lib_Export/mod_ICG_refAuth" xmlns:ns3="http://www.bpce.fr/xsd/peg/PEG_v0"><RepnCnsltClnt><BlocRetr><CdTypeRetr>${operationReturnCodeOk}</CdTypeRetr></BlocRetr><BlcDonnClnt><RefrClntProv>12869@test_consult_user</RefrClntProv><NmUsgClnt> LASTNAMEX FIRSTNAMEX</NmUsgClnt></BlcDonnClnt><ListAppliProv><CdAppliProv>ACS_12869</CdAppliProv><IdClntAppli>12869@test_consult_user</IdClntAppli><ListAliasClntAppli><IdAliasClntAppli>66dce2b2abcd29b2d43f3547e84c744a271c98a3ced703c28a2780c1e58eedc7f</IdAliasClntAppli></ListAliasClntAppli></ListAppliProv><ListAppliProv><CdAppliProv>BANKING_FR_12869</CdAppliProv><IdClntAppli>12869@test_consult_user</IdClntAppli><DateDnrAuth>2021-02-09T03:10:54.020Z</DateDnrAuth></ListAppliProv><ListMoyeClnt><CdTypeMoyeAuth>1</CdTypeMoyeAuth><IdClntMoyeAuth>12869@test_consult_user</IdClntMoyeAuth><CdEtatMoyeAuth>D</CdEtatMoyeAuth><MoyeAuth>+33655223300</MoyeAuth><DateMajMoyeAuth>2020-09-21T08:32:27Z</DateMajMoyeAuth></ListMoyeClnt></RepnCnsltClnt></ns2:consulterClientResponse></soap:Body></soap:Envelope> `;

export const provisionResponseFixture =
  '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
  '<soap:Header><peg:groupContext xmlns:peg="http://www.bpce.fr/xsd/peg/PEG_v0">' +
  '<peg:requestContext><peg:requestId>48f01c19-d5ce-4994-bca8-16242b5165b8</peg:requestId>' +
  '</peg:requestContext><peg:consumerContext><peg:application><peg:name>BD-FRA</peg:name><peg:version>1.0</peg:version>' +
  '<peg:organisation>ONEY</peg:organisation></peg:application><peg:run><peg:companyCode>12869</peg:companyCode></peg:run>' +
  '</peg:consumerContext><peg:goalContext/></peg:groupContext></soap:Header><soap:Body>' +
  '<ns2:provisionnerClientResponse xmlns:ns2="http://mod_ICG_refAuth_Lib_Export/mod_ICG_refAuth" xmlns:ns3="http://www.bpce.fr/xsd/peg/PEG_v0">' +
  `<RepnEnrlClnt><BlocRetr><CdTypeRetr>${operationReturnCodeOk}</CdTypeRetr></BlocRetr></RepnEnrlClnt></ns2:provisionnerClientResponse></soap:Body></soap:Envelope>`;

export const encryptedDataWithInvalidPanFixture =
  'DzcLjw41xcKBz3sSEgwmrIgT2shf3pz3+O93BKXhpIPfQ0vvm/sd8D3/N2R0LCw9eD' +
  'rdaGOKRKfA1l/IeC+Ro4Z5lXbrXdvHG0Eghe4gCag2LEbR9CjuSA/Rd0Rd9RuLPL+WbgUu4TzK3kmBE' +
  'uLiz95OHMoT2jmLAAWONLU6QcEpc44F0dhNGTZ7aDu8ewuIG53V8Whsk1Rdl5DEKMVyJ/P4fsTffuUuT' +
  'XoolrHU8apWstZKojthNNYBn5KRI4ACs7086qqCyWpSkknOIhq0vafcAtSHtMs7dgA2kaU8nA7f/Pv+k' +
  'xyIvIIfWROeLUpvjV2MqrAgciO34wUQ6RsVlGeXD6mnybt7zQ4lM9/gWjWvCLnTaEC6XwJUkjPUMicdO' +
  'bjAw/BaP68BC3wNfgHRFmub04tcCeWUewx/L/q+x/MYA6Xz/egfaa8oelsmNOR6B27JRPPZ9mY9Bkg6kF' +
  '9AgXBBDFjV45OHoI2JTMc2vGClKeBGMwhwDvOCPLbCcO02DfYXHZVn/KXIugqNEbdaNbCejO8oVmpJLA3' +
  'G2/D01vKHCN/7iq/vRUt0tSz45JJwh3/WlXHhzmn8yuaxf9Awvd2Erp/xQmj0qop6TEbcqkNyZrx/1Kg' +
  'ciyhz/KKgPS8hTx/VldrJXLfOB4Tsr7ND4lOWlBpDgFLZBiaAY1PFQk8=';

// generated from public key in private key because public in env var seems corrupted (public key it is not used by auth)
export const encryptedDataWithValidPanFixture =
  'oucXWf+8ou3NOOdRLD90jNWZrEhfgCmTKE7g7K2w1YwGtwhycViJRAcYHnHNCYHhLOnVCWLDNsSKCO9Qf0FvYln4h2oYaFvp3bhlUiN4OxYGo4CiTd0yMs9srijwIbUoIeJiwOI8WyN7lOWu7an6kU1003+/DwwZMva0doaubNmRXBMdAIUx89+aywoNofRPcDGQJEKX1Qk75V4tfNJYBG1dQPamsDla7r6H4S96P3p9cxF9RoF+15gsS3vL9fgCSIe6RxjyJJokgJMDdrOSbb3F5RIBYxXqM0NSYCj99+OfjfySgbCnrqH86qljaLgSb2KCL1qXH0ZUvcbIPhsXTta4dvPAnsXZgP54nYwITSvXCe0gXr0iDKk7ftjty7Cl/XruAFJQXe3zDBZiLh/2hT/yaIHshtELWrOJNd8eDXE62jngQ+ySpyaTGpFjGKqUqMb51VLZUTkQ3tbMPUwASr+EmMlOEUOLU4QjtlmBjzAoh96q8qe0h9PsZx+vxqFnOeX2d4lgupbhQY5UhSoko1ZykWkPV6vYW/tB6JWe7FVXDnuTzmcv8m9GTgf8EPvtvRbaKPmj0OEu5e8aFgqTgqqy3tn8SQZIuOKCFkdnKI8k4c8MvJK/5BmB2IhCxmEO523uQjHSQthQ0HobWnHV+Jc7W9vLDw85F044FTCsbzU=';
