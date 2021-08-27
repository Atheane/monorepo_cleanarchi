# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.21.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.20.1...@oney/aggregation-core@0.21.0) (2021-04-29)


### Bug Fixes

* **aggregation:** merge conflivts on env var ([5a0bc52](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5a0bc52ad46d4a35925826d37736ab802915d33c))
* **aggregation-adapters:** added a missing await ([4e2e8c1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4e2e8c121ce3c5be2f96cb874bfbb570267c48c6))
* **aggregation-adapters:** fix merge conflicts and upload data to Algoan, send to CDP ([dd041a0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/dd041a078fd993954a0cdd2c4456324e5b668f5b))
* **aggregation-adapters:** fixes merge conflicts ([102942f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/102942f9587d6e88be2a154d15d35fd382711d39))


### Features

* **aggregation:** can aggregate or disagregate with the same call ([e049f4d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e049f4d8263befbdd5823ef8ee3af3014c0d3ed1))
* **aggregation:** solve merge conflicts ([b92ceca](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b92cecabb702fa366fb38b138b969aa827512122))
* **aggregation-adapters:** add adapters to bankAccount ([3e64392](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3e643926ad470adc7a9df19486f3afa3b5c66f80))
* **aggregation-adapters:** add handlers and config variables ([607be13](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/607be13eadb73fabfd3a45a0ee58594846defd44))
* **aggregation-adapters:** delete accounts when deleting bank connection ([418a8ce](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/418a8cee6c99f6b17d9a04275c688e43bcffd4f4))
* **aggregation-adapters:** upload data to algoan on EVALUATE_BANK_ACCOUNT_TO_UPCAP_LIMITS ([9ffd729](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9ffd729b12db00b81235d2a65b24559ae00b4629))
* **aggregation-api:** add endpoint to listen to algoan resthook aden_analysis_completed ([8dacf1c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8dacf1cf804bc653476dffd513d0bd1c226d7c5d))
* **aggregation-api:** add restHook endpoint for algoan ([9c604c0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9c604c067918804be64a89cda8cba0d3899f62ce))
* **aggregation-core:** add usecase and handler ([9978ba8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9978ba81f973e8fa84d6eecb97fa2ed4dc19045e))
* **aggregation-core:** and message, add usecase to send data to CDP ([12df3a2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/12df3a28c8145eb21e103a9c9b3dadc81618a6cb))
* **aggregation-core:** save bankAccounts that are aggregated but not in the repo ([7979650](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7979650313cfa92127ad3bc8ba6a732ef5223801))





## [0.20.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.20.0...@oney/aggregation-core@0.20.1) (2021-04-09)

**Note:** Version bump only for package @oney/aggregation-core





# [0.20.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.19.0...@oney/aggregation-core@0.20.0) (2021-04-08)


### Features

* **aggregation:** action base on form only ([4e066ef](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4e066ef5959f2f2d653aaa5469295771c3e45653))
* **aggregation-adapters:** add pp2Reve conenction service and methods in bankConnectionSCAGateway ([efaaca9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/efaaca9b8620cc6d75c90d7aa0b770b35ef4b53b))
* **aggregation-core:** push result on webhook in CompleteSigninWithSca ([965aa9e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/965aa9eed2dbfa4549a6ab2ef2844f9789ee4074))





# [0.19.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.18.1...@oney/aggregation-core@0.19.0) (2021-04-03)


### Bug Fixes

* **aggregation:** fix merge conflicts ([98d52d2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/98d52d2a6900a265d520930ec015b8f6875c260c))
* **aggregation:** fix merge conflicts ([003ec79](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/003ec79b319429a1bc13d3e0dc498053164e2e60))
* **profile-core:** fix 500 if birthdate not given in verify-bank_account-owner ([1a7319b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1a7319b1ae44dd9561ddc1187faf63abbe72a543))


### Features

