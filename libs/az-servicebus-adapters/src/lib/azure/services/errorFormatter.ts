/* istanbul ignore next: */
export function errorFormatter(error: any) {
  /* istanbul ignore next: */
  if (!error) return "FATAL: Error doesn't provided";

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
}
