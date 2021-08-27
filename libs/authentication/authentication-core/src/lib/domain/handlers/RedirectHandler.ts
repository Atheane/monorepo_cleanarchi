import { URL } from 'url';
import { AuthResponsePayload } from '../types/sca/AuthResponsePayload';

export type AuthVerifyConfig<Payload = object, Session = { [x: string]: string[] }> = Session & {
  verifyUrl: URL;
  verifyReqbody: Payload;
};

export interface AuthInitOutput<AssertionResponse> {
  result: AuthResponsePayload<AssertionResponse>;
  cookies: string[];
}

export interface RedirectHandler<T, P, S> {
  handleRedirect(url: URL, userId: string): Promise<AuthInitOutput<T>>;

  handleVerifyRequest?(config: AuthVerifyConfig<P, S>): Promise<AuthResponsePayload<T>>;
}
