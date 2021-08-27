# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.41.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.40.1...@oney/profile-core@0.41.0) (2021-04-29)


### Bug Fixes

* **on-4379:** fixed case sensitive issue ([34efb07](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/34efb07a7727a14e70835c85933eefd1c48ed09f))
* **payment:** pr comment - add initial unknown diligence validation method status ([b663e88](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b663e88473c36362dfd83ecab9a34090c01dc6bd))
* **profile:** add the missed countries to CountriesList/CountryCode ([77d937b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/77d937ba9fe25555121c92df9767445a04d779cc))
* **profile:** add updated information to the contract ([6620082](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6620082af5af975cb97b716013ec9e45670632a1))
* **profile:** call dataRecovery api when tax notice is uploaded - ON-4509 ([2986c7a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2986c7ac9a115d129574d2995f2082ef91666fca))
* **profile:** fix profile event handler for AZF ([478e131](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/478e1318e49b55444c5d2f42092186141d799ad4))
* **profile:** fix profile status update - ON-4777 ([a310052](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a3100529f4b238ad81e2503d2043b5078c96543a))
* **profile:** remove the otp deletion during phone step ([23facfe](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/23facfecf40a9320902cb96589459dca9b22152c))
* **profile:** revert last commit ([085d7f7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/085d7f711c22af9d710ec8aa440b37800e438bce))
* **profile:** set eligibilityReceived to true when event is received ([35f1505](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/35f150510d4a1ab5c8c2a7d2f6e8aa5972565c14))
* **profile:** update profile status when it's new and not null - ON-4584 ([16816f3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/16816f31edc29359c6df89ef12109df5151ec2ff))
* **profile-core:** add the fix for the unwanted update of status ActionRequiredTaxNotice to OnHold ([64a3ffe](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/64a3ffecb5722c9759ab4708fbd32d40f3c91f5e))
* **profile-core, document-generator:** add the update of the phone number on the contract ([9a80dc8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9a80dc8ce2662d3cc0338d749a4929e01decccfe))
* profile - set user on_hold after signing contract if no received callback to deal with ([dad6209](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/dad6209902fc2710e8aee9cb2abbaef6e8cdd55a))
* **project:** merge develop into feat/ON-4115 branch and fix merge conflicts ([796388b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/796388b5f1af8f4d0c411d7876b38fabb9873984))
* **project:** merge develop into feat/ON-4116 and resolve conflicts ([b94d362](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b94d36296aeeae8740377c0ecc77e027fca9216e))


### Features

* **profile, document-generator:** add htmlToPdf in env variables ([02a51e5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/02a51e565b4d225c62b24969f1bc82e1bcb54e4d))
* subscription - add saga to create and activate insurance membership ([ce1c405](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ce1c4053ca0814d5c9a3688c1da1a79442c28d42))
* **authentication,profile:** add PHONE_OTP_CREATED handler and take pr reviews into account ([0234d7f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0234d7f54250f70349de0953fffd419d98ea1ad5))
* **payment:** handle type 24 callback from the payment-azf smo-dispatcher ([7c597e5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7c597e5e40e954567c5288ec9e2cf7e38d11933e))
* **profile:** add check application_person_id_field SID for update ([f30aeb6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f30aeb6d45b92e2c3069734aa248db26383fff0e))
* **profile:** phone otp migration from odb_account ([0b72bce](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0b72bce0449e6390497fcf89ca74fadfb99ab4b1))
* **profile:** update the ficp/fcc workflow ([3e821cb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3e821cb2f85ef08282314e75a84fb35f9a630944))
* **profile, document-generator:** add change to lib document-generator and update profile ([668f8b6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/668f8b6c3223f85eb6f815b6541144e46449ccfc))
* **profile,notification:** limit OTP generation to 5 attempts/user/day ([5e4cdbf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5e4cdbf493089a55d12e4f7b32f14dbcee936e89))
* profile - make update contract_references in OF asynchronous ([64183e2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/64183e2cf0503d4df507671a3145c07ba42ef3f3))





## [0.40.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.40.0...@oney/profile-core@0.40.1) (2021-04-15)


### Bug Fixes

* profile - replace status with profileStatus in signcontract ([4971b5b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4971b5bdcb6cc81ea22bbc223dac83fe1026ff6d))
* profile / payment - improve status update on signContract and catch errors on StorageGateway ([8c3581a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8c3581ac55db78fcf12ddb75f770def9e71c2963))





# [0.40.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.39.0...@oney/profile-core@0.40.0) (2021-04-14)


### Features

* **payment-core:** Uncappe updating globalOut and Balance Limit ([030238a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/030238a9a040b5cde1a22d7afec9c7a71b418ab7))





# [0.39.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.38.5...@oney/profile-core@0.39.0) (2021-04-14)


### Bug Fixes

* **profile:** fix test and nock ([c6c5586](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c6c55865b0cf87c3ec7a111fecfcc4208c52bad0))
* **subscription:** fix conflict ([f5492b0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f5492b0ed5744ca1733f5320b690542a13a52c8e))
* **subscription-api:** adding saga ([68fbe7d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/68fbe7d7f05c2c56e6a81048e8201aaf5f219682))


### Features

