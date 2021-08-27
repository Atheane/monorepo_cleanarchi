# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.32.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.31.0...@oney/payment-core@0.32.0) (2021-04-29)


### Bug Fixes

* **payment:** add upsert bankaccount feature from master to develop ([84b6008](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/84b60080c12e9421633b9973d8c7094b35eace93))
* **payment:** async debts were not correctly processed ([a0348a8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a0348a82e641aceb624558f56e2dd34e2433c122))
* **payment:** change value object AtmWeeklyAllowanceLimit verification rule ([7214fa2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7214fa26887b292462a59d3665e136438a6f93aa))
* **payment:** change value object MonthlyAllowanceLimit verification rule ([1ff240a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1ff240ad1a5834d7fde98840aa109d4f50d94272))
* **payment:** correct the transactions mapper ([e731a40](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e731a40b6a37100e7d0a533b37c6af78620c3077))
* **payment:** error of event dispatching during debt sync ([3a357ce](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3a357ced64b9d5985c94b6cb60bd947f51677412))
* **payment:** event debt collect event was not dispatched ([6a168db](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6a168db22145cd3c095625182176657de35e66db))
* **payment:** inject the mappers in the SmoneyCardGateway ([22e819f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/22e819fef5fa6d416a41b559c6c17fdad85b9554))
* **payment:** pr comment - add initial unknown diligence validation method status ([b663e88](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b663e88473c36362dfd83ecab9a34090c01dc6bd))
* **payment:** pr comment - type the smoney api error reason ([7feebe4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7feebe42fa3f8133af845fdf21434e0541765ff3))
* **payment:** pr fix ([4127a37](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4127a37ab2c1cd97bace201896053de7e5830bf8))


### Features

* **ddd:** add method hasEvents in DomainEventProducer ([51bc550](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/51bc5506158cb46dd61384ecbf349f72d8b3324e))
* **payment:** add AddBeneficiary usecase ([17cea1d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/17cea1d9be60756ce74414d5784322b7a5d45368))
* **payment:** add async debts usecase before debt collection ([dba523b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/dba523b1c50f94307b36e9f943cea0eafd66a90a))
* **payment:** add canExecute to CardHmac, DisplayCardPin and DisplayCardDetails usecases ([465011b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/465011b25dde7e14cd9a48e780a328065256a5fd))
* **payment:** add CardHmac usecase ([696d35a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/696d35ab2cf2e9ef9f605c2a6d0409ccec3e1edb))
* **payment:** add DisplayCardDetails usecase ([2e939eb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2e939eb4d9743d4229801678304b6e105556c655))
* **payment:** add DisplayCardPin usecase ([da3f3fc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/da3f3fc73934ede2688d6fdaec15cef8335bc282))
* **payment:** add DisplayCardPin, DisplayCardDetails and CardHmac routes ([44d4cf8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/44d4cf8313a2c0d3139c4a0e205e3cbe25511765))
* **payment:** add gateways for cards display, pin, hmac and add beneficiary ([34f1300](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/34f1300e7cb52b31c04ff8d4c83fb8c8ea1a3a12))
* **payment:** add GetBankIdentityStatement usecase and route ([ee158a2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ee158a20ed46cf9fd4c019198165079072635a28))
* **payment:** add SCA validations ([cc76868](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cc7686868ee44dde5360277865e12a332e6cdd63))
* **payment:** add scheduler to trigger technical limit calculation each month ([7cfa6a7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7cfa6a7b6e3e0b9427f579683fe868c8abf038e8))
* **payment:** add usecase and event handler to process clearings one by one ([9c6aa60](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9c6aa6008925928f7769b6b1b15dd58dea65b7c3))
* **payment:** add usecase to extract clearings from a clearing batch ([4e28796](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4e287968e3c0e75d402509976a8ee4a0b0ddad77))
* **payment:** add usecase to start bank account debts collections ([5f4baa7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5f4baa7950cfe3eccac72c409b42da3aebd86b64))
* **payment:** handle type 24 callback from the payment-azf smo-dispatcher ([7c597e5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7c597e5e40e954567c5288ec9e2cf7e38d11933e))
* **payment:** improve debts management to be owner of the debts and not our partner anymore ([1ecb91a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1ecb91a854a361944298aca1fc2369f43c231923))
* **payment:** throw explicit errors for P2P creation failures ([33bad9a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/33bad9aa5f1def28e6eb01116a688dae4a11b1eb))
* **payment:** use domain event to set account status to activated ([1ca3b87](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1ca3b87437551ebd778a659109ec52ae280c1600))
* **payment-core:** ACCOUNT_ELIGIBILITY_CALCULATED initiate the limits ([b8d3156](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b8d3156741669914d1d1015a69f999f299e0ecad))
* subscription - add saga to create and activate insurance membership ([ce1c405](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ce1c4053ca0814d5c9a3688c1da1a79442c28d42))
* **payment-core:** calculate spentFunds ([ed4856e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ed4856ef2f82e24db65165ff16f267880dba3df5))





