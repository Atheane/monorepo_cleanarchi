# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.28.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.27.0...@oney/payment-adapters@0.28.0) (2021-04-29)


### Bug Fixes

* **oney-messages:** fixed linter ([b3fdf54](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b3fdf5478ac6ba2770d732d25e68ab350f9e54a9))
* **oney-messages:** test coverage percents ([d7493d2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d7493d2aefc6c8c9f7558469e6eb6bcf672328f2))


### Features

* **oney-messages:** adapted some tests ([ab80767](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ab80767808c4806a32c109101f8ac8141b3f20d3))
* **oney-messages:** added EventHandlerExecution feature ([e4f71ec](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e4f71ec59dc59e300d5a8b63f08f5f89bda9bd53))





# [0.27.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.26.1...@oney/payment-adapters@0.27.0) (2021-04-29)


### Bug Fixes

* **monorepo:** fix conf ([912550a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/912550a69fa90e72193af17c161a5651af45a325))
* **monorepo:** fix conflict ([06185ca](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/06185caf573ea2a7f04dedddacbe770e40e4cff2))
* **monorepo:** fix conflict ([98a52fb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/98a52fb6f154f2ae580a1caebd3e073118041038))
* **monorepo:** fix conflicts ([db1e985](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/db1e98521f042ba2adc9fa9899b6edc52bfee179))
* **oney-payment:** test ([afb4dc5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/afb4dc5590ea528a2859748626fa1c9cdf7e7d65))
* **payment:** add exposure calculation case, using beneciary of p2p ([cd28849](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cd28849d3d7c03030beab374f04b78537f92612c))
* **payment:** add upsert bankaccount feature from master to develop ([84b6008](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/84b60080c12e9421633b9973d8c7094b35eace93))
* **payment:** build error caused by typescript mongo type ([040ac4c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/040ac4c56e5f916d6c548c77172b4be6c18ea9f9))
* **payment:** change value object MonthlyAllowanceLimit verification rule ([1ff240a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1ff240ad1a5834d7fde98840aa109d4f50d94272))
* **payment:** correct PR comments ([4fff374](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4fff374cf322d59de6ae9a8c2e6b0c9f6ef67753))
* **payment:** correct the transactions mapper ([e731a40](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e731a40b6a37100e7d0a533b37c6af78620c3077))
* **payment:** error of event dispatching during debt sync ([3a357ce](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3a357ced64b9d5985c94b6cb60bd947f51677412))
* **payment:** fix the payment tests suits that called SMO for real ([ae996cf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ae996cfafec25dad29299fca7043d99207e97088))
* **payment:** inject the mappers in the SmoneyCardGateway ([22e819f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/22e819fef5fa6d416a41b559c6c17fdad85b9554))
* **payment:** P2P handler was not using correct uid from payment_created event payload ([33b70a6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/33b70a668cec6815dca3c07a313257053abcb697))
* **payment:** pr comment - add initial unknown diligence validation method status ([b663e88](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b663e88473c36362dfd83ecab9a34090c01dc6bd))
* **payment:** pr comment - type the smoney api error reason ([7feebe4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7feebe42fa3f8133af845fdf21434e0541765ff3))
* **payment:** shorter name for test description to comply with Windows file name max length ([b52a01e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b52a01e8a9cc4ba44fae2790cef1d4b0240deaaf))
* **subscription:** fix conflicts ([fa120d3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fa120d33e3a91f2dcf08fb1075248bd63c3b1d51))


### Features