* **profile-subscription:** adding subscription step in profile with handler ([691480a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/691480ab8e60fcbc3f42213ceeee695d2c6fdef3))
* **subscription:** fix conflict ([f0d4035](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f0d403566b28b0450bddc636b607f0d7c13ced58))
* **subscription:** fixing comment ([98fd563](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/98fd5635a1f79989f61a389d86fdc8b090a7b8b2))
* **subscription:** handle subscription saga for process subscription ([2579bf7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2579bf76c78953f93cbc0f2de35fa16755029371))





## [0.38.5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.38.4...@oney/profile-core@0.38.5) (2021-04-14)


### Performance Improvements

* profile - add timeout on cdp request ([7cb1eda](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7cb1eda0145a3b88852dc396f633e4306f342555))





## [0.38.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.38.3...@oney/profile-core@0.38.4) (2021-04-13)


### Bug Fixes

* **profile:** delete getCustomerSituations call from civilStatus step ([10b7e0b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/10b7e0b0c56b9117cef22f06eb51c479189564ca))
* **profile:** remove unused property ([7e9b442](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7e9b4426be625856cc8febedb778038242b09303))





## [0.38.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.38.2...@oney/profile-core@0.38.3) (2021-04-13)

**Note:** Version bump only for package @oney/profile-core





## [0.38.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.38.1...@oney/profile-core@0.38.2) (2021-04-08)


### Bug Fixes

* profile - persist only one consent object ([52a56b3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/52a56b3aa757088e6bafdc7652e00a88eafb9997))





## [0.38.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.38.0...@oney/profile-core@0.38.1) (2021-04-08)

**Note:** Version bump only for package @oney/profile-core





# [0.38.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.37.2...@oney/profile-core@0.38.0) (2021-04-08)


### Features

* **profile:** add console log for investigation ([07659bc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/07659bc4302a04a0880f864954dfe4276099e99b))





## [0.37.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.37.1...@oney/profile-core@0.37.2) (2021-04-07)


### Bug Fixes

* **profile:** fix when cdp eligibility is not yet received ([5957dd1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5957dd1a9c7aa829c6f6022cef66dff3b387ef68))





## [0.37.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.37.0...@oney/profile-core@0.37.1) (2021-04-07)

**Note:** Version bump only for package @oney/profile-core





# [0.37.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.36.1...@oney/profile-core@0.37.0) (2021-04-06)


### Features

* **profile:** add call fcc and send event FicpFccCalculated ([fdd27fd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fdd27fdf12e7813482ac5f01558fdbf07c23329a))
* **profile:** add test for GetFicpFcc ([34191e0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/34191e002a9c265319d970a90cb09ba96ac2e903))





## [0.36.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.36.0...@oney/profile-core@0.36.1) (2021-04-06)

**Note:** Version bump only for package @oney/profile-core





# [0.36.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.35.0...@oney/profile-core@0.36.0) (2021-04-06)


### Features

* profile - not activate user if not onwer of aggregated account ([a365367](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a365367df2b347031752cdb98a97e4b8c25928bd))





# [0.35.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.34.1...@oney/profile-core@0.35.0) (2021-04-02)


### Features

* **profile:** add ficp post request to get ficp_flag ([861cec0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/861cec01df8aefa1365d7536879fa24ebc541d99))
* **profile:** add ficp use case ([17ac5ce](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/17ac5ceeaacddaab3a80895445b1a68980a7687b))
* **project:** merge branch 'develop' into feat/ON-3515-ficp-api-integration ([0467364](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0467364661d13630649ac026625d419e73107f43))





## [0.34.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.34.0...@oney/profile-core@0.34.1) (2021-04-02)


### Bug Fixes

* **profile:** fix the get customer_situations request ([508a6a4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/508a6a4cfb9e59fbf1585fa1d9cd79ab90b649f5))
* **project:** merge develop into fix/ON-3611 and resolve conflicts ([c804048](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c80404857a12e169a4147f7223c0c31e953ef2e6))





# [0.34.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.33.1...@oney/profile-core@0.34.0) (2021-04-02)


### Bug Fixes

* profile - not delete KYC file if new KYC is created ([41d2bac](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/41d2bacc585884feb82c6d7b8b27e09fbfa7e4f7))
* **merge:** conflicts ([2aa376b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2aa376b18d535b422fbea4674c4ed4a3a26c6637))


### Features

* **authentication-profile:** add ability to check register/create with phone ([1ff638b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1ff638bd1fc861d5c2f8c63a6da4c67e134fc4d4))
* **eligibility:** review cdp-messages interfaces according to discussion with PA and ABenj ([64d54bc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/64d54bc0f0da8c0db95e53dbd9fbc00b67779f7e))
* **profile:** add UpdateConsents usecase ([83ab680](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/83ab680c9f5cb889006f6e04221e2d813fb4f554))
* **profile subscription:** set or update the CNIL/LEN information during the civilstatus step ([e60d543](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e60d54347662d28d92ec1079bbda9cf6422a6354))
* profile - add new case api and separate form-data calls ([69a5d80](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/69a5d8022b9e513c6c21c9055ac5015b88a7f007))





## [0.33.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.33.0...@oney/profile-core@0.33.1) (2021-03-31)

**Note:** Version bump only for package @oney/profile-core





# [0.33.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.32.0...@oney/profile-core@0.33.0) (2021-03-30)


### Bug Fixes