* **aggregation:** add check if user is owner logic ([50d9511](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/50d95111beaa0c9224a69fec54431183c3484b10))
* **aggregation:** add long polling to get owner identity data ([6e55660](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6e5566094329e54d24551756f707faaf2c3e846c))
* **aggregation:** change prop label for BankAccountAggregated ([312e91c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/312e91ce41f2b0b670615044d8a56b34d5c64668))
* **aggregation:** check user identity when aggregatedAccount ([17478ac](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/17478ac61cd2801537a42a31aa94dc8381df3100))
* **aggregation:** check user identity, profile api call should be signed with userToken ([cd845c2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cd845c25395d92f98f7602a48c0835928aa11ac1))
* **aggregation:** delete circular dep: delete bank ref from bankAccount Aggregate Root ([e2d442d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e2d442da8e8da9804bd2ebc06c76312de62233fb))
* **aggregation:** fix build ([0aff396](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0aff396a6bf7461a6dbcf0e8a2a4517aa90d8606))
* **aggregation-adapters:** add edge case ([46dbb79](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/46dbb79e614063e2666ae86aee36c16799dff776))
* **aggregation-adapters:** better ways to save fixtures, long polling tested for aggregation ([498443d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/498443d0ef301404331298f19cc53443ae1e4f28))
* **aggregation-api:** list usage and type in bankAccounts by connectionId ([7db62ae](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7db62aec3e01872c59debf2f9ada7d6e6a0c5bb5))





## [0.18.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.18.0...@oney/aggregation-core@0.18.1) (2021-04-02)


### Bug Fixes

* **cdp-azf:** fix build pb: a file Name should be in minuscule ([1a8f4ca](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1a8f4cad3f7ed986fe74d5fde35be670045bee78))
* **merge:** conflicts ([2aa376b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2aa376b18d535b422fbea4674c4ed4a3a26c6637))





# [0.18.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.17.0...@oney/aggregation-core@0.18.0) (2021-03-30)


### Bug Fixes

* **aggregation:** fix build ([326455f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/326455f5f99338787be58921027b613884abf0e8))
* **aggregation:** user instead of bankAccountOwner for updateConnection too ([da72def](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/da72def30b89132184eb7d674321a0b6b446ddd8))


### Features

* **aggregation:** add horodatage ([5000ed6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5000ed633e2508fdc84e96897e9caac9d5d5d9db))
* **aggregation:** add usecase getTerms and endpoint ([859a825](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/859a825f189a113f90fb17dff11c7834e107c263))
* **aggregation:** add usecase to getTerms and fileStorageService ([78976b1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/78976b12fb46a0d4c070c4cb8971eec12c9ce00f))
* **aggregation:** add UserDeletedHandler ([a24056b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a24056b1b4b3fbacf681eeb6d274c37db64712ad))
* **aggregation:** refacto BankConnection delete ([ab74592](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ab7459235123928973ecfa04378fca271c2879c0))
* **aggregation:** update getTerms service: get json files now ([9157e2e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9157e2e7b28c9dbb66041246e31b5ac9c9b4a532))
* **aggregation:** update tests to .json files ([ef0271f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ef0271ff22d893c799646770f7ddff8c1e4de7c5))
* **aggregation-adapters:** add checkUserConsent and its tests ([abbc58c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/abbc58c6f088ea3869a80eaf025a9c038dc1ff95))
* **aggregation-adapters:** implem mongo and in memory ([58aac8f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/58aac8fe17c11ea423d39fd05072b2b0869fcc5d))
* **aggregation-core:** bankAccountOwner -> User, AggregateRoot, add DeletUser usecase ([5d35797](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5d35797ebde183bcb2ea56eecd5fc62010bc4149))
* **oney-messages:** migrated new develop version ([782e25c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/782e25c7e3cc940c0a135406b24cd9acd16dd45e))





# [0.17.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.16.0...@oney/aggregation-core@0.17.0) (2021-03-10)


### Bug Fixes

* **aggregation-api:** change domain error typing: code instead of message, as requested by Hamid ([a1c5c76](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a1c5c76dc15604c1c464e4ecb4e6fea90743b39e))


### Features

* **aggregation-adapters:** add usecase, inMemory and mongo implem ([1e14494](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1e1449406df554514c91d5fc4b49fc67f2eb03f3))
* **aggregation-core:** add usecase updateConnection ([860f9c2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/860f9c2e806d5a6991d185fd6aefbb3e65f721af))





