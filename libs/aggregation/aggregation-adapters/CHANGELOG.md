# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.20.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.19.0...@oney/aggregation-adapters@0.20.0) (2021-04-29)


### Bug Fixes

* **oney-messages:** fixed linter ([b3fdf54](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b3fdf5478ac6ba2770d732d25e68ab350f9e54a9))


### Features

* **oney-messages:** adapted some tests ([ab80767](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ab80767808c4806a32c109101f8ac8141b3f20d3))
* **oney-messages:** added EventHandlerExecution feature ([e4f71ec](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e4f71ec59dc59e300d5a8b63f08f5f89bda9bd53))





# [0.19.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.18.0...@oney/aggregation-adapters@0.19.0) (2021-04-29)


### Bug Fixes

* **aggregation-adapters:** fix merge conflicts and upload data to Algoan, send to CDP ([dd041a0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/dd041a078fd993954a0cdd2c4456324e5b668f5b))
* **aggregation-adapters:** fix test config ([c6bd2a1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c6bd2a1c704a9e6e22bfa2b5170949956f6c259c))
* **aggregation-adapters:** fixes merge conflicts ([102942f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/102942f9587d6e88be2a154d15d35fd382711d39))
* **linter:** fix linter error ([7fe9bf0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7fe9bf027ea148c02be691018911286594cbd50b))


### Features

* **aggregation:** can aggregate or disagregate with the same call ([e049f4d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e049f4d8263befbdd5823ef8ee3af3014c0d3ed1))
* **aggregation:** solve merge conflicts ([b92ceca](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b92cecabb702fa366fb38b138b969aa827512122))
* **aggregation-adapters:** add adapters to bankAccount ([3e64392](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3e643926ad470adc7a9df19486f3afa3b5c66f80))
* **aggregation-adapters:** add handlers and config variables ([607be13](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/607be13eadb73fabfd3a45a0ee58594846defd44))
* **aggregation-adapters:** adding missing properties for bankAccount model ([7dc19b2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7dc19b2902f8ead95db4d2e5ac6c45f3a9b0643d))
* **aggregation-adapters:** delete accounts when deleting bank connection ([418a8ce](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/418a8cee6c99f6b17d9a04275c688e43bcffd4f4))
* **aggregation-adapters:** upload data to algoan on EVALUATE_BANK_ACCOUNT_TO_UPCAP_LIMITS ([9ffd729](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9ffd729b12db00b81235d2a65b24559ae00b4629))
* **aggregation-core:** and message, add usecase to send data to CDP ([12df3a2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/12df3a28c8145eb21e103a9c9b3dadc81618a6cb))
* **aggregation-core:** save bankAccounts that are aggregated but not in the repo ([7979650](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7979650313cfa92127ad3bc8ba6a732ef5223801))





# [0.18.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.17.0...@oney/aggregation-adapters@0.18.0) (2021-04-08)


### Features

* **aggregation:** action base on form only ([4e066ef](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4e066ef5959f2f2d653aaa5469295771c3e45653))
* **aggregation-adapters:** add pp2Reve conenction service and methods in bankConnectionSCAGateway ([efaaca9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/efaaca9b8620cc6d75c90d7aa0b770b35ef4b53b))





# [0.17.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.16.0...@oney/aggregation-adapters@0.17.0) (2021-04-03)


### Bug Fixes

* **aggregation:** fix broken paths ([217f346](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/217f346368416c9fad5b0091820e27bc7695e29e))
* **aggregation:** fix merge conflicts ([98d52d2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/98d52d2a6900a265d520930ec015b8f6875c260c))
* **aggregation:** fix merge conflicts ([003ec79](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/003ec79b319429a1bc13d3e0dc498053164e2e60))
* **profile-core:** fix 500 if birthdate not given in verify-bank_account-owner ([1a7319b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1a7319b1ae44dd9561ddc1187faf63abbe72a543))


### Features

* **aggregation:** add check if user is owner logic ([50d9511](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/50d95111beaa0c9224a69fec54431183c3484b10))
* **aggregation:** add long polling to get owner identity data ([6e55660](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6e5566094329e54d24551756f707faaf2c3e846c))
* **aggregation:** check user identity when aggregatedAccount ([17478ac](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/17478ac61cd2801537a42a31aa94dc8381df3100))
* **aggregation:** check user identity, profile api call should be signed with userToken ([cd845c2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cd845c25395d92f98f7602a48c0835928aa11ac1))
* **aggregation:** fix build ([0aff396](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0aff396a6bf7461a6dbcf0e8a2a4517aa90d8606))
* **aggregation-adapters:** add edge case ([46dbb79](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/46dbb79e614063e2666ae86aee36c16799dff776))
* **aggregation-adapters:** better ways to save fixtures, long polling tested for aggregation ([498443d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/498443d0ef301404331298f19cc53443ae1e4f28))
* **aggregation-adapters:** pp2reve tests ok now with new fixtures ([3100920](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3100920696ee0d9864e7726a02f21a79c2e3d249))