* **aggregation:** tests were failing because of missing env variable ([a7f8b9a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a7f8b9a6f593a1292ec0acaa31f61b301b65ab83))
* **payment:** fix more merge conflicts ([4758346](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4758346c0a1194d41d6114e0b7f31731c8a6830a))
* **pfm payment:** fix merge conflicts ([ae0cccd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ae0cccdab7f097173a02e2e54258bb8141dce3e7))
* **profile:** fix birth_country mapping for OFR ([0c7c159](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0c7c1591e1c8334af6be10126ab1ac228b42200e))
* **profile:** fix build EventDispatcher should come from @oney/message-core ([9ab61c3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9ab61c3e0bf70ca60b1a01ebe30e2730d2797e2a))
* **profile:** fix merge conflicts ([fedf007](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fedf0078e2931280e4667a852afa06007979a2b3))
* **profile:** fix test failing in remote build, cause events interface changed ([93a9948](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/93a9948e278eb15a43ecc2a02b36fcb046a7d8f3))
* **profile:** take into account PR reviews ([20f2bd7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/20f2bd75f3d4231902b8473c2ae219d721d9d7c2))
* **profile-core:** fix build ([aaf5b7e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aaf5b7ea6418f2656340bb7af354f847f9452a65))
* **profile-core:** should fix 500 if birthdate not provided ([288c26b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/288c26b667b777a066e537f36b577404aa504ab1))
* fix merge conflicts ([c4a3b78](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c4a3b78b44919a8077059a7f9661ccebd46f28d3))
* profile - improve profile change status local event handling ([ad584c2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ad584c275b26097b4cbb7635bcbf5674aed37065))
* profile - persist nationality from id step and not civil status step ([d9d4f03](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d9d4f038ec83965795bc0239d817e6c20e43cf02))
* **profile:** update create account contract ([e43c744](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e43c74417340b89e406d785c25e8178ea5485704))
* **project:** update the build of document-generator ([d0d0e3b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d0d0e3bc92227eca77762da21be341af131489e5))
* profile - Save aggregate on fiscal status step at the end of the usecase ([7e2daee](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7e2daeee96865a51152e3dd0e31c9af4c74e6c08))


### Features

* profile - add kyc versionning ([d67a6e3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d67a6e30cc8c1b5f9e275e4730dcaa23b8eb9c95))
* profile - add new endpoint to upload Tax Notice ([4615074](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/46150741cf1da100a22aeebb9614e0eecdfaf457))
* **notification:** add customerServiceEvent handler ([e942a60](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e942a60a3da4859772302dee06f8dde7c856d8bd))
* **pfm payment:** handle the callback type 20 transactions ([9ceef0b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9ceef0b4aec9b8b25261cd5b392facbdf6ac41bb))
* **profile:** add an endpoint to get the contract document ([f68b7ff](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f68b7ff3c1dd22a685881197784a43ca171bfb73))
* **profile:** add CUSTOMER_SERVICE_DEMAND_SENT and usecase SendDemandToCustomerService ([07fac42](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/07fac42678c90d53760b0200e7b4e4068db08ec6))
* **profile-api:** add endpoint to get customer service topics ([170bba0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/170bba05597da8fdd72d7385fd226ab71e16fbfb))
* **profile-api:** endpoint to post customer service demand ([87305a9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/87305a9d72c16214ab9b7d25f05773a163585ee3))
* **profile-core,adapters,api:** add an endpoint to get signed/unsigned contract ([a1bfaa5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a1bfaa50b8e516a13693c1ce4facc509774b4671))
* **profile-notification:** add email template for customer service, and birthname prop ([5decdc6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5decdc68ec83b6a0d356008191cd8503ef12d70e))
* **profile-notification:** birthname should be optional ([410d001](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/410d0019ef77ecd4c46bf84fe8607a54e196435c))
* **profile,payment,auth:** add birthDepartmentCode and birthDistritCode to the Profile ([bd15974](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bd15974135c231500824364866950070fe2d3896))
* profile - dispatch event when status profile changed ([44463f2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/44463f2ed6411826f22414b9e79df24883da4bbd))





# [0.32.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.31.0...@oney/profile-core@0.32.0) (2021-03-15)


### Features

* **profile:** add type ContractDocumentRequest and its use ([34d53a1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/34d53a10f02db5a8611fb4e773d3af501fa587b8))
* **profile:** update endpoint signContract ([e3ad29a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e3ad29ace866cfb66856f3f89781e985fffded86))
* **project:** merge branch develop into feat/on-3795 ([5564810](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5564810e8f3520b30c7436af8b51e209b81af7dd))
* **project:** merge feat/on-3795 in feat/on-3701 ([f833bb3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f833bb39c34664f51c4816c43473e665f4678fab))





# [0.31.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.30.1...@oney/profile-core@0.31.0) (2021-03-12)


### Features

* profile - add new rejected and required tax notice tips ([485a9a0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/485a9a065514bf43d8748be803968086ce685c4c))





## [0.30.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.30.0...@oney/profile-core@0.30.1) (2021-03-10)


### Bug Fixes

* **profile:** fix enum and remove static ([3f67c59](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3f67c59e5cf94351b25e78927925046a900de955))
* **profile:** fix onboarding step order ([d7bec86](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d7bec86213a6a136e08d5b56a68009d051f5a057))
* **profile:** fix type in constructor ([1598ee4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1598ee4e7e84a5e440b6f089500e181ab2bc689b))
* **profile:** rm optional in CreateProfile usecase ([6bd5075](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6bd50757c4620ceacef4b1531108d16d424d5a12))





