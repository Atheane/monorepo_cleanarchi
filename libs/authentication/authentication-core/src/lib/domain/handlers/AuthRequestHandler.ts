export interface AuthResponse<T = object> {
  authResponse: T;
  status?: number;
}

export interface AuthRequestHandler {
  handleRequest<T, K = object>(generatedAuthRequest: T): Promise<AuthResponse<K>>;
}