# [0.16.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.15.0...@oney/aggregation-core@0.16.0) (2021-03-09)


### Bug Fixes

* **aggregation-adapters:** solve merge conflicts ([bcdc43f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bcdc43ffd3b4c470c753b3bb9dfd4e55d65df686))


### Features

* **pp2reve:** disaggregate account when postAllTransactions ([007b015](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/007b01567dc3d9f6b389f75a93cbc0d842175c83))





# [0.15.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.14.2...@oney/aggregation-core@0.15.0) (2021-03-09)


### Features

* **aggregation:** add connection proof for PP2Reve ([4977ccf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4977ccfb1acc824f3f9c0903549d760b17e603bd))
* **aggregation:** add usage and type ([dd39a07](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/dd39a07d8db23a6fbf7a3fc897804a2dbfa6107a))
* **aggregation:** pp2reve, add usage, type and ownership as BankAccount props ([bbe164d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bbe164dfd7489fcb587084ff0e35d23c8ea45064))





## [0.14.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.14.1...@oney/aggregation-core@0.14.2) (2021-02-24)


### Bug Fixes

* **aggregation:** source data from connection only from DB ([39cd349](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/39cd34968a246e345a035427ecc87eb0e8ed9d97))





## [0.14.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.14.0...@oney/aggregation-core@0.14.1) (2021-02-18)

**Note:** Version bump only for package @oney/aggregation-core





# [0.14.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.13.0...@oney/aggregation-core@0.14.0) (2021-02-16)


### Features

* **aggregation:** update bankconnection deleted and updated events payload structure ([ad6e550](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ad6e55021ea1f8957a19179423eaca8202ba30ca))





# [0.13.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.12.0...@oney/aggregation-core@0.13.0) (2021-02-12)


### Bug Fixes

* **aggregation:** fix implem of rename and aggregation as advises by BI ([ea0a15e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ea0a15e284001bf12db56838a3295f93c5eea8d1))


### Features

* **aggregation:** add tests for coverage ([285a92a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/285a92a32713c74e446e83a14dc5c534a6168a1f))
* **aggregation:** delete unused console.log ([7fe8b52](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7fe8b5202a3ad78eff0c548c8b3605dcf019e859))





# [0.12.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.11.0...@oney/aggregation-core@0.12.0) (2021-02-11)


### Features

* **notification-api:** fix connectionId in BankConnectionDeletedHandler (wrong id was taken) ([3b6e508](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3b6e50843c66788107b2c0d5fdd0a9a360d663fb))





# [0.11.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.10.0...@oney/aggregation-core@0.11.0) (2021-02-11)


### Features

* **aggregation:** add REFRESH_AGGREGATED_TRANSACTIONS ([74a5a60](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/74a5a60f635195b35e2386138351ab9126b9f986))
* **aggregation:** bANK_ACCOUNT_AGGREGATED delete unused prop aggregated ([774b73f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/774b73f4e628830544df74c3b6eaf952fea59b8c))





# [0.10.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.9.0...@oney/aggregation-core@0.10.0) (2021-02-08)


### Features

* **aggregation:** dispatch a domain event BANK_ACCOUNT_AGGREGATED ([6399757](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6399757f1a086959be97ddfdcfaac994aad43330))
* **aggregation:** fix build ([ff65681](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ff65681e622805b154d3e88aec87df961e13a00e))
* **aggregation:** solve merge conflicts and add enum in notification/aggregation ([a6bd41e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a6bd41ee364fb09bd5785ee9dda13b4e616db1dc))





# [0.9.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.8.0...@oney/aggregation-core@0.9.0) (2021-02-08)


### Features

* **aggregation:** third party auth failed case ([d4fe1ec](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d4fe1ec558268d2665f50c7963b53b7b5714567b))





# [0.8.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.7.0...@oney/aggregation-core@0.8.0) (2021-02-08)


### Features