# [0.30.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.29.0...@oney/profile-core@0.30.0) (2021-03-10)


### Features

* profile - Add endpoint to verify if user is the bank account owner ([5805bae](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5805bae1d20d83231f5d173e38dc60bcc18225f7))
* profile - specify uniq event ID for OT events API ([f7db025](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f7db025678bdd341beefd5f268a3916970e6b4b4))





# [0.29.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.28.2...@oney/profile-core@0.29.0) (2021-03-08)


### Bug Fixes

* **project:** merge develop into feat/ON-2660-getcutomersituations and resolve conflicts ([f696242](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f696242838468f8c3a54fe6899082e1f71ea800a))
* **project:** merge develop into feat/ON-2660-getcutomersituations, fix conflicts and broken tests ([5b33c3e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5b33c3e896c8a344be0068e81518891923519cf8))


### Features

* **profile-core,api,adapters:** implements GetCustomerSituations use case / ON-2660 ([f16881b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f16881bc2b6dfed9fb6422d41e21fa52070a6eee))





## [0.28.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.28.1...@oney/profile-core@0.28.2) (2021-03-05)


### Bug Fixes

* payment / profile - move test on status modification in aggregate methods ([ab78f1e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ab78f1e48b557cf1d6c69a7a4ba80694faa53b72))
* profile / payment - don't change status after activation even if new callback received ([e56174a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e56174a72b2865ae75a0952576de4eef88e414ef))





## [0.28.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.28.0...@oney/profile-core@0.28.1) (2021-03-04)


### Bug Fixes

* **fix comment:** fix comment ([3bece2a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3bece2a18b960adcc6ccf7b211ce352fd1b871df))
* **profile:** add DigitalIdentity entity ([27efe1a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/27efe1a517e3e51fb831d2696fd36fa8c33aa915))
* **profile:** fix digitalIdentity field for setting id ([3d48622](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3d486225705dc5c189fbc244aabdb0eec0a40cd4))
* **profile fix comments:** profile fix comments ([d949add](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d949addd209d45bc65eff57c9d069d836cd1622e))
* **profile rm createdstep:** profile rm CreatedStep ([4f09af1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4f09af12546d99cecc3994bda41613cab19639d4))
* **profile-core:** fix lint ([68df38f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/68df38fe5243fbcb36464ff297d9e7d0451ea951))





# [0.28.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.27.1...@oney/profile-core@0.28.0) (2021-03-03)


### Bug Fixes

* **fix comments:** fix comments ([a5eb386](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a5eb3860ab62174717dea626743eee8dcc0b63b3))


### Features

* **profile:** migrate register in monorepo ([87255ef](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/87255efa6cb1fc11ee7955186cc008caca1e583b))





## [0.27.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.27.0...@oney/profile-core@0.27.1) (2021-03-03)

**Note:** Version bump only for package @oney/profile-core





# [0.27.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.26.4...@oney/profile-core@0.27.0) (2021-03-03)


### Features

* profile - send PROFILE_ACTIVATED when SCT_IN done and validated ([8a5d54b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8a5d54b83ae2b006e9de51579b9bfe414b46c971))





## [0.26.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.26.3...@oney/profile-core@0.26.4) (2021-03-02)

**Note:** Version bump only for package @oney/profile-core





## [0.26.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.26.2...@oney/profile-core@0.26.3) (2021-03-01)


### Bug Fixes

* profile - push back bank account creation based on addess step validation ([5142fa4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5142fa4fb8501bb8b87603733a5a7a6400672ece))





## [0.26.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.26.1...@oney/profile-core@0.26.2) (2021-03-01)


### Bug Fixes

* profile - Add feature flag for Oney FR contract create and update ([b81aac3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b81aac34a9c06a03b6fec25550576a5fdae95914))





## [0.26.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.26.0...@oney/profile-core@0.26.1) (2021-03-01)

**Note:** Version bump only for package @oney/profile-core





# [0.26.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.25.3...@oney/profile-core@0.26.0) (2021-03-01)


### Features

* **profile-core,api,adapters:** add masterReference to the payload sent to Oney Trust ([44a8c77](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/44a8c77d32fbd08748641e34fb6f6472df180c8c))





## [0.25.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.25.2...@oney/profile-core@0.25.3) (2021-02-26)

**Note:** Version bump only for package @oney/profile-core





## [0.25.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.25.1...@oney/profile-core@0.25.2) (2021-02-25)

**Note:** Version bump only for package @oney/profile-core





## [0.25.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.25.0...@oney/profile-core@0.25.1) (2021-02-25)


### Bug Fixes

* profile - update props for diligence SCT IN handler ([a8c2950](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a8c2950f79a4713ff2a472200cc47717b1c27fb2))
* profile - update props for diligence SCT IN handler ([8565c86](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8565c86da451fe6449e35d0dc19571250570313c))





# [0.25.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.24.0...@oney/profile-core@0.25.0) (2021-02-24)


### Bug Fixes

