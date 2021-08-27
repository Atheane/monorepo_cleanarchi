# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.7.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/messages-core@0.6.0...@oney/messages-core@0.7.0) (2021-04-29)


### Features

* **oney-messages:** added EventHandlerExecution feature ([e4f71ec](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e4f71ec59dc59e300d5a8b63f08f5f89bda9bd53))
* **oney-messages:** renaming and added handlerUniqueIdentifier ([7a057e6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7a057e61f557d391a9750546838f10609d1cefdc))





# [0.6.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/messages-core@0.5.0...@oney/messages-core@0.6.0) (2021-04-29)


### Bug Fixes

* **oney-messages:** added filter condition for rx implementation, improved logs, removed command bad matching ([6ccb8c5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6ccb8c548ffd965ada7cc0dd4e0ddf4db609ca88))
* **oney-messages:** used a single azure message handler by topic ([6fd9e4c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6fd9e4c31f50a7da11f0abdcf01244895fda7c7d))


### Features

* **oney-command:** added scheduledEnqueueTimeUtc option for command dispatch ([4cce2cb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4cce2cb84a1b39ea264b60113634fac4ec87e700))
* **oney-saga:** added command dispatcher on sage execution context ([90610c7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/90610c7df3b05006c577b87a3fa8bc89178d89c6))





# [0.5.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/messages-core@0.4.0...@oney/messages-core@0.5.0) (2021-04-14)


### Features

* **oney-messages:** added AzureServiceBusCommandDispatcher ([17679f1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/17679f15ac5dd26c05f4392c91fc6457e593e130))
* **oney-messages:** added configure feature ([4586b69](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4586b69d83f7231c48f9cab16a12c00d0b60fd51))





# [0.4.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/messages-core@0.3.0...@oney/messages-core@0.4.0) (2021-04-14)


### Features

* **oney-messages:** added ZipEventMessageBodySerializer and DeflateEventMessageBodySerializer ([4e6c933](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4e6c9334b9e30607e3054b6aa476508de89dea0b))





# [0.3.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/messages-core@0.2.0...@oney/messages-core@0.3.0) (2021-04-09)


### Features

* **oney-message:** added custom mapper / serializer option ([3efb2a7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3efb2a70265e6f1997da0bcb3181d7306d274bab))
* **oney-messages:** applied mapper / serializer in the RxServiceBus implementation ([3c0f78d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3c0f78db54ac5a0ca0262ba3213465cd64933f26))





# [0.2.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/messages-core@0.1.0...@oney/messages-core@0.2.0) (2021-04-02)


### Bug Fixes

* **oney-saga:** fixed some review comments and rework some types ([16ed317](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/16ed317010f9c5e620f4be26854c0fc79bed357c))


### Features

* **oney-saga:** added mongo implementation ([b1e4dcf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b1e4dcf04e5d52588f560b38ddf88cc03048f143))
* **oney-saga:** moved in-memory implementations in adapters and added DI resolution for saga ([ea7b6f8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ea7b6f830b33cfcc1f1e8447420d978b2b0c225c))





# 0.1.0 (2021-03-30)


### Features

* **oney-message:** started @oney/message-core ([8d397e1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8d397e1acc95b45ab66e53ae23031d3db8ed50f4))
* **oney-messages:** added event dispatcher and receiver adapters ([eaf2310](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/eaf231002d347e304a88a0c61d014a18a4c198a3))
* **oney-messages:** added in memory multiple handler capability ([da1930d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/da1930d1485e503245396ff3a2def8486830bd2e))
* **oney-messages:** added some solution to be compatible with legacy ([cfbb857](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cfbb8575710f76c0c3b6f1a394687899acc35a68))