* **aggreagtion-core:** inAPp WIP ([195eecb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/195eecbd061d4033cbcd1aa8865c569d1bb80f0c))
* **aggregation:** add THIRD_PARTY_FINISHED event ([8a01c92](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8a01c922ad1697b76bb2c2fede60e3ad5ef9b225))
* **aggregation:** fix merge conflicts with libs message ([921c26f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/921c26f6da933a9fc73df5fe91ebe9e1aebffb3c))
* **aggregation:** inApp enhanced ([0cd0cbc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0cd0cbc2438e247a290ba6f19f2767f2b8e44771))
* **aggregation:** inApp should dispatch two events ([da84d72](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/da84d720b1423d1f4db935f7c5d09313eb64fc6f))
* **aggregation:** push notif to CDP ([24f184b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/24f184b8c3e9e126ed4424b28bb756d5cb02090a))
* **aggregation:** push notif to CDP: fix build ([2ad87fb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2ad87fb2850efd07fda6d71ad0547d1ddcd1d3f4))
* **aggregation:** update connection to SCARequired or bug if inApp fails ([7088aa2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7088aa2433d8489e1e936430afb220f63ff98cb6))
* **aggregation-core:** fix build ([422bfdc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/422bfdc6b8f8efc4d3101de0e5ffd1b823613152))
* **aggregation-core:** inApp on two devices WIP ([a848e85](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a848e85724d5d3de159245aa68d8ba0bdac4e12c))
* **notification:** add silent notification for THIRD_PARTY_AUTH_FINISHED ([cd310fd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cd310fd37e8806ab318ad3dcaa113e11ba26f97c))





# [0.7.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.6.0...@oney/aggregation-core@0.7.0) (2021-02-06)


### Features

* **docs:** add living documentation ([aae039d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aae039d3d6feb08515853023e058ce7fd59a6c11))





# [0.6.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.5.3...@oney/aggregation-core@0.6.0) (2021-02-06)


### Bug Fixes

* **fix comment:** fix comment ([d0b3410](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d0b3410edc53aac5a6ae2f0b663fce87c0edfe96))
* **fix conflict:** fix conflict with dev ([69673dd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/69673ddbbf61324a29e8665bd8eab7e1c400be63))
* **fix coverage:** fix coverage ([0c240b7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0c240b7a785c89ea3f9adcc79509cca3cafd7da9))
* **harmonize typing:** harmonize typing ([3843458](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3843458ea24ba3f00d6a6450b3a526653ef8ac2e))


### Features

* **adding event libs:** adding event libs message for aggreg payment profile ([fe86f03](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fe86f03a9b54241aa374ac770bfae3926621b956))





## [0.5.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.5.2...@oney/aggregation-core@0.5.3) (2021-02-05)

**Note:** Version bump only for package @oney/aggregation-core





## [0.5.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.5.1...@oney/aggregation-core@0.5.2) (2021-02-03)

**Note:** Version bump only for package @oney/aggregation-core





## [0.5.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.5.0...@oney/aggregation-core@0.5.1) (2021-02-02)

**Note:** Version bump only for package @oney/aggregation-core





# [0.5.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.3.0...@oney/aggregation-core@0.5.0) (2021-02-02)


### Bug Fixes

* **aggregation:** jC's review ([b37d8c6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b37d8c6f7dc594e8a353b29a44b521b712b28c18))
* **console.log:** trying to log ([a8de915](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a8de915493306a2654ad4e2ed65663d4e8c897e6))
* **fix publish pipeline:** fix publish pipeline ([da84048](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/da84048614c3a49ad4ff49ed41b267796c9e5da4))


### Features

* **aggregation:** add a method to BankConnection to hydrate with bankAccount data ([f9424a4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f9424a46df90611a9102a70866da29dbf7da06bb))
* **aggregation:** add bankAccounts in AggregateRoot bankConnection ([f4abdac](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f4abdac33f17b386e5d7134467465fca382b7b9f))
* **aggregation:** add canExecute WIP ([d28d2d5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d28d2d5882902f1d17c44f393a6c73ad9268205e))
* **aggregation:** add rbac to aggreg auth endpoints ([95082ae](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/95082ae83ccfd30f4c7ee145c3f1d7f02f0c652d))
* **aggregation:** add rbac to each endpoint ([d25bf0c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d25bf0c084d2b23af9ad1801921597abda5dfc43))
* **aggregation:** add rbac to PP2Reve endpoint and usecases ([08051e6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/08051e6ac32ea9762665dbdadca964b08ed9104b))
* **aggregation:** add rbac WIP ([7de0bd5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7de0bd546a30f23cc327da59e42d3124fe8f619a))
* **aggregation:** delete unused return this ([e21cf8e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e21cf8eba316e53231983284c5553f5896df9465))
* **aggregation-azf:** add event handler for BANK_CONNECTION_DELETED ([c5117c7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c5117c748ca596e55850dc1e8bd6537541470d6b))