* **add example:** add example how to use ([69b97c7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/69b97c7bcd8034ad5c158266b92ee84971581b2e))
* **add handler:** add Handler on BankAccount ([dd952ed](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/dd952ede8ed2cbcb420eb682f42029cc3cd2f6d2))
* **fix:** fix ([0221fd5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0221fd5532e911aea51e565489ff8f88420faa07))
* **fix conflict:** fix conflict ([a49ed16](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a49ed16787f15f1b4b06f3192ca48d49e80b3389))
* **fix conflict:** fix conflict ([d175966](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d17596600519b947a9670391108095aaa8bce4de))
* profile - Add handling for subResult_compliance and actionRequiredId ([88df428](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/88df428da7e839454aa514f8b0d5d122c5ccca52))
* profile - add the document Side as an optionnal value for identityDocument endpoint ([61936b0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/61936b084dd2c60070e98c1aa7c162e9a23479c6))


### Features

* **globalconfig.json:** merge develop in feat/3283 and resolve conflits in globalConfig.json ([0d97717](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0d9771708e59bc4e4ea7ac778fe6d244734914cc))
* **profile:** add the migration of GetCustomers ([aa24012](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aa240129c340e70954163ca4264b375419c2613c))
* **profile:** add the sending of the event CUSTOMER_CREATED_OR_UPDATED ([44b8a67](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/44b8a67e270b1f2ecebc05d58ea301588eadfce1))
* **profile:** add the SITUATION_ATTACHED event and remove the CUSTOMER_CREATED_OR_UPDATED event ([03aa195](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/03aa1957f3bffeba424a6b6940ae3c4e89075f38))
* **project:** merge develop in feat/3283 ([d75b726](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d75b72666d2c911487fc545c6509d7595a6008c7))





# [0.24.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.23.2...@oney/profile-core@0.24.0) (2021-02-18)


### Bug Fixes

* **payment-api,core,messages:** fix unpassed test due to the latest BankAccount refactoring ([7124327](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/71243273eddc9c82ae2a143709bb44dd588fbccf))
* **project:** merge develop into feat/profile/ON-2611-bankaccountcreated-event ([ebfba73](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ebfba7390232c7d25deb375ec088000dcf9fc242))
* **project:** pull develop and fix conflicts ([c4e808f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c4e808f5b83ba6f98aca36bb7633ee1e1b728239))


### Features

* **project:** merge develop in feat/profile/ON-2611-bankaccountcreated-event and resolve conflicts ([e0dced9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e0dced9d37349c5c62357e634b550035b85ad326))





## [0.23.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.23.1...@oney/profile-core@0.23.2) (2021-02-18)


### Bug Fixes

* profile - Bring back control on birthdate and birthcountry for civilStatus step ([9b7adb3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9b7adb354ddbde7f5f49ec767dfef967142047d7))
* profile - ensure that we don't set undefined birth country or date in profile model ([a6c3f5f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a6c3f5fbdbbfa52e19821d5330fef87d498e5fc5))





## [0.23.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.23.0...@oney/profile-core@0.23.1) (2021-02-17)

**Note:** Version bump only for package @oney/profile-core





# [0.23.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.22.0...@oney/profile-core@0.23.0) (2021-02-17)


### Features

* profile - Add tips for ACTION REQUIRED ID status ([c2c3393](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c2c3393f88ce9ad8d7b6fa4d14500b6e26e634af))





# [0.22.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.21.1...@oney/profile-core@0.22.0) (2021-02-16)


### Features

* profile - update Oney FR contract references when contract signed ([9c24fe2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9c24fe2897546c19b182ae138ef249d1add73711))





## [0.21.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.21.0...@oney/profile-core@0.21.1) (2021-02-16)

**Note:** Version bump only for package @oney/profile-core





# [0.21.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.20.3...@oney/profile-core@0.21.0) (2021-02-15)


### Features

* **profile, payment, common:** add additionalStreet is optional ([c897c3b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c897c3b9181d5e033620a113ac2b0526ab261f56))
* **profile, payment, common:** add additionalStreet to the user's address ([7e0a019](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7e0a019e5c1e1de2538cec1393045633c881b05a))





## [0.20.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.20.2...@oney/profile-core@0.20.3) (2021-02-12)


### Bug Fixes

* profile- use STOP instead of FAILURE because OT cannot manage FAILURE ([06bf208](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/06bf208280683f84e7c44d5176f2b893fe54612f))





## [0.20.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.20.1...@oney/profile-core@0.20.2) (2021-02-12)

**Note:** Version bump only for package @oney/profile-core





## [0.20.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.20.0...@oney/profile-core@0.20.1) (2021-02-11)

**Note:** Version bump only for package @oney/profile-core





# [0.20.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.19.0...@oney/profile-core@0.20.0) (2021-02-11)


### Features

* profile - Add call to oneytrust to ask for a case analysis and trigger a callback ([7ca1d09](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7ca1d09e9eea03a1095884554fa1f13d63655f23))





# [0.19.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.18.0...@oney/profile-core@0.19.0) (2021-02-11)


### Features

* **payment-azf:** change the LCBFT callback fields according to SMONEY's updated contract ([f1cc29e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f1cc29e7ebf5b6abfb26e5ef132274978256f564))





# [0.18.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.17.0...@oney/profile-core@0.18.0) (2021-02-11)


### Bug Fixes

* add generic OTP to validate phone and change dispatchEvent() for dispatch() ([51d1171](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/51d1171e518e254bca28ee3aedcdf15a77c96852))
* profileAzf - improve validation body request and tips handling ([479f698](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/479f69898b37831cc229e54fb1617a2f9e81664a))


### Features