# [0.31.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.30.0...@oney/payment-core@0.31.0) (2021-04-14)


### Features

* **payment-core:** updating uncaping states ([5467440](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5467440f3a32571e8e1d839799261f508c6ae33b))





# [0.30.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.29.0...@oney/payment-core@0.30.0) (2021-04-14)


### Features

* **payment-core:** Uncappe updating globalOut and Balance Limit ([030238a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/030238a9a040b5cde1a22d7afec9c7a71b418ab7))





# [0.29.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.28.0...@oney/payment-core@0.29.0) (2021-04-14)


### Bug Fixes

* **monorepo:** fix conflict ([2798c4c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2798c4cec869258826b8a38095917408c98825dd))
* **payment:** fix name long ([cf0e0a7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cf0e0a75e7b8472ba4b498a3e5c8a49ce1742d77))
* **profile:** fix test and nock ([c6c5586](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c6c55865b0cf87c3ec7a111fecfcc4208c52bad0))
* **subscription:** fix comment and test ([f123f43](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f123f43d8636a2ced53b41eb1b4555b5cc0213e6))
* **subscription:** fix conflict ([f5492b0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f5492b0ed5744ca1733f5320b690542a13a52c8e))
* **subscription-api:** adding saga ([68fbe7d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/68fbe7d7f05c2c56e6a81048e8201aaf5f219682))


### Features

* **subscription:** fix conflict ([f0d4035](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f0d403566b28b0450bddc636b607f0d7c13ced58))
* **subscription:** handle subscription saga for process subscription ([2579bf7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2579bf76c78953f93cbc0f2de35fa16755029371))
* **subscription:** handling handler ([675366c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/675366c62f3f8ad614dfcb9af4c169ae1f7f1b44))





# [0.28.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.27.0...@oney/payment-core@0.28.0) (2021-04-14)


### Features

* **payment:** add technical limits calculation for split payments processes ([a595ff6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a595ff654f1926c1dc8de90455a50173180b9bed))
* **payment:** remove wrong file technical limit calculated event ([000e851](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/000e85175a4fa51f152c7b26e02596d14ca2bdc5))





# [0.27.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.26.1...@oney/payment-core@0.27.0) (2021-04-13)


### Features

* payment - send to SMO kyc document and filters on creation if already available ([81eba6b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/81eba6bab6dcdfba01a2deaa4338300979e26ba5))





## [0.26.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.26.0...@oney/payment-core@0.26.1) (2021-04-13)

**Note:** Version bump only for package @oney/payment-core





# [0.26.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.25.1...@oney/payment-core@0.26.0) (2021-04-09)


### Bug Fixes

* **oney-message:** fixed some test event dispatcher implementation ([966e62b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/966e62bd6c6bbfd0bd2a4b75a1e0d48580929c9f))


### Features

* **oney-message:** added custom mapper / serializer option ([3efb2a7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3efb2a70265e6f1997da0bcb3181d7306d274bab))





## [0.25.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.25.0...@oney/payment-core@0.25.1) (2021-04-08)

**Note:** Version bump only for package @oney/payment-core





# [0.25.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.24.0...@oney/payment-core@0.25.0) (2021-04-02)


### Features