# [0.3.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.2.2...@oney/aggregation-core@0.3.0) (2021-01-27)


### Bug Fixes

* **aggregation:** jC's review ([7eb9a55](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7eb9a5508d3ff211bcee25742b6224a75543e682))


### Features

* **aggregation:** bankConnection as an aggregate root wip 2 ([3a028cb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3a028cb6ca4e6126a65285d70b41bfc8a554c23a))
* **aggregation:** converting bankConnection in aggregate root, wip ([e7c41d2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e7c41d2a804a343f5dc30dbb98fab0731f0bff98))
* **aggregation:** dispatch BANK_CONNECTION_DELETED ([69e29fa](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/69e29fa1a5e6224803a87bf84feebbac1b74ffcd))
* **aggregation:** dispatch event connection deleted ([9341e99](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9341e9984dca49462de2ba6ee7b6ecc0e930a9bd))
* **aggregation-adapters:** bankConnection as a aggregate root ([b062a69](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b062a6960dd30c65a81c9a431687251cca41e31e))





## [0.2.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.2.1...@oney/aggregation-core@0.2.2) (2021-01-27)


### Bug Fixes

* **aggregation:** fix delete pb hopefully ([32376ac](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/32376ac240a876f9086ffb30b9af0e639ce9381e))





## [0.2.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.2.0...@oney/aggregation-core@0.2.1) (2021-01-27)


### Bug Fixes

* **aggregation:** push log and fix according to JC review ([ecf1220](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ecf1220b43d6cccad750628772f9b4c922032f22))





# [0.2.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-core@0.1.0...@oney/aggregation-core@0.2.0) (2021-01-26)


### Bug Fixes

* **aggregation:** exclude index.ts from coverage computation ([ef96b84](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ef96b841f5c49254ea01ac688726a5a9c9f78e41))
* **aggregation-adapters:** complete bankAccountOwner delete if last connection ([81fb40b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/81fb40bbeb552bcb5a2ea4c781f0129b20b80154))


### Features

* **aggregation-adapters:** delete a connection in db, implem in memory ([8ddafe9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8ddafe96a803b56c5070fa27fdfb3b7deb784888))
* **aggregation-adapters:** delete bankAccountOwner WIP ([c8af701](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c8af70117c9ef4494b29438d5cdcc4407b7b4e2c))
* **aggregation-api:** delete a bankConnection: add method in repos ([f511a5c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f511a5cf85cb91cfa77e98f5259362331462456e))
* **aggregation-azf:** can delete a connection in DB (inMemory) and in BI ([b1d9607](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b1d96071ea7939435360d447ac2cbc2d4f12e631))
* **aggregation-core:** add delete bankAccountOwner, wip ([4c65403](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4c654032dce560f56c804a1cb8f6ba444be60a05))
* **aggregation-core-adapters:** delete connection in DB and in BI ([1863d54](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1863d543343f03404e974fcab862cf12b268acfb))





# 0.1.0 (2021-01-17)


### Bug Fixes

* **aggregation:** fix Categorized Transaction ([21e4213](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/21e42134bda6be395abcf674f280f9d943f7d6fd))


### Features

* **aggregation:** merge with JC branch ON-2946-folder-structure ([f2ad5b2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f2ad5b299b576d7453913bb27b762cb8b3c16702))
* **aggregation-api:** user controller, WIP ([94a9154](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/94a9154af4835a3064306a2597666e6c34e01b79))
* **routing-contoller:** adding healthcheck ([32dc187](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/32dc187ce9cdef6d18099a9fb9422a285bec2db6))
* migrate aggregation app ([933f335](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/933f33554a96209043d28d05a37efae68d181130))