* profile - Add error code for otp and validate phone ([86e76f5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/86e76f5a175be49c5e6a6458b882eaccfddb1d9b))
* **project:** if applied, this commit will resolve the conflict ([1b9710f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1b9710faab12e38f82d079307611ee3fd0b561e1))
* rename smoney-ekyc to dispatcher bcz this functions dispatches events from a callback ([f37a271](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f37a271cdb0edff62159ef71bd7101d8541ddc75))
* **project:** if applied this commit will merge develop in split-api-adapters-core-on-pfm ([f4427de](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f4427de0e8dade231f2df7dfb853a557c0fd4313))
* profile - improve status handling based on OT callback ([bf6f33a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bf6f33a130d393a655eba8e628b741e55c4e0505))





# [0.17.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.16.0...@oney/profile-core@0.17.0) (2021-02-08)


### Features

* profile - change user Status for acivateProfile by aggreg usecase ([0c849e2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0c849e27e3c553c314cb175ff7577f1031d529b8))





# [0.16.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.15.0...@oney/profile-core@0.16.0) (2021-02-07)


### Features

* profile - add feature flag to activate callback URL in oneytrust payload ([9520ef0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9520ef07aea5a0332c2d213bf1d8308ac17ad235))





# [0.15.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.14.0...@oney/profile-core@0.15.0) (2021-02-06)


### Features

* **docs:** add living documentation ([aae039d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aae039d3d6feb08515853023e058ce7fd59a6c11))





# [0.14.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.13.2...@oney/profile-core@0.14.0) (2021-02-06)


### Bug Fixes

* **fix comment:** fix comment ([fec59b9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fec59b94e3ca7d8de530ff32f7f040fcc1c75e8c))
* **fix conflict:** fix conflict with dev ([69673dd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/69673ddbbf61324a29e8665bd8eab7e1c400be63))
* **fix duplicate:** fix duplicate ([73ebdbc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/73ebdbc53cbff03cb131cd54a44b38bf1970151e))
* **fix naming onbaordingstatus:** fix naming onbaordingStatus ([038b69c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/038b69ccc05fdf1f979311b5aed06f96238b4199))
* **harmonize typing:** harmonize typing ([3843458](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3843458ea24ba3f00d6a6450b3a526653ef8ac2e))


### Features

* **adding event libs:** adding event libs message for aggreg payment profile ([fe86f03](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fe86f03a9b54241aa374ac770bfae3926621b956))
* **harmonise:** harmonise handlers, fix typing between bounded context, fix tests ([2e1ae6c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2e1ae6c76d57dad05990537edae34a819e16338c))





## [0.13.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.13.1...@oney/profile-core@0.13.2) (2021-02-05)

**Note:** Version bump only for package @oney/profile-core





## [0.13.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.13.0...@oney/profile-core@0.13.1) (2021-02-03)

**Note:** Version bump only for package @oney/profile-core





# [0.13.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.12.1...@oney/profile-core@0.13.0) (2021-02-03)


### Bug Fixes

* **on-2241:** add profile-events lib ([0398edf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0398edf9e2211223f37fe609cd7cc88a08aadb10))
* **on-2241:** fix pr comment - fix typos on diligence status enum ([1c9b0e0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1c9b0e00e3f2571144dda9e16812766c59955152))
* **on-2241:** fix pr comment - rename profile-events to profile-messages ([be576c9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/be576c9410edd0f1a5df2a090fb4496b5b436bd7))
* **on-2241:** modify profile activated event sent to cdp ([7ce3fb5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7ce3fb51e60075d8ef6b8e0c23a5ae5cf34a07a1))
* **on-2241:** update field name in activated profile event ([0d4f044](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0d4f044e4de65c42c0bf8e859e2fc22a9aa908fa))


### Features

* **on-2241:** add handler in payment for profile activated event and notofy smo ([f7461b5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f7461b5a204194f108e5ceff1f98a6af466fadfb))
* **on-2241:** fix pr comment ([21e4fc5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/21e4fc5b97bd8bb8cc02605f3a5c732754282af0))
* **on-2241:** renaming for more accuracy in description ([7ee1e31](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7ee1e3106439cc6e60769277101d6744bfa0229c))
* **on-2241:** WIP handle pfm aggregation success event and activate profile ([e653144](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e653144e036e5a124e9934813cbd1505ffd3f1d8))





## [0.12.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.12.0...@oney/profile-core@0.12.1) (2021-02-02)

**Note:** Version bump only for package @oney/profile-core





# [0.12.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.11.0...@oney/profile-core@0.12.0) (2021-02-02)


### Bug Fixes

* change to the right status after diligence sct in ([3cefd03](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3cefd035e98520310824f4b00db29ce679bb055f))
* fix token AD issue (update token and nock calls) ([b255140](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b255140edf42b29ce66cfdc16998ee73876afb95))
* make the tin number optionnal ([3def5f4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3def5f44c846e711d5b7769b81f2d040c46c768d))
* remove test try/catch ([80e869e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/80e869e55c0030d7858feae3d35b3d42c4f4c2eb))
* rename familyName to legalName ([7972da3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7972da39b17a489a052d669cc502bdf4b7fbf299))
* rename tin to fiscalNumber ([92a538c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/92a538cad29113b99bfe33c74d7ea4c1e2817a5b))
* send the data in body instead of query in oneyFR auth routes + return the list that require tin ([561fd5b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/561fd5b15b7ed983c9cf4d4f6bb6ed9a89a71f6c))


### Features

