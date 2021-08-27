import { v4 as uuidv4 } from 'uuid';
import * as httpContext from 'express-http-context';

/**
 * Middleware for addding requestId in each request
 * @param {Application} app the express application
 */
export function configureContextIdMiddleware(app) {
  app.use(httpContext.middleware);
  app.use((req, res, next) => {
    httpContext.set('requestId', uuidv4());
    next();
  });
}