* **ddd:** add method hasEvents in DomainEventProducer ([51bc550](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/51bc5506158cb46dd61384ecbf349f72d8b3324e))
* **payment:** add AddBeneficiary usecase ([17cea1d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/17cea1d9be60756ce74414d5784322b7a5d45368))
* **payment:** add async debts usecase before debt collection ([dba523b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/dba523b1c50f94307b36e9f943cea0eafd66a90a))
* **payment:** add CardHmac usecase ([696d35a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/696d35ab2cf2e9ef9f605c2a6d0409ccec3e1edb))
* **payment:** add collect debt beneficary id ([c0f2958](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c0f295826990a5bfce372010e5513dd5768e3f23))
* **payment:** add DisplayCardDetails usecase ([2e939eb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2e939eb4d9743d4229801678304b6e105556c655))
* **payment:** add DisplayCardPin usecase ([da3f3fc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/da3f3fc73934ede2688d6fdaec15cef8335bc282))
* **payment:** add DisplayCardPin, DisplayCardDetails and CardHmac routes ([44d4cf8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/44d4cf8313a2c0d3139c4a0e205e3cbe25511765))
* **payment:** add gateways for cards display, pin, hmac and add beneficiary ([34f1300](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/34f1300e7cb52b31c04ff8d4c83fb8c8ea1a3a12))
* **payment:** add GetBankIdentityStatement usecase and route ([ee158a2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ee158a20ed46cf9fd4c019198165079072635a28))
* **payment:** add scheduler to trigger technical limit calculation each month ([7cfa6a7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7cfa6a7b6e3e0b9427f579683fe868c8abf038e8))
* **payment:** add SMONEY api functions for cards hmac routes and beneficiary creation ([598ee5b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/598ee5bfe28db8513448057c09a801ec819ac56c))
* **payment:** add usecase and event handler to process clearings one by one ([9c6aa60](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9c6aa6008925928f7769b6b1b15dd58dea65b7c3))
* **payment:** add usecase to extract clearings from a clearing batch ([4e28796](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4e287968e3c0e75d402509976a8ee4a0b0ddad77))
* **payment:** add usecase to start bank account debts collections ([5f4baa7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5f4baa7950cfe3eccac72c409b42da3aebd86b64))
* **payment:** handle both trigram and number version of currency in a clearing ([65e4cb6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/65e4cb6ad8de611f2039f42578f2bf35e1817a85))
* **payment:** throw explicit errors for P2P creation failures ([33bad9a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/33bad9aa5f1def28e6eb01116a688dae4a11b1eb))
* **payment:** use domain event to set account status to activated ([1ca3b87](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1ca3b87437551ebd778a659109ec52ae280c1600))
* **payment-core:** ACCOUNT_ELIGIBILITY_CALCULATED initiate the limits ([b8d3156](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b8d3156741669914d1d1015a69f999f299e0ecad))
* **payment-core:** calculate spentFunds ([ed4856e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ed4856ef2f82e24db65165ff16f267880dba3df5))
* **subscription:** handle discount application rules ([686bd97](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/686bd97ffacf91bfa470144493c4f2b116a3dcb5))
* subscription - add saga to create and activate insurance membership ([ce1c405](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ce1c4053ca0814d5c9a3688c1da1a79442c28d42))





## [0.26.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.26.0...@oney/payment-adapters@0.26.1) (2021-04-15)


### Bug Fixes

* profile / payment - improve status update on signContract and catch errors on StorageGateway ([8c3581a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8c3581ac55db78fcf12ddb75f770def9e71c2963))
* **payment:** remove SMO calls in the GetCard and GetCards usecases ([615321b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/615321b4245efae862d9d2a625c363b9778af322))
* **payment:** rename SmoneyLegacyCardMapper to LegacyCardMapper ([ae6f409](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ae6f4097806f3ea3bb76deb8700f9c8ff9c5942f))





# [0.26.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.25.1...@oney/payment-adapters@0.26.0) (2021-04-15)


### Features

* **payment-adapters:** get uncapping when tax notice uploaded ([0b1228d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0b1228d597181cf04eba3b0d6869738d494e114c))





## [0.25.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.25.0...@oney/payment-adapters@0.25.1) (2021-04-15)


### Bug Fixes

* **payment:** fix mongoose connection issue and eventstore insert ([05b91b5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/05b91b5b94a37403079de51037d569bcc1795b36))





# [0.25.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.24.0...@oney/payment-adapters@0.25.0) (2021-04-14)


### Features

* **payment-core:** updating uncaping states ([5467440](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5467440f3a32571e8e1d839799261f508c6ae33b))





# [0.24.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.23.0...@oney/payment-adapters@0.24.0) (2021-04-14)


### Features

* **payment-core:** Uncappe updating globalOut and Balance Limit ([030238a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/030238a9a040b5cde1a22d7afec9c7a71b418ab7))





# [0.23.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.22.0...@oney/payment-adapters@0.23.0) (2021-04-14)


### Bug Fixes

* **monorepo:** fix conflict ([2798c4c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2798c4cec869258826b8a38095917408c98825dd))
* **payment:** fix name long ([cf0e0a7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cf0e0a75e7b8472ba4b498a3e5c8a49ce1742d77))
* **profile:** fix test and nock ([c6c5586](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c6c55865b0cf87c3ec7a111fecfcc4208c52bad0))
* **subscription:** fix comment and test ([f123f43](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f123f43d8636a2ced53b41eb1b4555b5cc0213e6))
* **subscription:** fix conflict ([f5492b0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f5492b0ed5744ca1733f5320b690542a13a52c8e))
* **subscription-api:** adding saga ([68fbe7d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/68fbe7d7f05c2c56e6a81048e8201aaf5f219682))


### Features

* **subscription:** finalize test for saga ([78eaeb0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/78eaeb026294b82bbdffb3b19e423da69294ae07))
* **subscription:** fix conflict ([f0d4035](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f0d403566b28b0450bddc636b607f0d7c13ced58))
* **subscription:** handle subscription saga for process subscription ([2579bf7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2579bf76c78953f93cbc0f2de35fa16755029371))
* **subscription:** handling handler ([675366c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/675366c62f3f8ad614dfcb9af4c169ae1f7f1b44))





# [0.22.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.21.0...@oney/payment-adapters@0.22.0) (2021-04-14)


