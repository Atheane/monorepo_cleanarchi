# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.6.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/messages-adapters@0.5.0...@oney/messages-adapters@0.6.0) (2021-04-29)


### Bug Fixes

* **oney-commands:** fixed profile test ([87285dc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/87285dcbc63508158a97c6190cfc5174feafb0b1))
* **oney-messages:** adapted match condition to support legacy events ([c198a51](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c198a51c6ea5d48c433aa77436612325b4fbbc92))
* **oney-messages:** added filter condition for rx implementation, improved logs, removed command bad matching ([6ccb8c5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6ccb8c548ffd965ada7cc0dd4e0ddf4db609ca88))
* **oney-messages:** fixed event handler, with multiple subscription filter ([ca537f5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ca537f5168115b2dbf7abe3aca56ff70f9f7460f))
* **oney-messages:** used a single azure message handler by topic ([6fd9e4c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6fd9e4c31f50a7da11f0abdcf01244895fda7c7d))


### Features

* **oney-command:** added scheduledEnqueueTimeUtc option for command dispatch ([4cce2cb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4cce2cb84a1b39ea264b60113634fac4ec87e700))
* **oney-saga:** added command dispatcher on sage execution context ([90610c7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/90610c7df3b05006c577b87a3fa8bc89178d89c6))





# [0.5.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/messages-adapters@0.4.0...@oney/messages-adapters@0.5.0) (2021-04-14)


### Features

* **oney-messages:** added AzureServiceBusCommandDispatcher ([17679f1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/17679f15ac5dd26c05f4392c91fc6457e593e130))
* **oney-messages:** added configure feature ([4586b69](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4586b69d83f7231c48f9cab16a12c00d0b60fd51))





# [0.4.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/messages-adapters@0.3.0...@oney/messages-adapters@0.4.0) (2021-04-14)


### Features

* **oney-messages:** added ZipEventMessageBodySerializer and DeflateEventMessageBodySerializer ([4e6c933](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4e6c9334b9e30607e3054b6aa476508de89dea0b))





# [0.3.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/messages-adapters@0.2.0...@oney/messages-adapters@0.3.0) (2021-04-09)


### Features

* **oney-message:** added custom mapper / serializer option ([3efb2a7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3efb2a70265e6f1997da0bcb3181d7306d274bab))
* **oney-messages:** added missing argument when register handlers ([0ec65bc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0ec65bc68e209361c752cbe97f45443715d51ccb))
* **oney-messages:** applied mapper / serializer in the RxServiceBus implementation ([3c0f78d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3c0f78db54ac5a0ca0262ba3213465cd64933f26))





# [0.2.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/messages-adapters@0.1.0...@oney/messages-adapters@0.2.0) (2021-04-02)


### Features

* **oney-saga:** added configureSaga function ([3902f2e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3902f2ed56b2e1777898a316b4fd9c7cc3bcd147))





# 0.1.0 (2021-03-30)


### Bug Fixes

* **oney-messages:** fixed linter ([d81769b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d81769b15c1547b6e4e191006167a47ebd61145c))
* **oney-messages:** fixed oney handler registration ([b33cbd3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b33cbd30e116284c3d4787f07c486219c6b59021))


### Features

* **oney-message:** started @oney/message-core ([eea1072](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/eea1072fb619c4e6d68fb9b14578541d5daf4daf))
* **oney-message:** started @oney/message-core ([8d397e1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8d397e1acc95b45ab66e53ae23031d3db8ed50f4))
* **oney-messages:** added a Promise.all during the handlre registration ([d10be12](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d10be1260aa25aa8dd1e434ffdfc0b9845228ae2))
* **oney-messages:** added event dispatcher and receiver adapters ([eaf2310](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/eaf231002d347e304a88a0c61d014a18a4c198a3))
* **oney-messages:** added some solution to be compatible with legacy ([cfbb857](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cfbb8575710f76c0c3b6f1a394687899acc35a68))
* **oney-messages:** fixed linter ([d95e0bb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d95e0bbae723389ebfb396d5947b4628614386ca))
* **oney-messages:** fixed some tests ([e2252cf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e2252cf0279c098749cd99f3c5d7362eca0a7cad))
* **oney-messages:** migrated new develop version ([782e25c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/782e25c7e3cc940c0a135406b24cd9acd16dd45e))
