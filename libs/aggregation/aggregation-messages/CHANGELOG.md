# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.10.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-messages@0.9.0...@oney/aggregation-messages@0.10.0) (2021-04-29)


### Features

* **aggregation-core:** and message, add usecase to send data to CDP ([12df3a2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/12df3a28c8145eb21e103a9c9b3dadc81618a6cb))





# [0.9.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-messages@0.8.0...@oney/aggregation-messages@0.9.0) (2021-04-03)


### Bug Fixes

* **aggregation:** fix merge conflicts ([98d52d2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/98d52d2a6900a265d520930ec015b8f6875c260c))
* **profile-core:** fix 500 if birthdate not given in verify-bank_account-owner ([1a7319b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1a7319b1ae44dd9561ddc1187faf63abbe72a543))


### Features

* **aggregation:** add check if user is owner logic ([50d9511](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/50d95111beaa0c9224a69fec54431183c3484b10))
* **aggregation:** change prop label for BankAccountAggregated ([312e91c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/312e91ce41f2b0b670615044d8a56b34d5c64668))





# [0.8.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-messages@0.7.0...@oney/aggregation-messages@0.8.0) (2021-03-30)


### Features

* **oney-messages:** added some solution to be compatible with legacy ([cfbb857](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cfbb8575710f76c0c3b6f1a394687899acc35a68))





# [0.7.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-messages@0.6.0...@oney/aggregation-messages@0.7.0) (2021-02-16)


### Features

* **aggregation:** update bankconnection deleted and updated events payload structure ([ad6e550](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ad6e55021ea1f8957a19179423eaca8202ba30ca))





# [0.6.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-messages@0.5.0...@oney/aggregation-messages@0.6.0) (2021-02-11)


### Features

* **notification-api:** fix connectionId in BankConnectionDeletedHandler (wrong id was taken) ([3b6e508](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3b6e50843c66788107b2c0d5fdd0a9a360d663fb))





# [0.5.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-messages@0.4.0...@oney/aggregation-messages@0.5.0) (2021-02-11)


### Bug Fixes

* **fix comment:** fix comment ([8d58da5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8d58da5a7e7a6aaa329488feb2007a4513e8889d))
* **fix conflict:** fix conflict ([bc0e7d2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bc0e7d2ba9a32b8954540ddfcb97bd25aed0aeb4))


### Features

* **aggregation:** add REFRESH_AGGREGATED_TRANSACTIONS ([74a5a60](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/74a5a60f635195b35e2386138351ab9126b9f986))
* **aggregation:** bANK_ACCOUNT_AGGREGATED delete unused prop aggregated ([774b73f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/774b73f4e628830544df74c3b6eaf952fea59b8c))
* **aggregation:** delete unused event ([16b81fd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/16b81fd37b11ffe5a8012ef6d1d137a986a0278a))
* **aggregation:** delete unused event ([16d254e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/16d254e56193081fe2ce47ad60bd111b3dcbd963))
* **aggregation:** rebame event to AGGREGATED_TRANSACTIONS_UPDATED ([358bfcb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/358bfcbacd93a1902a52ab9d580cf921176b841c))
* **fixing checkmarx:** fixing checkmarx ([92a4fb4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/92a4fb4138d708ee4bdbe24d8316c0ab114609a6))





# [0.4.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-messages@0.3.0...@oney/aggregation-messages@0.4.0) (2021-02-08)


### Features

* **aggregation:** dispatch a domain event BANK_ACCOUNT_AGGREGATED ([6399757](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6399757f1a086959be97ddfdcfaac994aad43330))
* **aggregation:** solve merge conflicts and add enum in notification/aggregation ([a6bd41e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a6bd41ee364fb09bd5785ee9dda13b4e616db1dc))
* **aggregation-messages:** add enum for events ([0639435](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0639435e03efebfb9b30750f849f6a60e9d27fe5))





# [0.3.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-messages@0.2.0...@oney/aggregation-messages@0.3.0) (2021-02-08)


### Features

* **aggregation:** fix merge conflicts with libs message ([921c26f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/921c26f6da933a9fc73df5fe91ebe9e1aebffb3c))





# [0.2.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-messages@0.1.0...@oney/aggregation-messages@0.2.0) (2021-02-06)


### Features

* **docs:** add living documentation ([aae039d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aae039d3d6feb08515853023e058ce7fd59a6c11))





# 0.1.0 (2021-02-06)


### Bug Fixes

* **fix bi event:** fix bi event ([5f48a33](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5f48a3381837e13acfacc43a2b5f1b1a5fc8cfc9))
* **fix comment:** fix comment ([1e909ca](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1e909ca3e958eeb193da881e03edc93e61c14dcf))
* **fix comment:** fix comment ([fec59b9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fec59b94e3ca7d8de530ff32f7f040fcc1c75e8c))
* **fix comment:** fix comment ([d0b3410](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d0b3410edc53aac5a6ae2f0b663fce87c0edfe96))
* **fix coverage:** fix coverage ([0c240b7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0c240b7a785c89ea3f9adcc79509cca3cafd7da9))
* **fix lint:** fix lint ([3fa0c17](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3fa0c17bc23d51d67d1d2a8e762cc7476304490b))
* **fix wording for accountsynch:** fix wording for accountSync ([f853af3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f853af3ec3e66c33a035be909fa1ba3fea077c2d))
* **harmonize typing:** harmonize typing ([3843458](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3843458ea24ba3f00d6a6450b3a526653ef8ac2e))


### Features

* **adding event libs:** adding event libs message for aggreg payment profile ([fe86f03](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fe86f03a9b54241aa374ac770bfae3926621b956))