* **payment:** add split payment eligibility process, using cdp event ([cfb070c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cfb070c2548b874743c47068347f446b02820052))
* **payment:** change calculate exposure usecase to considere x3x4 eligibility of the user ([1374141](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/137414183fa545c0e9f7b377eef1b6af26984b3d))
* **payment-core:** uncapping gets in pending if TAX_NOTICE_VERIFIED received ([99f0d4a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/99f0d4a03810bb340dcb86a3175898cfa23df12d))
* add debt P2P references ([3085f55](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3085f55f31a8aa279cf2adbcb5719dbd099248e1))





# [0.24.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.23.0...@oney/payment-core@0.24.0) (2021-03-30)


### Bug Fixes

* **payment:** fix kyc document type for residence permit sent to SMO when ([5e867ba](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5e867bac2089ef4a07da6b599089a7aaa1298bcd))
* **payment:** pr fix ([5da5b66](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5da5b667551326372df19e3b4f52cc9729e30f01))
* **payment:** remove cycl deps from caused by operation.ts ([1289d4a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1289d4a6d5a3a53014cec6c851a7197aa1f511be))
* fix merge conflicts ([c4a3b78](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c4a3b78b44919a8077059a7f9661ccebd46f28d3))
* **payment:** fix more merge conflicts ([4758346](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4758346c0a1194d41d6114e0b7f31731c8a6830a))
* **payment:** no address was dispatched in bank account created event ([9b243c4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9b243c42d4f28936f0fe47491a3d5a11e435c604))
* **payment:** pr fix ([ff565f7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ff565f725597b2ad398843cde19785d14dcf8d1d))
* **pfm payment:** fix merge conflicts ([ae0cccd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ae0cccdab7f097173a02e2e54258bb8141dce3e7))
* **pfm payment:** pr fix ([8e1b2dc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8e1b2dca940a624d538f15e19e20ab108038b497))


### Features

* **cdp payment:** handle the account eligibility event ([59be633](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/59be63315471101280b715033703820cfe433bd8))
* **oney-messages:** fixed some tests ([e2252cf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e2252cf0279c098749cd99f3c5d7362eca0a7cad))
* **oney-messages:** migrated new develop version ([782e25c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/782e25c7e3cc940c0a135406b24cd9acd16dd45e))
* **payment:** :sparkles:  add new usecase sync bankaccount exposure ([56dcfef](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/56dcfef00278361692e76e75f2c7cf0e27e2a425))
* **payment:** emitting EvaluateAccount command if contains income (CDP checking) ([3819a91](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3819a9130f6b7bb5a13e53f68045a2145c95b2a1))
* **pfm payment:** handle the callback type 20 transactions ([9ceef0b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9ceef0b4aec9b8b25261cd5b392facbdf6ac41bb))





# [0.23.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.22.0...@oney/payment-core@0.23.0) (2021-03-12)


### Bug Fixes

* **payment:** pr fix ([ae05500](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ae05500be008bef4f42fe7e7ed1201004b02ac41))
* **payment:** rename balance limit calculated event and add cdp topic ([ed5b140](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ed5b140f52c43950c89a49923bd5f8d9f2865bb9))


### Features

* **payment:** add a handler to uncap a bank account ([86cffa2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/86cffa2c18dc9b4de2f54307650104a8fec7447c))





# [0.22.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.21.1...@oney/payment-core@0.22.0) (2021-03-11)


### Bug Fixes

* **payment:** fix orderId and test ([a3109cd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a3109cd8a7cec046b6be7a7adc8acaddbee22ff0))


### Features

* **payment:** export orderId to common-core ([c09c969](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c09c9696bb7f3bb82a3c6e0bb92cd915fa876496))





## [0.21.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.21.0...@oney/payment-core@0.21.1) (2021-03-10)


### Bug Fixes

* **notification:** make the PaymentCreated and TransferCreated handlers use the uid instead of bid ([862300e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/862300e5f8ceb76d4de92020a142e9b05ec1537d))
* **payment:** find if the transfer is P2P or SCT from the bic ([f5eac7f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f5eac7f08ac65dcea57e6b961f79ec6b3bd87299))
* **payment:** find the beneficiary from iban instead of bid ([cc042c2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cc042c2ba5cefe0076d0f8b84b8c9b0f9895b044))
* **payment:** fix P2P between clients and automatic P2Ps ([25ad3c3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/25ad3c3c6f43c3d9225b0bf6a41c70d79f3c18e6))
* **pfm payment:** fix the P2P creation and save ([4505974](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/450597474022f56f409ce820aabbafa3f6edf7b3))