# [0.16.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.15.0...@oney/aggregation-adapters@0.16.0) (2021-03-30)


### Bug Fixes

* **aggregation:** getTerms tests should be fixed on CI ([2f796e8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2f796e807f13b6e1dfc28b2a0161b33367160c0a))
* **aggregation:** user instead of bankAccountOwner for updateConnection too ([da72def](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/da72def30b89132184eb7d674321a0b6b446ddd8))


### Features

* **aggregation:** add horodatage ([5000ed6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5000ed633e2508fdc84e96897e9caac9d5d5d9db))
* **aggregation:** add odb_authentication_topic ([7b6ca61](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7b6ca614cbf3573851a2e0bb268a5e009fdc75c0))
* **aggregation:** add usecase getTerms and endpoint ([859a825](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/859a825f189a113f90fb17dff11c7834e107c263))
* **aggregation:** add usecase to getTerms and fileStorageService ([78976b1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/78976b12fb46a0d4c070c4cb8971eec12c9ce00f))
* **aggregation:** add UserDeletedHandler ([a24056b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a24056b1b4b3fbacf681eeb6d274c37db64712ad))
* **aggregation:** delete unnecessary fixture ([4388686](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/43886864694469cdfbcf06f1a1063ebb94a90cc5))
* **aggregation:** fix test WIP ([1c06862](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1c06862e132a17211212dc18bbfa221bfb2072cd))
* **aggregation:** fix user and pp2reve tests ([cbaf038](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cbaf038e9b0bb65286e49188c7ea615e574df4c3))
* **aggregation:** tim's review ([7aaeae9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7aaeae950bfa2ae704d70f02fece71f2e5130ce4))
* **aggregation:** update getTerms service: get json files now ([9157e2e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9157e2e7b28c9dbb66041246e31b5ac9c9b4a532))
* **aggregation-adapters:** add checkUserConsent and its tests ([abbc58c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/abbc58c6f088ea3869a80eaf025a9c038dc1ff95))
* **aggregation-adapters:** add tests for saveUserConsent ([7b04845](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7b0484582e68bcbbf033400536385270f63522be))
* **aggregation-adapters:** implem mongo and in memory ([58aac8f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/58aac8fe17c11ea423d39fd05072b2b0869fcc5d))
* **oney-messages:** fixed some tests ([e2252cf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e2252cf0279c098749cd99f3c5d7362eca0a7cad))





# [0.15.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.14.0...@oney/aggregation-adapters@0.15.0) (2021-03-10)


### Features

* **aggregation-adapters:** add usecase, inMemory and mongo implem ([1e14494](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1e1449406df554514c91d5fc4b49fc67f2eb03f3))
* **aggregation-core:** add usecase updateConnection ([860f9c2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/860f9c2e806d5a6991d185fd6aefbb3e65f721af))





# [0.14.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.13.0...@oney/aggregation-adapters@0.14.0) (2021-03-09)


### Bug Fixes

* **aggregation-adapters:** solve merge conflicts ([bcdc43f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bcdc43ffd3b4c470c753b3bb9dfd4e55d65df686))


### Features

* **pp2reve:** disaggregate account when postAllTransactions ([007b015](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/007b01567dc3d9f6b389f75a93cbc0d842175c83))





# [0.13.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.12.2...@oney/aggregation-adapters@0.13.0) (2021-03-09)


### Features

* **aggregation:** add connection proof for PP2Reve ([4977ccf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4977ccfb1acc824f3f9c0903549d760b17e603bd))
* **aggregation:** pp2reve, add usage, type and ownership as BankAccount props ([bbe164d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bbe164dfd7489fcb587084ff0e35d23c8ea45064))
* **aggregation:** solve merge conflicts ([d314320](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d31432095ee3a012dfcab46f311c8ee2b7fa6531))





## [0.12.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.12.1...@oney/aggregation-adapters@0.12.2) (2021-03-04)


### Bug Fixes