### Features

* **payment:** add technical limits calculation for split payments processes ([a595ff6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a595ff654f1926c1dc8de90455a50173180b9bed))





# [0.21.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.20.0...@oney/payment-adapters@0.21.0) (2021-04-14)


### Features

* **payment:** add event to exposure list events, PaymentCreated for P2P cases ([4790a57](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4790a576f6c6e7a8189699f49467a2ec8c03f746))





# [0.20.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.19.3...@oney/payment-adapters@0.20.0) (2021-04-13)


### Features

* payment - send to SMO kyc document and filters on creation if already available ([81eba6b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/81eba6bab6dcdfba01a2deaa4338300979e26ba5))





## [0.19.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.19.2...@oney/payment-adapters@0.19.3) (2021-04-13)

**Note:** Version bump only for package @oney/payment-adapters





## [0.19.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.19.1...@oney/payment-adapters@0.19.2) (2021-04-08)

**Note:** Version bump only for package @oney/payment-adapters





## [0.19.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.19.0...@oney/payment-adapters@0.19.1) (2021-04-06)


### Bug Fixes

* **payment:** fix on operation save ([21d7d28](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/21d7d28faad8928f9e02bfa19ca28db54283ca6a))





# [0.19.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.18.0...@oney/payment-adapters@0.19.0) (2021-04-02)


### Bug Fixes

* **monorepo:** fix tests name ([7de5679](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7de56799d2b085c0869263b2d803fc98d60d4832))
* payment - ON-4277 : keep expired token in case of SMONEY error ([5da6307](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5da63078526b347070b87a72f8874298e133f49c))
* **merge:** conflicts ([2aa376b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2aa376b18d535b422fbea4674c4ed4a3a26c6637))
* **payment-adapters:** fix handler according to new AccountEligibility interface ([1cfe011](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1cfe011c0d0f0cda967ee34da492707b3ac9e81f))


### Features

* **payment:** add BirthName during smoney account creation ([c0a0c14](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c0a0c14025e4a21233c26d9b2f2edc253f10c8fa))
* **payment:** add split payment eligibility process, using cdp event ([cfb070c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cfb070c2548b874743c47068347f446b02820052))
* **payment:** change calculate exposure usecase to considere x3x4 eligibility of the user ([1374141](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/137414183fa545c0e9f7b377eef1b6af26984b3d))
* **payment-core:** uncapping gets in pending if TAX_NOTICE_VERIFIED received ([99f0d4a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/99f0d4a03810bb340dcb86a3175898cfa23df12d))
* **profile subscription:** set or update the CNIL/LEN information during the civilstatus step ([e60d543](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e60d54347662d28d92ec1079bbda9cf6422a6354))
* add debt P2P references ([3085f55](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3085f55f31a8aa279cf2adbcb5719dbd099248e1))





# [0.18.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.17.0...@oney/payment-adapters@0.18.0) (2021-03-30)


### Bug Fixes

* merge conflicts ([32c2ba4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/32c2ba4022d758080bb5761e3c9978ccd850fcc1))
* **payment:** fix kyc document type for residence permit sent to SMO when ([5e867ba](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5e867bac2089ef4a07da6b599089a7aaa1298bcd))
* **payment:** pr fix ([5da5b66](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5da5b667551326372df19e3b4f52cc9729e30f01))
* fix merge conflicts ([c4a3b78](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c4a3b78b44919a8077059a7f9661ccebd46f28d3))
* **payment:** fix more merge conflicts ([4758346](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4758346c0a1194d41d6114e0b7f31731c8a6830a))
* **payment:** pr fix ([ff565f7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ff565f725597b2ad398843cde19785d14dcf8d1d))
* **pfm payment:** fix merge conflicts ([ae0cccd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ae0cccdab7f097173a02e2e54258bb8141dce3e7))
* **pfm payment:** pr fix ([8e1b2dc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8e1b2dca940a624d538f15e19e20ab108038b497))


### Features

* **cdp payment:** handle the account eligibility event ([59be633](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/59be63315471101280b715033703820cfe433bd8))
* **oney-messages:** added some solution to be compatible with legacy ([cfbb857](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cfbb8575710f76c0c3b6f1a394687899acc35a68))
* **oney-messages:** fixed some tests ([e2252cf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e2252cf0279c098749cd99f3c5d7362eca0a7cad))
* **oney-messages:** migrated new develop version ([782e25c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/782e25c7e3cc940c0a135406b24cd9acd16dd45e))
* **payment:** :sparkles:  add new usecase sync bankaccount exposure ([56dcfef](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/56dcfef00278361692e76e75f2c7cf0e27e2a425))
* **payment:** emitting EvaluateAccount command if contains income (CDP checking) ([3819a91](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3819a9130f6b7bb5a13e53f68045a2145c95b2a1))
* **pfm payment:** handle the callback type 20 transactions ([9ceef0b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9ceef0b4aec9b8b25261cd5b392facbdf6ac41bb))
* **profile,payment,auth:** add birthDepartmentCode and birthDistritCode to the Profile ([bd15974](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bd15974135c231500824364866950070fe2d3896))