# [0.21.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.20.3...@oney/payment-core@0.21.0) (2021-03-09)


### Features

* **payment:** expose endpoint emitting CheckAgregatedAccountsIncomes event ([fb86820](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fb86820707e7b9a3e772be27474f358ff93d2bb8))





## [0.20.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.20.2...@oney/payment-core@0.20.3) (2021-03-03)

**Note:** Version bump only for package @oney/payment-core





## [0.20.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.20.1...@oney/payment-core@0.20.2) (2021-02-26)

**Note:** Version bump only for package @oney/payment-core





## [0.20.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.20.0...@oney/payment-core@0.20.1) (2021-02-25)


### Bug Fixes

* payment - change value in sct in payload to camelCase ([fb017bc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fb017bcbf79ca58ea1d7221c6b407cd959bc743e))





# [0.20.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.19.0...@oney/payment-core@0.20.0) (2021-02-24)


### Bug Fixes

* **fix payment:** fix payment bank account debt method ([b285e1b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b285e1b892cf8145cdd9837e38da6efc924acffe))
* payment - accept int types for smoney kyc callbacks ([9b24555](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9b24555918f05b5b346b100056abe5e1f4507516))
* **add handler:** add Handler on BankAccount ([dd952ed](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/dd952ede8ed2cbcb420eb682f42029cc3cd2f6d2))
* **payment-core,messages,adapters:** add phone field to BankAccountCreated ([06c882e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/06c882ef4ff0769843fe48b3913b5e55de029fff))
* **reorganize payment:** reorganize payment ([44ea5ad](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/44ea5ad1c9ee170c6f242558b027eb18f0820664))


### Features

* send an email when a transfer is done ([6b1f9b4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6b1f9b47381678f08912c5866130f01ae9dd113a))





# [0.19.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.18.2...@oney/payment-core@0.19.0) (2021-02-18)


### Bug Fixes

* **payment-adapters,core,messages:** add missing fields to BankAccountCreated domain event ([41067bb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/41067bb6abf048f0058ca9729b2cd1283c4507e1))
* **payment-api,core,messages:** fix unpassed test due to the latest BankAccount refactoring ([7124327](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/71243273eddc9c82ae2a143709bb44dd588fbccf))
* **project:** add uncommited files ([f82d393](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f82d393fb88a0a779ec630dc26d609cc261ecf04))
* **project:** merge develop into feat/profile/ON-2611-bankaccountcreated-event ([ebfba73](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ebfba7390232c7d25deb375ec088000dcf9fc242))


### Features

* **payment-core,messages,adapters:** dispatch two events after the creation of a bank account ([e463d61](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e463d61264a5244d7020105169c1fee7457d5795))
* **project:** merge develop in feat/profile/ON-2611-bankaccountcreated-event and resolve conflicts ([e0dced9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e0dced9d37349c5c62357e634b550035b85ad326))





## [0.18.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.18.1...@oney/payment-core@0.18.2) (2021-02-17)

**Note:** Version bump only for package @oney/payment-core





## [0.18.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.18.0...@oney/payment-core@0.18.1) (2021-02-17)

**Note:** Version bump only for package @oney/payment-core





# [0.18.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.17.0...@oney/payment-core@0.18.0) (2021-02-16)


### Features

* **payment:** update card status updated event payload structure ([ee9f13d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ee9f13d2a9e8d7f30ddce8fe79bb6070343707e9))





# [0.17.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.16.1...@oney/payment-core@0.17.0) (2021-02-15)


### Features

* **profile, payment, common:** add additionalStreet is optional ([c897c3b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c897c3b9181d5e033620a113ac2b0526ab261f56))
* **profile, payment, common:** add additionalStreet to the user's address ([7e0a019](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7e0a019e5c1e1de2538cec1393045633c881b05a))





## [0.16.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.16.0...@oney/payment-core@0.16.1) (2021-02-12)


### Bug Fixes

* **clean-event:** fixed lint validation ([4502866](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/45028663fe35ceefdc687a36865eefddd715f5ef))





# [0.16.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.15.0...@oney/payment-core@0.16.0) (2021-02-11)