* **aggregation-azf:** fix merge conflicts ([9c9dadd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9c9daddedc21fa69c3b8d9a74d67889dfd810f81))
* **aggregation-azf:** payload sent to CDP has not userId sometimes ([f261b64](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f261b645bac19f1d6f43ef3e1175c25d698d6388))





## [0.12.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.12.0...@oney/aggregation-adapters@0.12.1) (2021-03-04)


### Bug Fixes

* **aggregation-adapters:** on fortuneo bank accounts, BI property currency may be null ([fa9b1b5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fa9b1b567e2bf5ec75a3792f5716edf2c99c8714))





# [0.12.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.11.0...@oney/aggregation-adapters@0.12.0) (2021-02-25)


### Features

* **add sca:** add SCA on SplitContract ([f9a6fb5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f9a6fb5d54d37e115f47187e73a6b8baef64ceab))





# [0.11.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.10.1...@oney/aggregation-adapters@0.11.0) (2021-02-24)


### Bug Fixes

* **aggregation:** add missing error type: wrongpass in connectionStateMapper ([1eeb6a8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1eeb6a88086ee613f9ef0f686262a10326a341f8))
* **aggregation:** solve merge conflicts ([704edb2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/704edb2563e358b92f86791a32c52f977115f168))
* **aggregation:** source data from connection only from DB ([39cd349](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/39cd34968a246e345a035427ecc87eb0e8ed9d97))
* **fix comments:** fix comments ([8c3a7a8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8c3a7a89e3940620420a1122dd132ef05511455a))
* **fix payment:** fix payment bank account debt method ([b285e1b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b285e1b892cf8145cdd9837e38da6efc924acffe))
* **fix test:** fix test ([2e53b91](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2e53b9149dde2a6c30d51d894ea6fd22f61ab737))
* **payment:** Fix honoric code ([49cc8a1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/49cc8a1c3b4e3e07c9c831c6e1789ed3dfe0b4f3))


### Features

* **project:** merge develop in feat/3283 ([d75b726](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d75b72666d2c911487fc545c6509d7595a6008c7))





## [0.10.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.10.0...@oney/aggregation-adapters@0.10.1) (2021-02-18)

**Note:** Version bump only for package @oney/aggregation-adapters





# [0.10.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.9.0...@oney/aggregation-adapters@0.10.0) (2021-02-17)


### Bug Fixes

* **fix ci:** fix ci ([3a76a2c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3a76a2c957e894da676094b9ab300466d2bd279c))
* **fix comments:** fix comments ([acb0eab](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/acb0eab079c19d28092988a87bc17003ec59c582))
* **fix conflict:** fix conflict ([4b4ff34](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4b4ff341354c555871ed9ebad56786a73f89c3a3))
* **fix conflict:** fix conflict ([a5a195d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a5a195d51e166c07900003dc11826b531d04f380))
* **fix lint:** fix lint ([30778ba](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/30778ba45a2e5178ea13807b28adb39f33533e40))
* **fix mongo conf:** fix mongo conf ([8372b46](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8372b46aedeaedadc394eecd6df73721310d917e))
* **fix teardown:** fix teardown ([b6b787f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b6b787f2a8646688b438d4486c2bfb7894dcc02a))


### Features

* **adding mongo:** adding mongo jest ([8621fc8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8621fc88fb11c6584604606c534f8026708ed901))
* **adding mongo globally:** adding mongo globally ([400cdfb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/400cdfbe029684b6ebdd08ccccc20c11a12ba841))





# [0.9.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.8.0...@oney/aggregation-adapters@0.9.0) (2021-02-12)


### Bug Fixes

* **aggregation:** fix implem of rename and aggregation as advises by BI ([ea0a15e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ea0a15e284001bf12db56838a3295f93c5eea8d1))


### Features

* **aggregation:** add tests for coverage ([285a92a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/285a92a32713c74e446e83a14dc5c534a6168a1f))
* **aggregation:** aggregate and rename accounts, implem BI reco ([28bbc45](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/28bbc45a0d8493ee31ec9e31fb12170b4034f6f7))
* **aggregation:** delete unused console.log ([7fe8b52](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7fe8b5202a3ad78eff0c548c8b3605dcf019e859))
* **aggregation:** fix build ([7489353](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7489353c5ff2a58fecedd51ada28cc9eaaa3e594))
* **aggregation:** lint ([5bd867a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5bd867aaf1f68be2394fee1a7525f5806f36b85b))
* **aggregation-adapters:** fix build ([5d87578](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5d87578e111490a3f8ec8416b6ebce4e2a9c78e1))





