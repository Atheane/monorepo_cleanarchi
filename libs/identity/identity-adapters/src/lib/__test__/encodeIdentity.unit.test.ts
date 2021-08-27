/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  AuthErrors,
  DecodeIdentity,
  EncodeIdentity,
  IdentityProvider,
  ServiceName,
} from '@oney/identity-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import * as path from 'path';
import { configureIdentityLib, getServiceHolderIdentity } from '../di/build';

const container = new Container();
const jwtSecret = 'weshpoto';

const azureAdTokenWithGroup =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJhcGk6Ly83MTBmMWRhNS1lYzNjLTQ0MzUtYTYyMS04YmQ2MjA0MjgwNzgiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xY2JjZmM1Yi1iZmM0LTQ2Y2YtOWRkMS1iNjExNDAzMDliOTkvIiwiaWF0IjoxNjEyMjU0NjI0LCJuYmYiOjE2MTIyNTQ2MjQsImV4cCI6MTYxMjI1ODUyNCwiYWlvIjoiRTJaZ1lQRE5YbEZ4dHBXMXlETG9yNlB4NlZ1bkFBPT0iLCJhcHBpZCI6IjJmY2MzNWE3LTZlNDktNDQzNC1hMDgwLTZiNTczNTJjN2EyMyIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzFjYmNmYzViLWJmYzQtNDZjZi05ZGQxLWI2MTE0MDMwOWI5OS8iLCJvaWQiOiI2ZmFkZTUwZi1lZjIzLTQyZjYtYjNlOC1hYjJmOWIxMDdmODYiLCJyaCI6IjAuQVJFQVdfeThITVNfejBhZDBiWVJRRENibWFjMXpDOUpialJFb0lCclZ6VXNlaU1SQUFBLiIsInJvbGVzIjpbImF1dGhlbnRpY2F0aW9uLndyaXRlLmFsbCIsImF1dGhlbnRpY2F0aW9uLndyaXRlLnNlbGYiLCJhdXRoZW50aWNhdGlvbi5yZWFkLmFsbCIsImF1dGhlbnRpY2F0aW9uLnJlYWQuc2VsZiJdLCJzdWIiOiI2ZmFkZTUwZi1lZjIzLTQyZjYtYjNlOC1hYjJmOWIxMDdmODYiLCJ0aWQiOiIxY2JjZmM1Yi1iZmM0LTQ2Y2YtOWRkMS1iNjExNDAzMDliOTkiLCJ1dGkiOiJleHFLTHZjRy1FYUFyRzVfREUxNkFBIiwidmVyIjoiMS4wIn0.AWI6AwDt1cVNcVwudKcKJsnimhSvBfUqTLzkXawE4QncaxTPPAN7JG-h3evDkRs7n8sr_uxEzeZWaxV94J2OQZ0sN7HtvsmIu0cnISK-ouGm41vEioxf_f303EEKi2y8YJDVT3tXHAyFx48bWiZCMh713ZgjDlBJXMSySSyFnxWOJZbxZYpHD6zsl5_J8Qmr_NnMkP-U0lnmRoJoB-vNP-4XavpBd0JVYwmd8lysHPaIGWf8wXLmEhTGOHdYGNkhp1_im3C4DC6s-FW7IQfp6uAh80hJ4In0IesfYj9MvqsYbLW4D2fTyU4nz0uVJzBnyzx-3EJDD3ZwpIpv63G87A';

describe('Encode identity unit testing', () => {
  let encodeIdentity: EncodeIdentity;
  let decodeIdentity: DecodeIdentity;
  let saveFixture: Function;

  beforeAll(async () => {
    await configureIdentityLib(container, {
      azureTenantId: '1cbcfc5b-bfc4-46cf-9dd1-b61140309b99',
      jwtOptions: {
        ignoreExpiration: true,
      },
      secret: jwtSecret,
      serviceName: 'hello',
      azureClientIds: {
        oney_compta: '9efeb2ac-60a8-4e66-8d61-20aa36b56762',
        pp_de_reve: '2fcc35a7-6e49-4434-a080-6b57352c7a23',
      },
      applicationId: '710f1da5-ec3c-4435-a621-8bd620428078',
    });
    encodeIdentity = container.get(EncodeIdentity);
    decodeIdentity = container.get(DecodeIdentity);
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    /**
     * nock back available modes:
     * - wild: all requests go out to the internet, don't replay anything, doesn't record anything
     * - dryrun: The default, use recorded nocks, allow http calls, doesn't record anything, useful for writing new tests
     * - record: use recorded nocks, record new nocks
     * - lockdown: use recorded nocks, disables all http calls even when not nocked, doesn't record
     * @see https://github.com/nock/nock#modes
     */
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(() => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }
  });

  it('Should encode a user identity', async () => {
    const result = await encodeIdentity.execute({
      uid: 'aze',
      email: 'aze',
      provider: IdentityProvider.odb,
    });
    expect(result).toBeTruthy();
    const decode = await decodeIdentity.execute({
      holder: result,
    });
    expect(decode.uid).toEqual('aze');
    expect(decode.provider).toEqual(IdentityProvider.odb);
  });

  it('Should encode a user service identity', async () => {
    const result = await getServiceHolderIdentity(container, ServiceName.payment);
    expect(result).toBeTruthy();
    const decode = await decodeIdentity.execute({
      holder: result,
    });
    expect(decode.uid).toEqual(ServiceName.payment);
    expect(decode.provider).toEqual(IdentityProvider.odb);
  });

  it('Should encode a azure ad and sign a user identity', async () => {
    const decode = await decodeIdentity.execute({
      holder: azureAdTokenWithGroup,
    });
    const result = await encodeIdentity.execute({
      providerId: decode.uid,
      uid: 'userId',
      email: 'aze',
      provider: IdentityProvider.azure,
    });
    const decodedUser = await decodeIdentity.execute({
      holder: result,
    });
    expect(decodedUser.provider).toEqual(IdentityProvider.odb);
  });

  it('Should throw error roles not found for unknown identity', async () => {
    const result = encodeIdentity.execute({
      uid: 'aze',
      email: 'aze',
      provider: IdentityProvider.azure,
    });
    await expect(result).rejects.toThrow(AuthErrors.RolesNotFound);
  });
});