### Features

* **payment-azf:** change the LCBFT callback fields according to SMONEY's updated contract ([f1cc29e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f1cc29e7ebf5b6abfb26e5ef132274978256f564))





# [0.15.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.14.0...@oney/payment-core@0.15.0) (2021-02-11)


### Bug Fixes

* pR FIX ([4f758e8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4f758e849e9f523340392938ac0c66831329f72f))


### Features

* **project:** if applied, this commit will resolve the conflict ([1b9710f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1b9710faab12e38f82d079307611ee3fd0b561e1))
* rename smoney-ekyc to dispatcher bcz this functions dispatches events from a callback ([f37a271](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f37a271cdb0edff62159ef71bd7101d8541ddc75))
* **project:** if applied this commit will merge develop in split-api-adapters-core-on-pfm ([f4427de](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f4427de0e8dade231f2df7dfb853a557c0fd4313))
* profile - improve status handling based on OT callback ([bf6f33a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bf6f33a130d393a655eba8e628b741e55c4e0505))





# [0.14.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.13.0...@oney/payment-core@0.14.0) (2021-02-08)


### Features

* **payment-core:** add bussiness function to bankaccount entity ([54ad536](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/54ad536af7085d3ce2a78ff4ec87a2ce1268c197))





# [0.13.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.12.0...@oney/payment-core@0.13.0) (2021-02-06)


### Features

* **docs:** add living documentation ([aae039d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aae039d3d6feb08515853023e058ce7fd59a6c11))





# [0.12.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.11.2...@oney/payment-core@0.12.0) (2021-02-06)


### Bug Fixes

* **add event lib:** add event lib ([72b3a83](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/72b3a83691ba9036cd9faf0ee4a9a8332f48e3f9))
* **fix comment:** fix comment ([fec59b9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fec59b94e3ca7d8de530ff32f7f040fcc1c75e8c))
* **fix conflict:** fix conflict ([a5edbbc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a5edbbcafaab0fdc6106aad32508858f30e8d36a))
* **fix conflict:** fix conflict with dev ([69673dd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/69673ddbbf61324a29e8665bd8eab7e1c400be63))
* **harmonize typing:** harmonize typing ([3843458](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3843458ea24ba3f00d6a6450b3a526653ef8ac2e))


### Features

* **adding event libs:** adding event libs message for aggreg payment profile ([fe86f03](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fe86f03a9b54241aa374ac770bfae3926621b956))
* **harmonise:** harmonise handlers, fix typing between bounded context, fix tests ([2e1ae6c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2e1ae6c76d57dad05990537edae34a819e16338c))





## [0.11.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.11.1...@oney/payment-core@0.11.2) (2021-02-05)

**Note:** Version bump only for package @oney/payment-core





## [0.11.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.11.0...@oney/payment-core@0.11.1) (2021-02-05)


### Bug Fixes

* **debt:** fix debt equals method ([82dcdba](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/82dcdba2e16f5eba23dcb7f10c9fe599285be40d))





# [0.11.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.10.2...@oney/payment-core@0.11.0) (2021-02-05)


### Bug Fixes

* payment - fix typo in update monthly allowance usecase ([210ec4c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/210ec4ce1f7ca23f6a6ff08dbbddcda75af5b914))


### Features

* payment - remove get limits from createBankAccount and add get limits on getBankAccount ([1a58cf2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1a58cf2225ed0a60130cccd5b11d4085ff3ffdc6))





## [0.10.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.10.1...@oney/payment-core@0.10.2) (2021-02-03)

**Note:** Version bump only for package @oney/payment-core





## [0.10.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.10.0...@oney/payment-core@0.10.1) (2021-02-03)

**Note:** Version bump only for package @oney/payment-core





# [0.10.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.9.2...@oney/payment-core@0.10.0) (2021-02-03)


### Bug Fixes

