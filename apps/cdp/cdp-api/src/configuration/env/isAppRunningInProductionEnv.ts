export function isAppRunningInProductionEnv(): boolean {
  const PRODUCTION_ENV = 'production';
  return process.env.NODE_ENV === PRODUCTION_ENV;
}