# [0.17.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.16.1...@oney/payment-adapters@0.17.0) (2021-03-12)


### Bug Fixes

* **notification payment:** rename BANK_ACCOUNT_UNCAPPED label BANK_ACCOUNT_UNCAPPED_FROM_AGGREGATION ([28c59b6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/28c59b6de97aa10fdafb2adfd97746c30d0f6d28))
* **payment:** pr fix ([ae05500](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ae05500be008bef4f42fe7e7ed1201004b02ac41))
* **payment:** rename balance limit calculated event and add cdp topic ([ed5b140](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ed5b140f52c43950c89a49923bd5f8d9f2865bb9))


### Features

* **payment:** add a handler to uncap a bank account ([86cffa2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/86cffa2c18dc9b4de2f54307650104a8fec7447c))





## [0.16.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.16.0...@oney/payment-adapters@0.16.1) (2021-03-10)


### Bug Fixes

* **payment:** find if the transfer is P2P or SCT from the bic ([f5eac7f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f5eac7f08ac65dcea57e6b961f79ec6b3bd87299))
* **payment:** find the beneficiary from iban instead of bid ([cc042c2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cc042c2ba5cefe0076d0f8b84b8c9b0f9895b044))
* **payment:** fix P2P between clients and automatic P2Ps ([25ad3c3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/25ad3c3c6f43c3d9225b0bf6a41c70d79f3c18e6))
* **pfm payment:** fix the P2P creation and save ([4505974](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/450597474022f56f409ce820aabbafa3f6edf7b3))





# [0.16.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.15.6...@oney/payment-adapters@0.16.0) (2021-03-09)


### Features

* **payment:** expose endpoint emitting CheckAgregatedAccountsIncomes event ([fb86820](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fb86820707e7b9a3e772be27474f358ff93d2bb8))





## [0.15.6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.15.5...@oney/payment-adapters@0.15.6) (2021-03-05)


### Bug Fixes

* payment - change PPE sanctions values sent to Smoney based on new OT logic ([29edf7a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/29edf7a0bfcc1cabd86124079a9daab70fba2950))





## [0.15.5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.15.4...@oney/payment-adapters@0.15.5) (2021-03-03)


### Bug Fixes

* payment - add test to check if usecase not triggrered ([01ab769](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/01ab769cdd0d32dd2bd9cb94c061936a7a89d847))
* payment - limit the diligence aggregation for aggregation activation ([edd6814](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/edd6814a219eb4ac74f7c4fc5375d29f97fdbb47))





## [0.15.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.15.3...@oney/payment-adapters@0.15.4) (2021-03-02)

**Note:** Version bump only for package @oney/payment-adapters





## [0.15.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.15.2...@oney/payment-adapters@0.15.3) (2021-02-26)

**Note:** Version bump only for package @oney/payment-adapters





## [0.15.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.15.1...@oney/payment-adapters@0.15.2) (2021-02-25)


### Bug Fixes

* **payment:** change smoney raw debt created callback properties ([b436716](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b436716b8a0e2f24b25dde28f195200560346a60))





## [0.15.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.15.0...@oney/payment-adapters@0.15.1) (2021-02-24)


### Bug Fixes

* **fix notif conflict:** fix notif conflict ([3cc520e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3cc520ed2da98e5976c7ee7358a70f39a2967443))
* **fix test:** fix test ([2e53b91](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2e53b9149dde2a6c30d51d894ea6fd22f61ab737))
* payment - fix PPE and sanctions logic in mappers ([028d954](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/028d954a47b14b5aeec01fee9ceafb46d17409d0))
* **add handler:** add Handler on BankAccount ([dd952ed](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/dd952ede8ed2cbcb420eb682f42029cc3cd2f6d2))
* **payment:** Fix honoric code ([49cc8a1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/49cc8a1c3b4e3e07c9c831c6e1789ed3dfe0b4f3))
* **payment-core,messages,adapters:** add phone field to BankAccountCreated ([06c882e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/06c882ef4ff0769843fe48b3913b5e55de029fff))





# [0.15.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.14.1...@oney/payment-adapters@0.15.0) (2021-02-18)


### Bug Fixes

* **payment-adapters:** fix unpassed test due to last commit ([2fc53f6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2fc53f653890a042c9dfa9344575cdd95398818c))
* **payment-adapters,core,messages:** add missing fields to BankAccountCreated domain event ([41067bb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/41067bb6abf048f0058ca9729b2cd1283c4507e1))
* **project:** merge develop into feat/profile/ON-2611-bankaccountcreated-event ([ebfba73](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ebfba7390232c7d25deb375ec088000dcf9fc242))