* **on-2241:** add dispatch kyc diligence succeeded event ([8bacd95](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8bacd959db4d11d65e9cadadbdc8193ebd244487))
* **on-2241:** fix pr comment - fix typo ([e556d34](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e556d34d58f9bde9418d80c530685ea6f518cd8c))
* **on-2241:** fix pr comment - fix typo ([75ce3c5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/75ce3c5d84b87db9a6f5fb53e8aee35ea2a26bb4))
* **on-2241:** fix pr comment - fix typos on diligence status enum ([1c9b0e0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1c9b0e00e3f2571144dda9e16812766c59955152))
* **on-2241:** fix pr comment - rename diligencestatus to kycdiligencestatus ([2432f30](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2432f307a0bcecf71d90f78c8df11ca6e41de0c3))
* **on-2241:** fix pr comment - renaming ([1b4ba76](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1b4ba76687c2bb5082cb4bc0076515342941e943))
* **on-2241:** update bank account diligence status property ([8426260](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/84262603c80bb507fa02c427b321c51a7e7015aa))


### Features

* **on-2241:** add handler in payment for profile activated event and notofy smo ([f7461b5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f7461b5a204194f108e5ceff1f98a6af466fadfb))





## [0.9.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.9.1...@oney/payment-core@0.9.2) (2021-02-02)


### Bug Fixes

* **opqskdk:** opqskdk ([ecc6a69](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ecc6a69805958fe95f1407c9bdbc902b3711811f))





## [0.9.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.9.0...@oney/payment-core@0.9.1) (2021-02-02)

**Note:** Version bump only for package @oney/payment-core





# [0.9.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.8.0...@oney/payment-core@0.9.0) (2021-02-02)


### Bug Fixes

* change to the right status after diligence sct in ([3cefd03](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3cefd035e98520310824f4b00db29ce679bb055f))
* fix saving after card toggle changes ([b124315](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b1243152c552f9bb8abf03f84a85b3770205b363))
* rename tin to fiscalNumber ([92a538c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/92a538cad29113b99bfe33c74d7ea4c1e2817a5b))
* **fix conflict:** fix conflict ([99f6897](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/99f6897ef0dfde11e471368ba4a7a41be823a708))
* **fix diff with develop:** fix diff with develop ([b6b0fe4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b6b0fe471ba18c06374ef401a7274f5acb322a61))
* **fix event libs:** fix event libs ([6ceabe6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6ceabe67894319ed6c37702785d72eb41a96fdd1))
* **fix nationality:** fix nationality ([f741935](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f7419350123bbc8f6665c6c2d8345bcf4a1d1f5d))


### Features

* add domain event when monthly allowance updated ([19d3299](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/19d3299cd068bb53fe442aa847d64806a17766e3))
* in profile, rename marriedName to legalName ([e33ab42](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e33ab423a11284851c010fced554d1c45002644d))
* remove economicactivity from the smo account creation and update ([c16e4d1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c16e4d112aad754fffd233d2da7729fa7dc59711))
* update payment call from profile ([201ce8f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/201ce8f6238c7c85e9d04ec32bf8515264acb185))
* update payment with the declarative fiscal call ([e3eb288](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e3eb288d114e38d9c9e00b43b64cf7c4634c5eb5))
* **add payment-events:** add payment-events ([32ce87f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/32ce87fdd95e0a970a22870f09578542bb4065ac))





# [0.8.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.7.1...@oney/payment-core@0.8.0) (2021-01-28)


### Bug Fixes

* fix pr feedbacks ([5c1f3e9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5c1f3e977245752165cdd946702fb87b64f94dec))
* fix typos ([679e463](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/679e463dd39ad35d69c377f9660e4e1173ab60c3))


### Features

* endpoint to get bank account ([59e22f9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/59e22f926cf24d15a58dd1930b9487e2e441647c))
* replace allowance gateway by simple function ([bee7179](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bee7179220a44dcda22cb1368ac764b6c480e743))
* update monthly allowance on new transac ([7427bb3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7427bb3770e6cb98f51a77c38519178ab4e5f656))





## [0.7.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.7.0...@oney/payment-core@0.7.1) (2021-01-26)

**Note:** Version bump only for package @oney/payment-core





# [0.7.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.6.1...@oney/payment-core@0.7.0) (2021-01-26)


### Features

* **adding bankaccount and address step:** adding BankAccount and Address step in monorepo ([286927e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/286927e5b634e9308c74503f734983610d771d42))
* add fiscal status usecase + payment account update usecase and route ([305e6b8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/305e6b8ebd4a3ab5de20c5919de5333d880f871c))
* add odb payment api service and OT folder update ([37d97ff](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/37d97ff3a281c09f5da341903e2fda0a5be5ca63))
* setup fiscal status tests ([49b7088](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/49b7088ee5a53712bbc9fd2656cd9c437fedec60))





