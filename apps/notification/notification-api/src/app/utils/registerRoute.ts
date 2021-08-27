import wrap from './wrap';

/**
 *
 * @param {Object} schema Route validation schema
 * @return {Function} Configured middleware
 */
export function inputValidation(schema) {
  return (req, res, next) => {
    if (!schema) {
      return next();
    }

    const entries = Object.entries(schema);
    for (let i = 0; i < entries.length; i += 1) {
      const [value, schemaEntry] = entries[i];
      const err = (schemaEntry as any).validate(req[value]).error;
      if (err) {
        next(err);
      }
    }

    next();
  };
}

/**
 * Register a route in the express router
 * @param {Object} router The Express router object
 * @param {String} method The route HTTP verb
 * @param {String} path The route path
 * @param {Object} validationSchema The route parameters validation schema
 * @param {Array} middlewares An array containing all the middlewares to set in this route
 * @param {Function} controller The route controller
 */
export function registerRoute(
  router,
  { method, path, validationSchema = undefined, middlewares = [], controller },
) {
  router
    .route(path)
    [method.toLowerCase()](inputValidation(validationSchema), ...middlewares, wrap(controller));
}