# [0.8.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.7.0...@oney/aggregation-adapters@0.8.0) (2021-02-11)


### Bug Fixes

* **fix tsconfig:** fix tsconfig ([369f5aa](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/369f5aa95a31451258f3dc6cb1700b9bf2c81908))


### Features

* **fixing checkmarx:** fixing checkmarx ([92a4fb4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/92a4fb4138d708ee4bdbe24d8316c0ab114609a6))
* **handling checkmarx:** remove test from build ([89482f2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/89482f2da9285ca9d48abfc42161e47f8c20c869))





# [0.7.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.6.0...@oney/aggregation-adapters@0.7.0) (2021-02-08)


### Features

* **aggregation:** dispatch a domain event BANK_ACCOUNT_AGGREGATED ([6399757](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6399757f1a086959be97ddfdcfaac994aad43330))
* **aggregation:** solve merge conflicts and add enum in notification/aggregation ([a6bd41e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a6bd41ee364fb09bd5785ee9dda13b4e616db1dc))





# [0.6.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.5.0...@oney/aggregation-adapters@0.6.0) (2021-02-08)


### Features

* **aggregation:** third party auth failed case ([d4fe1ec](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d4fe1ec558268d2665f50c7963b53b7b5714567b))





# [0.5.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.4.0...@oney/aggregation-adapters@0.5.0) (2021-02-08)


### Bug Fixes

* **aggregation:** delete bus from index ([def7e93](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/def7e9355003d35a94dfb947f0cb975b9f7e27ca))


### Features

* **aggregation:** fix build ([f3433df](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f3433df7ccba4621c14fad227a80e3208f5cf4e2))
* **aggregation:** fix merge conflicts with libs message ([921c26f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/921c26f6da933a9fc73df5fe91ebe9e1aebffb3c))
* **aggregation:** inApp enhanced ([0cd0cbc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0cd0cbc2438e247a290ba6f19f2767f2b8e44771))
* **aggregation:** lint ([344b327](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/344b3270361f98e8c3d7d8e72aaac0ca3c3da4a7))
* **aggregation:** nename sleep fonction in signin.integration.test ([4ded6dd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4ded6ddf34011ee5ce1846b34b98e36f09b1b098))





# [0.4.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.3.4...@oney/aggregation-adapters@0.4.0) (2021-02-06)


### Features

* **docs:** add living documentation ([aae039d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aae039d3d6feb08515853023e058ce7fd59a6c11))





## [0.3.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.3.3...@oney/aggregation-adapters@0.3.4) (2021-02-05)

**Note:** Version bump only for package @oney/aggregation-adapters





## [0.3.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.3.2...@oney/aggregation-adapters@0.3.3) (2021-02-03)

**Note:** Version bump only for package @oney/aggregation-adapters





## [0.3.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.3.0...@oney/aggregation-adapters@0.3.2) (2021-02-02)


### Bug Fixes

* **fix publish pipeline:** fix publish pipeline ([da84048](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/da84048614c3a49ad4ff49ed41b267796c9e5da4))





# [0.3.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.2.2...@oney/aggregation-adapters@0.3.0) (2021-01-27)


### Bug Fixes

* **aggregation:** fix test config for serviceBus ([f804570](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f804570e166b7111c7a2a5e9b009efac1fdec840))
* **aggregation:** jC's review ([7eb9a55](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7eb9a5508d3ff211bcee25742b6224a75543e682))


### Features

* **aggregation:** bankConnection as an aggregate root wip 2 ([3a028cb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3a028cb6ca4e6126a65285d70b41bfc8a554c23a))
* **aggregation:** bankConnection is an Aggregate root ([1517ae6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1517ae6805d66cbe1bde17ddc4bd598ff79d33bc))
* **aggregation:** bannConnection as an aggregate root wip 3 ([d3ac1a1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d3ac1a134118d2cfaef4673338e1680dcc50ed14))
* **aggregation:** converting bankConnection in aggregate root, wip ([e7c41d2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e7c41d2a804a343f5dc30dbb98fab0731f0bff98))
* **aggregation:** dispatch BANK_CONNECTION_DELETED ([69e29fa](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/69e29fa1a5e6224803a87bf84feebbac1b74ffcd))
* **aggregation:** dispatch event connection deleted ([9341e99](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9341e9984dca49462de2ba6ee7b6ecc0e930a9bd))
* **aggregation-adapters:** bankConnection as a aggregate root ([b062a69](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b062a6960dd30c65a81c9a431687251cca41e31e))
* **aggregation-api:** add env for events ([dc329cb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/dc329cb707b0268884937e404baedda54f9d78a4))