### Features

* **payment-core,messages,adapters:** dispatch two events after the creation of a bank account ([e463d61](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e463d61264a5244d7020105169c1fee7457d5795))
* **project:** merge develop in feat/profile/ON-2611-bankaccountcreated-event and resolve conflicts ([e0dced9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e0dced9d37349c5c62357e634b550035b85ad326))





## [0.14.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.14.0...@oney/payment-adapters@0.14.1) (2021-02-17)

**Note:** Version bump only for package @oney/payment-adapters





# [0.14.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.13.1...@oney/payment-adapters@0.14.0) (2021-02-15)


### Features

* **profile, payment, common:** add additionalStreet is optional ([c897c3b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c897c3b9181d5e033620a113ac2b0526ab261f56))
* **profile, payment, common:** add additionalStreet to the user's address ([7e0a019](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7e0a019e5c1e1de2538cec1393045633c881b05a))





## [0.13.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.13.0...@oney/payment-adapters@0.13.1) (2021-02-12)


### Bug Fixes

* **clean-event:** fixed lint validation ([4502866](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/45028663fe35ceefdc687a36865eefddd715f5ef))
* **test-coverage:** fixed test coverage ([d81f655](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d81f655a4d616835c76e060b8810b52aab9894fb))





# [0.13.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.12.0...@oney/payment-adapters@0.13.0) (2021-02-11)


### Bug Fixes

* **fix comment:** fix comment ([8d58da5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8d58da5a7e7a6aaa329488feb2007a4513e8889d))
* **fix conflict:** fix conflict ([99da1a2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/99da1a2aaaa80b1f291455d5e280eb1d5f974dfe))
* **fix tsconfig:** fix tsconfig ([369f5aa](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/369f5aa95a31451258f3dc6cb1700b9bf2c81908))
* **payment-message:** change smoDebtProps, not the right format sended by smo ([1405016](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1405016ce1dd87ccae87e9e37bd7bfada6584c82))
* pR FIX ([4f758e8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4f758e849e9f523340392938ac0c66831329f72f))
* **payment:** listen to the right event in payment to consume SDDReceived ([2d1f8e1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2d1f8e176fbe6c7c6c7b602b0e3c4e35ee7d0a26))


### Features

* **fixing checkmarx:** fixing checkmarx ([92a4fb4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/92a4fb4138d708ee4bdbe24d8316c0ab114609a6))
* **project:** if applied, this commit will resolve the conflict ([1b9710f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1b9710faab12e38f82d079307611ee3fd0b561e1))
* rename smoney-ekyc to dispatcher bcz this functions dispatches events from a callback ([f37a271](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f37a271cdb0edff62159ef71bd7101d8541ddc75))
* **handling checkmarx:** remove test from build ([89482f2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/89482f2da9285ca9d48abfc42161e47f8c20c869))
* **project:** if applied this commit will merge develop in split-api-adapters-core-on-pfm ([f4427de](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f4427de0e8dade231f2df7dfb853a557c0fd4313))





# [0.12.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.11.0...@oney/payment-adapters@0.12.0) (2021-02-08)


### Bug Fixes

* **payment:** adapt for debts unit amount convert cents to euros changes ([e4a8195](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e4a819587ac3553f8fad84f282dcdff7cc420ead))


### Features

* **payment-adapters:** add converter unit currency from smoney to euros(domain) ([2ffbd2a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2ffbd2aa0edc47cab19d853a21a01f02d982b2d9))





# [0.11.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.10.0...@oney/payment-adapters@0.11.0) (2021-02-06)


### Features

* **docs:** add living documentation ([aae039d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aae039d3d6feb08515853023e058ce7fd59a6c11))





# [0.10.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.9.1...@oney/payment-adapters@0.10.0) (2021-02-06)


### Bug Fixes

* **add event lib:** add event lib ([72b3a83](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/72b3a83691ba9036cd9faf0ee4a9a8332f48e3f9))
* **fix comment:** fix comment ([f214d2a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f214d2a6cc02d56d2b64b7e4d729a29681cd1535))
* **fix comment:** fix comment ([fec59b9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fec59b94e3ca7d8de530ff32f7f040fcc1c75e8c))
* **fix conflict:** fix conflict ([a5edbbc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a5edbbcafaab0fdc6106aad32508858f30e8d36a))
* **fix conflict:** fix conflict with dev ([69673dd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/69673ddbbf61324a29e8665bd8eab7e1c400be63))
* **fix duplicate:** fix duplicate ([73ebdbc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/73ebdbc53cbff03cb131cd54a44b38bf1970151e))
* **fix naming onbaordingstatus:** fix naming onbaordingStatus ([038b69c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/038b69ccc05fdf1f979311b5aed06f96238b4199))
* **harmonize typing:** harmonize typing ([3843458](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3843458ea24ba3f00d6a6450b3a526653ef8ac2e))


### Features

