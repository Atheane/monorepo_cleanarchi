# applicationinsights-enhanced

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test applicationinsights-enhanced` to execute the unit tests via [Jest](https://jestjs.io).

## how to use this lib

```
import { ExpressAppInsightsMiddleware } from '@oney/applicationinsights-enhanced';
const appInsightsMiddleware = new ExpressAppInsightsMiddleware();
const configuration = appInsightsMiddleware
    .configure(app, {
        instrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY',
        trackBodies: true,
    })
    .start();
```