## [0.2.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.2.1...@oney/aggregation-adapters@0.2.2) (2021-01-27)


### Bug Fixes

* **aggregation:** fix delete pb hopefully ([32376ac](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/32376ac240a876f9086ffb30b9af0e639ce9381e))





## [0.2.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.2.0...@oney/aggregation-adapters@0.2.1) (2021-01-27)


### Bug Fixes

* **aggregation:** aMine's review ([07c23b8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/07c23b84b90e2b8045ed25c4fae67b10812a5735))
* **aggregation:** delete connection, solving maybe ([02ac57d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/02ac57dfba7a20cbc27ef35ff3d355b24e0245e5))
* **aggregation:** push log and fix according to JC review ([ecf1220](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ecf1220b43d6cccad750628772f9b4c922032f22))





# [0.2.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.1.2...@oney/aggregation-adapters@0.2.0) (2021-01-26)


### Bug Fixes

* **aggregation:** exclude index.ts from coverage computation ([ef96b84](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ef96b841f5c49254ea01ac688726a5a9c9f78e41))
* **aggregation-adapters:** complete bankAccountOwner delete if last connection ([81fb40b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/81fb40bbeb552bcb5a2ea4c781f0129b20b80154))
* **aggregation-adapters:** fix build hopefully ([688c166](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/688c1666293f3140f0ea805c598248b61a86ee4d))
* **aggregation-adapters:** fix pb build ([6f99f27](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6f99f2768e6c6e18aa1c065dd6e1c16c858d7a22))


### Features

* **aggregation-adapters:** delete a connection in db, implem in memory ([8ddafe9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8ddafe96a803b56c5070fa27fdfb3b7deb784888))
* **aggregation-adapters:** delete bankAccountOwner WIP ([c8af701](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c8af70117c9ef4494b29438d5cdcc4407b7b4e2c))
* **aggregation-api:** delete a bankConnection: add method in repos ([f511a5c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f511a5cf85cb91cfa77e98f5259362331462456e))
* **aggregation-azf:** can delete a connection in DB (inMemory) and in BI ([b1d9607](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b1d96071ea7939435360d447ac2cbc2d4f12e631))
* **aggregation-core-adapters:** delete connection in DB and in BI ([1863d54](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1863d543343f03404e974fcab862cf12b268acfb))





## [0.1.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.1.1...@oney/aggregation-adapters@0.1.2) (2021-01-20)

**Note:** Version bump only for package @oney/aggregation-adapters





## [0.1.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/aggregation-adapters@0.1.0...@oney/aggregation-adapters@0.1.1) (2021-01-18)


### Bug Fixes

* **aggregation-api:** env config for keyvault ([33f6ab3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/33f6ab330ca727923006b6519899270900706cb8))
* **aggregationa-pi:** keyvaultConfig ([38ff2ec](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/38ff2ecbfbeccf495a443bcc4c5719db5ca5ff26))





# 0.1.0 (2021-01-17)


### Bug Fixes

* **aggregation:** fix build pb ([c27fdc4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c27fdc425c930d7b9b96db346a9169325e69c6c2))
* **aggregation:** fix Categorized Transaction ([21e4213](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/21e42134bda6be395abcf674f280f9d943f7d6fd))
* enable nock host mongo ([8be34d4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8be34d4a8d18105a5bf87487a3e247253b0716ac))
* remove restore nock ([c9ccf7a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c9ccf7a4b70a44dab23cde9bb51685b7bd7a3922))


### Features

* **aggregation:** merge with JC branch ON-2946-folder-structure ([f2ad5b2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f2ad5b299b576d7453913bb27b762cb8b3c16702))
* **aggregation-api:** add AUthModule ([8c562b0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8c562b088cfb0a90be9bf164673c3934c769224f))
* **aggregation-api:** add expressAuthenticationMiddleware ([87b9d84](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/87b9d848b8799139f204b95e7af3935e620312b8))
* **aggregation-api:** add mongoose connection ([7b07c99](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7b07c992bf0932ec2b9795b71d89de1b1409c030))
* **aggregation-api:** user controller, WIP ([94a9154](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/94a9154af4835a3064306a2597666e6c34e01b79))
* **appkernel:** init appkernel ([639aa12](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/639aa122f02c1f164727f7c69ae55792edce8f00))
* migrate aggregation app ([933f335](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/933f33554a96209043d28d05a37efae68d181130))