* **adding event libs:** adding event libs message for aggreg payment profile ([fe86f03](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fe86f03a9b54241aa374ac770bfae3926621b956))
* **harmonise:** harmonise handlers, fix typing between bounded context, fix tests ([2e1ae6c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2e1ae6c76d57dad05990537edae34a819e16338c))





## [0.9.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.9.0...@oney/payment-adapters@0.9.1) (2021-02-05)

**Note:** Version bump only for package @oney/payment-adapters





# [0.9.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.8.3...@oney/payment-adapters@0.9.0) (2021-02-05)


### Features

* payment - remove get limits from createBankAccount and add get limits on getBankAccount ([1a58cf2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1a58cf2225ed0a60130cccd5b11d4085ff3ffdc6))





## [0.8.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.8.2...@oney/payment-adapters@0.8.3) (2021-02-04)


### Bug Fixes

* map the birth city correctly in the get profile infos gateway ([a82e687](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a82e687ebd0ef556f8fcebc09fd0d3213d1573a8))





## [0.8.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.8.1...@oney/payment-adapters@0.8.2) (2021-02-03)

**Note:** Version bump only for package @oney/payment-adapters





## [0.8.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.8.0...@oney/payment-adapters@0.8.1) (2021-02-03)

**Note:** Version bump only for package @oney/payment-adapters





# [0.8.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.7.1...@oney/payment-adapters@0.8.0) (2021-02-03)


### Bug Fixes

* **on-2241:** add dispatch kyc diligence succeeded event ([8bacd95](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8bacd959db4d11d65e9cadadbdc8193ebd244487))
* **on-2241:** add profile-events lib ([0398edf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0398edf9e2211223f37fe609cd7cc88a08aadb10))
* **on-2241:** add test on dispatcher call ([c17c5ba](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c17c5baad84df215840c2829f7dbfeb852a52baf))
* **on-2241:** fix pr comment - fix typos on diligence status enum ([1c9b0e0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1c9b0e00e3f2571144dda9e16812766c59955152))
* **on-2241:** fix pr comment - make profile event external dependency free ([735923c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/735923cd2ad9011c5f6867dc8ad2e4420ab48528))
* **on-2241:** fix pr comment - rename diligencestatus to kycdiligencestatus ([2432f30](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2432f307a0bcecf71d90f78c8df11ca6e41de0c3))
* **on-2241:** fix pr comment - rename payment-events to payment-messages ([25222f4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/25222f4aad78107f8aacb18a1fc4391abca5250a))
* **on-2241:** fix pr comment - rename profile-events to profile-messages ([be576c9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/be576c9410edd0f1a5df2a090fb4496b5b436bd7))
* **on-2241:** fix pr comment - renaming ([1b4ba76](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1b4ba76687c2bb5082cb4bc0076515342941e943))
* **on-2241:** fix test ([029ad73](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/029ad73fd71177afa218617501c9bfa941e4759f))
* **on-2241:** fix test ([69e79c5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/69e79c55a264582a09fa8483665d65a230178ae2))
* **on-2241:** fix test - add diligence status in result from bank account read repo ([88fe703](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/88fe703102b6f315d942a10703e4a0efccc2ae81))
* **on-2241:** fix test - add diligence status in result from bank account read repo ([4898b3b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4898b3b67743a0356eeecca524e096439b2f47f6))
* **on-2241:** fix test - add handle for find by iban in in memory query service ([01f716f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/01f716f4b4aa22021662d81921c0eec149e2a06a))
* **on-2241:** fix test - add handle for find by iban returns undefined ([4d81688](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4d81688d7a3a5ceaa3c94beaeb7457caddeb1b04))
* **on-2241:** fix test - insert account to retrieve in database and add optional diligence status property in odb bank account mapper ([1ca46d3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1ca46d3872f2839324ab49df9cb8f0322e569ccf))
* **on-2241:** modify profile activated event sent to cdp ([7ce3fb5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7ce3fb51e60075d8ef6b8e0c23a5ae5cf34a07a1))
* **on-2241:** remove unused import ([4c77685](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4c77685665bf58a54a5b1a5c5a947da5d034d7b6))
* **on-2241:** send KYC_DILIGENCE_FAILED event on error when creation complementary diligence smo api call ([b1848dd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b1848dd3fea1918f4d3242773e6213e6dfc8f2ba))
* **on-2241:** update bank account diligence status property ([8426260](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/84262603c80bb507fa02c427b321c51a7e7015aa))
* **on-2241:** update field name in activated profile event ([0d4f044](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0d4f044e4de65c42c0bf8e859e2fc22a9aa908fa))
* **on-2241:** use nockback in test smo complimentary diligence ([1e9d69f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1e9d69f409fa117dfe0296d84ead0d68406fe402))
* **on-3228:** remove unused variables profile unit tests ([79f012d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/79f012d0546d7d1870a40d3d3c7a9508810212b7))


### Features