## [0.6.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.6.0...@oney/payment-core@0.6.1) (2021-01-20)

**Note:** Version bump only for package @oney/payment-core





# [0.6.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.5.2...@oney/payment-core@0.6.0) (2021-01-20)


### Features

* add LCB/FT Smoney callback handling ([a781ebb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a781ebbd01c4da2d12cabe555bac3c556688eb67))





## [0.5.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.5.1...@oney/payment-core@0.5.2) (2021-01-14)


### Bug Fixes

* fix event type in kyc decision event handler ([1b02058](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1b020587d250dfa6844f1d5939ea7ea75645638c))





## [0.5.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.5.0...@oney/payment-core@0.5.1) (2021-01-13)


### Bug Fixes

* fix conflict merge issues ([6738007](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/67380076c53ce808c11a4310fd10b38a0dc22072))
* fix issues related to the domain events subscriptions and send ([6f25cce](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6f25cce1c42727ce6c325573d70dcbc3e01dc6d0))





# [0.5.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.4.0...@oney/payment-core@0.5.0) (2021-01-12)


### Bug Fixes

* use a gateway instead of a repository for Smoney KYC ([3807dff](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3807dffb1701c20121445e0b5fa1b0fca390e8f3))


### Features

* migrate sending kyc filters to S-Money in mono repo ([b87ae56](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b87ae5681c2089f0e7694ef8a44a8fb825beb7d0))





# [0.4.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.3.1...@oney/payment-core@0.4.0) (2021-01-08)


### Bug Fixes

* fix conflicts ([22f946b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/22f946b09b00ea6e931473841fc4f801714091f3))


### Features

* add the diligence SCT in handler and usecase in profile ([37d810e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/37d810e4cb8ee8b579069429566642397ca617e5))
* correct the callback type 31 payload according to the documentation ([4cb8012](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4cb8012e6262ef77776ad4a34353dc76e719ea4e))
* move the smoney-ekyc domain and adapters to payment-core and payment-adapters ([fbd01fc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fbd01fc069eecb47ff8e9fccc84516512d71954d))





## [0.3.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.3.0...@oney/payment-core@0.3.1) (2021-01-08)

**Note:** Version bump only for package @oney/payment-core





# [0.3.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.2.1...@oney/payment-core@0.3.0) (2021-01-07)


### Bug Fixes

* **on-2724:** fix pr comments ([0267247](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/02672472484f3e77c6052a14a87d4044c53a26a5))


### Features

* **on-2724:** migrate get partner user data core and adapters logic ([c513089](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c513089ec7f87f518d404558bb0f8713e9adeb66))





## [0.2.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.2.0...@oney/payment-core@0.2.1) (2021-01-07)


### Bug Fixes

* **fix conflict:** merge develop and fix conflict ([c8261e2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c8261e28d10dd028c65184f6b0fde6a4bab014ef))
* **fix import:** fix import ([196889c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/196889c526ee20bb32daad45bb59e48cb134ddc2))
* **fix method in aggregate root:** fix method in aggregate root and refactor entity ([685aebe](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/685aebecc1f4e925bf8557c74dd0676e9dfd0ac4))





# [0.2.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.1.0...@oney/payment-core@0.2.0) (2021-01-06)


### Features

* add 1 new case to match ot decision on status ([a6f69af](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a6f69af72e79c0118da292991c53d1420e9fa4d4))





# [0.1.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.0.3...@oney/payment-core@0.1.0) (2021-01-05)


### Features

* **adding bankaccount entity:** adding bankAccount entity and beneficiary ([0393403](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0393403e195c6d081bb7fce0eaabea68ebc90057))





## [0.0.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/payment-core@0.0.2...@oney/payment-core@0.0.3) (2020-12-21)


### Bug Fixes

* **fix file extension:** fix file extension ([ca826fd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ca826fdd91c7e9793b2e415c7e9149eb1e341b8a))





## 0.0.2 (2020-12-21)

**Note:** Version bump only for package @oney/payment-core
