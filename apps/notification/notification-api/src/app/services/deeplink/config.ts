import { http } from '../http';

export function firebaseHttpClient(fireBaseConfig) {
  return http.setBaseUrl(fireBaseConfig.url);
}