* **on-2241:** add handler in payment for profile activated event and notofy smo ([64099bf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/64099bfa68ee8190c78317a5c79eeacb374cd245))
* **on-2241:** add handler in payment for profile activated event and notofy smo ([f7461b5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f7461b5a204194f108e5ceff1f98a6af466fadfb))





## [0.7.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.7.0...@oney/payment-adapters@0.7.1) (2021-02-02)


### Bug Fixes

* **opqskdk:** opqskdk ([ecc6a69](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ecc6a69805958fe95f1407c9bdbc902b3711811f))





# [0.7.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.6.3...@oney/payment-adapters@0.7.0) (2021-02-02)


### Bug Fixes

* fix error when saving benef in db ([5f8793f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5f8793feb7e58a0ff712b913cf17b0ae0bdb5c83))
* fix saving after card toggle changes ([b124315](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b1243152c552f9bb8abf03f84a85b3770205b363))
* fix token AD issue (update token and nock calls) ([b255140](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b255140edf42b29ce66cfdc16998ee73876afb95))
* rename tin to fiscalNumber ([92a538c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/92a538cad29113b99bfe33c74d7ea4c1e2817a5b))
* replace cents by EUR in allowance mapper ([d392976](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d39297643591640e423ea3754ee6b55fa2c160f0))
* **fix conflict:** fix conflict ([a4116ee](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a4116ee854d5af345156217d21df835553f18cd1))
* **fix conflict:** fix conflict ([99f6897](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/99f6897ef0dfde11e471368ba4a7a41be823a708))
* **fix diff with develop:** fix diff with develop ([b6b0fe4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b6b0fe471ba18c06374ef401a7274f5acb322a61))
* **fix event libs:** fix event libs ([6ceabe6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6ceabe67894319ed6c37702785d72eb41a96fdd1))
* **fix nationality:** fix nationality ([f741935](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f7419350123bbc8f6665c6c2d8345bcf4a1d1f5d))


### Features

* add domain event when monthly allowance updated ([19d3299](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/19d3299cd068bb53fe442aa847d64806a17766e3))
* add handler to send silent notif when monthly allowance updated ([011ceaa](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/011ceaa01e47be91b43e0bbd0c8343dd038996f8))
* in profile, rename marriedName to legalName ([e33ab42](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e33ab423a11284851c010fced554d1c45002644d))
* remove economicactivity from the smo account creation and update ([c16e4d1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c16e4d112aad754fffd233d2da7729fa7dc59711))
* update payment call from profile ([201ce8f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/201ce8f6238c7c85e9d04ec32bf8515264acb185))
* update payment with the declarative fiscal call ([e3eb288](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e3eb288d114e38d9c9e00b43b64cf7c4634c5eb5))
* **add payment-events:** add payment-events ([32ce87f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/32ce87fdd95e0a970a22870f09578542bb4065ac))





## [0.6.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.6.2...@oney/payment-adapters@0.6.3) (2021-01-28)


### Bug Fixes

* improve CI to fix build by using inmemory ([5b2781f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5b2781ff1aff27bcbf1b53f987109527e083d748))





## [0.6.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.6.1...@oney/payment-adapters@0.6.2) (2021-01-28)

**Note:** Version bump only for package @oney/payment-adapters





## [0.6.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.6.0...@oney/payment-adapters@0.6.1) (2021-01-28)

**Note:** Version bump only for package @oney/payment-adapters





# [0.6.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.5.0...@oney/payment-adapters@0.6.0) (2021-01-28)


### Bug Fixes

* fix pr feedbacks ([5c1f3e9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5c1f3e977245752165cdd946702fb87b64f94dec))
* fix typos ([679e463](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/679e463dd39ad35d69c377f9660e4e1173ab60c3))


### Features

* endpoint to get bank account ([59e22f9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/59e22f926cf24d15a58dd1930b9487e2e441647c))
* replace allowance gateway by simple function ([bee7179](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bee7179220a44dcda22cb1368ac764b6c480e743))
* update monthly allowance on new transac ([7427bb3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7427bb3770e6cb98f51a77c38519178ab4e5f656))





# [0.5.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.4.4...@oney/payment-adapters@0.5.0) (2021-01-26)


### Bug Fixes

* **fix conflict:** fix conflict ([2739438](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/27394389356ee8b3f01b8ceaeba195498d469baa))
* **fix test payment:** fix test payment ([51b46d5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/51b46d50f4a1d571d7c1d0f7873e7926ccd40017))
* **try to fix:** try to fix ([d252631](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d252631ca6f5de57f483736e6dca42461b9b9730))


### Features

