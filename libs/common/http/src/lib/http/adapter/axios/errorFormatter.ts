export function errorFormatter(error: any) {
  if (!error) return "FATAL: Error doesn't provided";

  let obj: any = {
    message: error.message,
  };
  const configWhitelist = [
    'url',
    'headers',
    'method',
    'httpVersion',
    'originalUrl',
    'query',
    'data',
    'params',
  ];

  if (error.config) {
    obj = {
      ...obj,
      config: configWhitelist.reduce((acc, key) => {
        acc[key] = error.config[key];
        return acc;
      }, {}),
    };
  }
  return obj;
}