* in profile, rename marriedName to legalName ([e33ab42](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e33ab423a11284851c010fced554d1c45002644d))
* update payment call from profile ([201ce8f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/201ce8f6238c7c85e9d04ec32bf8515264acb185))





# [0.11.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.10.2...@oney/profile-core@0.11.0) (2021-01-28)


### Features

* add a new route which returns the list of professional activities ([1dcf848](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1dcf84876819162ac9592108293210951faaf8f2))





## [0.10.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.10.1...@oney/profile-core@0.10.2) (2021-01-27)


### Bug Fixes

* **fix nationality:** fix nationality ([0717030](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/071703032fade4132849ee72aacd410ec7aaf6a3))





## [0.10.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.10.0...@oney/profile-core@0.10.1) (2021-01-27)


### Bug Fixes

* fix domain event consumption for diligence sct in ([5909fed](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5909fed7c455b9419d06cdabf7e75fb911cde311))





# [0.10.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.9.0...@oney/profile-core@0.10.0) (2021-01-26)


### Features

* **adding bankaccount and address step:** adding BankAccount and Address step in monorepo ([286927e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/286927e5b634e9308c74503f734983610d771d42))
* add fiscal status usecase + payment account update usecase and route ([305e6b8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/305e6b8ebd4a3ab5de20c5919de5333d880f871c))
* add odb payment api service and OT folder update ([37d97ff](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/37d97ff3a281c09f5da341903e2fda0a5be5ca63))
* setup fiscal status tests ([49b7088](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/49b7088ee5a53712bbc9fd2656cd9c437fedec60))





# [0.9.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.8.0...@oney/profile-core@0.9.0) (2021-01-20)


### Bug Fixes

* fix error in build profile api kernel ([7c88c65](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7c88c65fffc6a5ef45275de1ec3df54261ce525a))


### Features

* add domainEvent handler to update user when LCB/FT received ([4e60964](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4e6096429c13b0bd84c5222e530a6e524354d9c9))
* add LCB/FT Smoney callback handling ([a781ebb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a781ebbd01c4da2d12cabe555bac3c556688eb67))





# [0.8.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.7.0...@oney/profile-core@0.8.0) (2021-01-20)


### Bug Fixes

* **adding address step:** adding oneyTrust and oneyCRM api ([5b7ae7f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5b7ae7fdf484a44ea7926e6bd01d2f33da6c8f36))
* **fix conflict:** fix conflict ([8a51120](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8a51120bd97fe3a9baf798f2e8eb110592934525))


### Features

* **finalize civilstatus:** finalize civilStatus ([e7b8cb8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e7b8cb8a4922ac0de4db8502f24f92dcef5e0123))





# [0.7.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.6.2...@oney/profile-core@0.7.0) (2021-01-18)


### Features

* create a route which returns the list of fiscal countries ([24b4b8c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/24b4b8c61098fbd6c4025ef098c91a66e9fecae1))
* separate the country list in its own file ([dbeb551](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/dbeb5517a6068c649519c6e259f8397a53679af6))





## [0.6.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.6.1...@oney/profile-core@0.6.2) (2021-01-17)

**Note:** Version bump only for package @oney/profile-core





## [0.6.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.6.0...@oney/profile-core@0.6.1) (2021-01-13)


### Bug Fixes

* fix conflict merge issues ([6738007](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/67380076c53ce808c11a4310fd10b38a0dc22072))
* fix issues related to the domain events subscriptions and send ([6f25cce](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6f25cce1c42727ce6c325573d70dcbc3e01dc6d0))





# [0.6.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.5.2...@oney/profile-core@0.6.0) (2021-01-12)


### Features

* migrate sending kyc filters to S-Money in mono repo ([b87ae56](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b87ae5681c2089f0e7694ef8a44a8fb825beb7d0))





## [0.5.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.5.1...@oney/profile-core@0.5.2) (2021-01-11)


### Bug Fixes

* add profile saving after oneytrust callback handling ([9310fcb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9310fcbcd1c9f4b07fef1831f0c172dbb906a2e9))





## [0.5.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.5.0...@oney/profile-core@0.5.1) (2021-01-11)

**Note:** Version bump only for package @oney/profile-core





# [0.5.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.4.0...@oney/profile-core@0.5.0) (2021-01-08)


### Features

* add tests for complete diligence and setup keyvault ([07397eb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/07397eb56c82bdc8560bd64b973948407a81ede6))
* add the diligence SCT in handler and usecase in profile ([37d810e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/37d810e4cb8ee8b579069429566642397ca617e5))
* correct the callback type 31 payload according to the documentation ([4cb8012](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4cb8012e6262ef77776ad4a34353dc76e719ea4e))
* send domain event when the diligence sct in is completed ([fc23f29](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fc23f290a76c9a3968281593b0cd439b132986ce))





# [0.4.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.3.3...@oney/profile-core@0.4.0) (2021-01-08)


### Bug Fixes

* feedback from PR ([d83038b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d83038bb59bad6484641cc1ee569fe23f30ce00c))


### Features

* migrate facematch step from odb_account ([b3cd1a1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b3cd1a1b8e693d06397d610fe06aa53d196fa872))





## [0.3.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.3.2...@oney/profile-core@0.3.3) (2021-01-07)


### Bug Fixes

* **fix conflict:** merge develop and fix conflict ([c8261e2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c8261e28d10dd028c65184f6b0fde6a4bab014ef))
* **fix method in aggregate root:** fix method in aggregate root and refactor entity ([685aebe](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/685aebecc1f4e925bf8557c74dd0676e9dfd0ac4))