* **adding bankaccount and address step:** adding BankAccount and Address step in monorepo ([286927e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/286927e5b634e9308c74503f734983610d771d42))
* add fiscal status usecase + payment account update usecase and route ([6daa6ca](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6daa6cadb1a452bcb7462582525fa1282d534dd1))
* add fiscal status usecase + payment account update usecase and route ([305e6b8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/305e6b8ebd4a3ab5de20c5919de5333d880f871c))
* setup fiscal status tests ([a270b19](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a270b1998a8fe932133720aac489718d9dff71e2))
* setup fiscal status tests ([49b7088](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/49b7088ee5a53712bbc9fd2656cd9c437fedec60))





## [0.4.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.4.3...@oney/payment-adapters@0.4.4) (2021-01-20)

**Note:** Version bump only for package @oney/payment-adapters





## [0.4.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.4.2...@oney/payment-adapters@0.4.3) (2021-01-14)


### Bug Fixes

* fix event type in kyc decision event handler ([1b02058](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1b020587d250dfa6844f1d5939ea7ea75645638c))





## [0.4.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.4.1...@oney/payment-adapters@0.4.2) (2021-01-13)

**Note:** Version bump only for package @oney/payment-adapters





## [0.4.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.4.0...@oney/payment-adapters@0.4.1) (2021-01-13)


### Bug Fixes

* fix conflict merge issues ([6738007](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/67380076c53ce808c11a4310fd10b38a0dc22072))
* fix issues related to the domain events subscriptions and send ([6f25cce](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6f25cce1c42727ce6c325573d70dcbc3e01dc6d0))





# [0.4.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.3.0...@oney/payment-adapters@0.4.0) (2021-01-12)


### Bug Fixes

* use a gateway instead of a repository for Smoney KYC ([3807dff](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3807dffb1701c20121445e0b5fa1b0fca390e8f3))


### Features

* migrate sending kyc filters to S-Money in mono repo ([b87ae56](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b87ae5681c2089f0e7694ef8a44a8fb825beb7d0))





# [0.3.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.2.1...@oney/payment-adapters@0.3.0) (2021-01-08)


### Bug Fixes

* fix conflicts ([22f946b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/22f946b09b00ea6e931473841fc4f801714091f3))
* fix import issues during the build state ([0d332b1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0d332b1b41552d654cf25110252cd689ff5dfc5a))


### Features

* move the smoney-ekyc domain and adapters to payment-core and payment-adapters ([fbd01fc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fbd01fc069eecb47ff8e9fccc84516512d71954d))





## [0.2.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.2.0...@oney/payment-adapters@0.2.1) (2021-01-08)

**Note:** Version bump only for package @oney/payment-adapters





# [0.2.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.1.2...@oney/payment-adapters@0.2.0) (2021-01-07)


### Bug Fixes

* **on-2724:** fix pr comments ([0267247](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/02672472484f3e77c6052a14a87d4044c53a26a5))


### Features

* **on-2724:** migrate get partner user data core and adapters logic ([c513089](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c513089ec7f87f518d404558bb0f8713e9adeb66))





## [0.1.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.1.1...@oney/payment-adapters@0.1.2) (2021-01-07)


### Bug Fixes

* **fix conflict:** merge develop and fix conflict ([c8261e2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c8261e28d10dd028c65184f6b0fde6a4bab014ef))
* **fix method in aggregate root:** fix method in aggregate root and refactor entity ([685aebe](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/685aebecc1f4e925bf8557c74dd0676e9dfd0ac4))





## [0.1.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.1.0...@oney/payment-adapters@0.1.1) (2021-01-06)


### Bug Fixes

* fix typo in conf ([3c246eb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3c246eb8fe7a66d38984aeb39245d8a353476155))
* improve env for profile-azf (kyc decision) ([cc0295d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cc0295d7c345e245709be1f79ae65711c866e3e9))





# [0.1.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.0.3...@oney/payment-adapters@0.1.0) (2021-01-05)


### Features

* **adding bank account aggregate:** adding bank account aggregate and beneficiaryRepository ([df7483a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/df7483af9875f40a60de8b0460d9b374f95160d3))
* **adding bankaccount entity:** adding bankAccount entity and beneficiary ([0393403](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0393403e195c6d081bb7fce0eaabea68ebc90057))





## [0.0.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-adapters@0.0.2...@oney/payment-adapters@0.0.3) (2020-12-21)


### Bug Fixes

* **fix file extension:** fix file extension ([ca826fd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ca826fdd91c7e9793b2e415c7e9149eb1e341b8a))





## 0.0.2 (2020-12-21)


### Bug Fixes

* **adding mock for azure storage:** adding mock for azure storage ([3bc91ec](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3bc91ecf83878c88c1a06fc1af307bb234877e26))
* **fix base64 size:** fix base64 size ([5ec2b1f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5ec2b1fdb2cb8765754e48e5eaa08415ba2d17c7))
* **fix test on kyc:** fix test on kyc ([f30cc53](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f30cc5382de360a99842f8562127b60909693643))
* **fix test with blob mock:** fix test with blob mock ([28a77fc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/28a77fc91e867cddca75eed25a75f6aa65a05a24))
