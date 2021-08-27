# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.6.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-messages@0.5.0...@oney/authentication-messages@0.6.0) (2021-04-14)


### Bug Fixes

* **auth:** pr comment - typo + remove unnecessary boolean ([27d6a50](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/27d6a5045ab434cdf4f632195fc10b3c8e717b7e))


### Features

* **auth:** dispatch signature verification error event ([5a1adb3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5a1adb34af95ac61a45acf19b2a9a6bfa8e934f1))
* **auth:** send email error notification on auth signature verification failed event ([7014c4d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7014c4ded076675e89cbd15252976afb0616c49a))





# [0.5.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-messages@0.4.0...@oney/authentication-messages@0.5.0) (2021-04-07)


### Bug Fixes

* **authentication:** enhance codebase, add ability to toggle password and block api ([450a079](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/450a07976138b43088593a92ac102a1e273ab244))


### Features

* **authentication:** add ability to ban a user ([1eba00d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1eba00d9e966020726bf01bd4d73caf49f716074))
* **authentication:** adding password ([1a44824](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1a44824bc54906541d30bd96b1cfcc4a080bd155))
* **authentication:** wIP adding user password mode ([6595376](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6595376531d366900d0bb23ace465f359b22997d))





# [0.4.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-messages@0.3.0...@oney/authentication-messages@0.4.0) (2021-04-07)


### Bug Fixes

* **auhtentication:** pr comment - remove saving failed card provisioning to db + remove event ([be003d2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/be003d2504599c0c3de76f680105a27faf1250b4))
* **auth:** pr comment - pass device id in trusted device reset event ([2ed0864](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2ed08640cd2d05e65a830604b4333dd9c440bbe0))
* **authentication:** fix pr comments ([94b1236](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/94b12365277967157e6d026d506ec5667604c793))
* **authentication:** fix pr comments ([a3f97ed](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a3f97ed8e8af47bd8d6e2c238a62c9b5a130ca9f))
* **authentication:** pr comment - add device trusted and trusted device reset domain event ([0d846d4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0d846d4fc99cee38263b0c64f5fcf6b33493b2a4))
* **authentication:** pr comment - add user sign in domain event ([a7a660f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a7a660fedd71bfeb0a9e167a8fca4b9c824a8bc2))
* **authentication:** pr comment - create gateways to hide provisionings implementation details ([d2a2743](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d2a27436fa00806ccb210a99950d38eb20b7f80a))
* **authentication:** pr comment - remove phone set true event to put logic i phone provisioned event ([61a962d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/61a962da59f1fcbf6efe2b47933c4b2a06c4a8ba))
* **authentication:** pr comment - remove unused event ([50fd69f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/50fd69f7e642bfba1f9049c24aba5599ddc5d0c0))
* **authentication:** pr comment - rename card provision aggregate method and associated event ([96d580e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/96d580e7b5d130d67bbdd67dcb92a3d660634e8f))
* **authentication:** pr comment - rename enum ([46ddb8d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/46ddb8d623b73e78ca56dcf53f6a0b40dcb9d84a))
* **authentication:** pr comment - rename phone provisioning aggregate method and associated event ([2b0a39e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2b0a39e5ad793dd5a7826a6b36a9ffb811f81737))
* **authentication:** pr comment - renaming ([c8aa2f1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c8aa2f11791a64a0da18a4732ad63b8111146f74))
* **authentication:** pr comment - signed up event and aggregate root metadata auto mngt ([d5c321a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d5c321adb9f65215aef82025a39181b6b408c817))
* **authentication:** pr comments - remove state ([cc3c3c8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cc3c3c84ce95a2155f619468377e2180666e4606))
* **authentication:** send card provisioning fail event for error notification ([ea7055e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ea7055e0d74703353b0ea50fdfcafe393170dada))


### Features

* **authentication:** add card provisioning main events ([9005473](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/900547346683e7d8c39fcd74eff57dc78538990d))
* **authentication:** add error notification on on user not found on phone provisioning ([7cbd744](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7cbd744741545b457e595026cfe2a6e66aabfa6e))
* **authentication:** add phone provisioning events ([cde71d0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cde71d04bd9e8301c3dc42469422d8da36c2d5e1))
* **authentication:** add provisioning error notification recipient ([7685ad5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7685ad5afff21e53a1cb2b59e27dd3a824956c9c))
* **authentication:** add user created domain event ([d37a739](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d37a739e5c2264d4f8b7c746965f0a0a85e071e3))
* **authentication:** dispatch  phone provisioning error event with specific error ([332cd66](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/332cd66202d340c16d8c150478ca18de8613c1dd))
* **authentication:** migrate user card acs provisioning to lib env events and handlers ([40ee676](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/40ee67636f3c7118d527077e63988eff5dc5bde0))
* **authentication:** transform phone field into a string to store number ([63c54f6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/63c54f6d839faad6a87c19c5c9d015acb8028a37))
* **notification:** create send  provisioning error use case and  notification template ([10030ca](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/10030ca059c285b9f92d211809fae9342da01671))


### BREAKING CHANGES

* **authentication:** user.phone is now a string type instead of a boolean





# [0.3.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-messages@0.2.0...@oney/authentication-messages@0.3.0) (2021-03-30)


### Features

* **oney-messages:** added some solution to be compatible with legacy ([cfbb857](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cfbb8575710f76c0c3b6f1a394687899acc35a68))
* **oney-messages:** fixed some tests ([e2252cf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e2252cf0279c098749cd99f3c5d7362eca0a7cad))





# [0.2.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-messages@0.8.0...@oney/authentication-messages@0.2.0) (2021-03-11)


### Features

* **credit:** add eligibility handler ([3549b89](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3549b8929246e990a17603f3c9a7555d3b7f30c3))





# 0.8.0 (2021-03-10)


### Features

* **authentication-azf:** add domain event on user.delete() ([b2b9f92](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b2b9f924a8c1afd24f395a037b10e948ffb500af))
* **authentication-azf:** getUsersByProvider usecase - implem in memory ([30f5cc6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/30f5cc6c0b228af8f4543751611d566a69c66143))





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