## [0.3.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.3.1...@oney/profile-core@0.3.2) (2021-01-05)

**Note:** Version bump only for package @oney/profile-core





## [0.3.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.3.0...@oney/profile-core@0.3.1) (2020-12-23)


### Bug Fixes

* **adding previewimg to tips detail:** adding previewImg to tips detail ([3423e05](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3423e053b09f0e6c8f34953dc3c84ae72f7ba5d1))





# [0.3.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.2.0...@oney/profile-core@0.3.0) (2020-12-23)


### Bug Fixes

* add fradu result to domainEvent ([da98890](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/da98890297e30a2bf22c881f4687fce80f28a854))
* pR feedback ([2112ebf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2112ebf63bf25d3686b698223188035af86e8443))
* refacto and use profile entity ([b830103](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b830103e0e5717f542364b4848175b0c4a9e707d))


### Features

* migrate Oneytrust Decision callback ([8fc0478](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8fc04787fb73039c6f91f969c6d2f3677d2f0a35))





# [0.2.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.1.1...@oney/profile-core@0.2.0) (2020-12-17)


### Features

* **adding rbac in monorepo, and a lot of enhancements:** adding RBAC in monorepo ([c250621](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c2506216b9c1bc251971944ee2606e61dea7c3de))





## [0.1.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.1.0...@oney/profile-core@0.1.1) (2020-12-01)


### Bug Fixes

* **fix eslint:** fix eslint ([ddac78c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ddac78cab9574d896e766d9f8fb5ab72c725e15b))





# [0.1.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.0.1...@oney/profile-core@0.1.0) (2020-11-27)


### Bug Fixes

* **add env on kernel:** add env on kernel ([97b99d4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/97b99d498b269a2a05f10a86aad365b9c76057de))
* **fix reviews:** fix reviews deleting index and fix codebase ([1f10ccb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1f10ccba749844a484730ea2aad79fbd7fdaff90))


### Features

* **add tips:** wIP add tip ([63a0b65](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/63a0b65b45fd4c64a9b39248774c2b9cf0b32b71))





## 0.0.1 (2020-11-23)


### Bug Fixes

* **adding console:** adding console ([cc7c647](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cc7c64722ee77d90c0e0c8074063125f4a4ba80f))
* **aze:** aze ([4f7b264](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4f7b26457dbdec197d834e41518e4dc30b88b64b))
* **fix lint:** fix lint ([3ed9d7f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3ed9d7f7bd52b0ad9c7ba1e9619927cae6761c85))
* **fixing version:** fixing version ([06c53e8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/06c53e800de80f9927054f4cff10ca22d4797f2f))
* **patching:** patching ([ea7f4d3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ea7f4d371dfb94a8c99f3b8fd86e2b78d8f7e91b))
* **testing ci:** testing ci ([0039c17](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0039c1794d8e5c6a81baec527a50ffd5a1da002e))
* **testing versionning:** testing versionning ([3d5c51b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3d5c51b47ec98d737d4b2b571edd4a14aaf5f429))





## [0.0.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.0.8...@oney/profile-core@0.0.1) (2020-11-23)


### Bug Fixes

* **patching:** patching ([ea7f4d3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ea7f4d371dfb94a8c99f3b8fd86e2b78d8f7e91b))





## [0.0.8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.0.7...@oney/profile-core@0.0.8) (2020-11-23)

**Note:** Version bump only for package @oney/profile-core





## [0.0.7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.0.6...@oney/profile-core@0.0.7) (2020-11-23)

**Note:** Version bump only for package @oney/profile-core





## [0.0.6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.0.5...@oney/profile-core@0.0.6) (2020-11-23)

**Note:** Version bump only for package @oney/profile-core





## [0.0.5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.0.2...@oney/profile-core@0.0.5) (2020-11-23)


### Bug Fixes

* **adding console:** adding console ([cc7c647](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cc7c64722ee77d90c0e0c8074063125f4a4ba80f))
* **aze:** aze ([4f7b264](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4f7b26457dbdec197d834e41518e4dc30b88b64b))
* **fix lint:** fix lint ([3ed9d7f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3ed9d7f7bd52b0ad9c7ba1e9619927cae6761c85))
* **testing ci:** testing ci ([0039c17](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0039c1794d8e5c6a81baec527a50ffd5a1da002e))





## [0.0.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.0.2...@oney/profile-core@0.0.4) (2020-11-23)


### Bug Fixes

* **adding console:** adding console ([cc7c647](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cc7c64722ee77d90c0e0c8074063125f4a4ba80f))
* **aze:** aze ([4f7b264](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4f7b26457dbdec197d834e41518e4dc30b88b64b))
* **fix lint:** fix lint ([3ed9d7f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3ed9d7f7bd52b0ad9c7ba1e9619927cae6761c85))
* **testing ci:** testing ci ([0039c17](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0039c1794d8e5c6a81baec527a50ffd5a1da002e))





## [0.0.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-core@0.0.2...@oney/profile-core@0.0.3) (2020-11-23)

**Note:** Version bump only for package @oney/profile-core





## 0.0.2 (2020-11-19)


### Bug Fixes

* **testing versionning:** testing versionning ([3d5c51b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3d5c51b47ec98d737d4b2b571edd4a14aaf5f429))
