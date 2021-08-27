# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.43.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.42.0...@oney/profile-adapters@0.43.0) (2021-04-29)


### Features

* **oney-messages:** adapted some tests ([ab80767](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ab80767808c4806a32c109101f8ac8141b3f20d3))
* **oney-messages:** added EventHandlerExecution feature ([e4f71ec](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e4f71ec59dc59e300d5a8b63f08f5f89bda9bd53))





# [0.42.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.41.0...@oney/profile-adapters@0.42.0) (2021-04-29)


### Bug Fixes

* **on-4379:** fixed case sensitive issue ([34efb07](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/34efb07a7727a14e70835c85933eefd1c48ed09f))
* **oney-commands:** fixed profile test ([87285dc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/87285dcbc63508158a97c6190cfc5174feafb0b1))
* **profile:** add updated information to the contract ([6620082](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6620082af5af975cb97b716013ec9e45670632a1))
* **profile:** call dataRecovery api when tax notice is uploaded - ON-4509 ([2986c7a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2986c7ac9a115d129574d2995f2082ef91666fca))
* **profile:** fix data recovery url - ON-4625 ([5906c86](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5906c86c184b072a44a7b69ac23ea77d5877c3a9))
* **profile:** fix profile event handler for AZF ([478e131](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/478e1318e49b55444c5d2f42092186141d799ad4))
* **profile:** fix profile status saga event id mapping ([4726a4e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4726a4e9e40b5e8ca5bc26643fbb6afad00ae748))
* **profile:** fix profile status update - ON-4777 ([ade90ec](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ade90ec0c20ec7c98cd78755bd2e4b75458b660a))
* **profile:** fix profile status update - ON-4777 ([a310052](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a3100529f4b238ad81e2503d2043b5078c96543a))
* **profile:** send FiscalCountry to OT ON-4407 ([a9d7234](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a9d7234b30e60599f5bd4774316f0ac023b233ca))
* **profile:** update profile status when it's new and not null - ON-4584 ([16816f3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/16816f31edc29359c6df89ef12109df5151ec2ff))
* **profile:** upper case first_name, last_name and married_name sent to OF ([2ef70fe](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2ef70fe9dcb8cf4f8a2c67f215c3617bb2700357))
* **profile-adapters:** add the update of the sending condition of the sid ([f326b73](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f326b73d0e5c276b42710bbd78638d4e58824570))
* **project:** merge develop into feat/ON-4115 branch and fix merge conflicts ([796388b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/796388b5f1af8f4d0c411d7876b38fabb9873984))
* **project:** merge develop into feat/ON-4116 and resolve conflicts ([b94d362](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b94d36296aeeae8740377c0ecc77e027fca9216e))
* profile - fix building lib in saga tests ([5ff80bc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5ff80bc5db74d9b2b4b399889ef9dc79f446ff1e))


### Features

* **authentication,profile:** add PHONE_OTP_CREATED handler and take pr reviews into account ([0234d7f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0234d7f54250f70349de0953fffd419d98ea1ad5))
* **profile:** add check application_person_id_field SID for update ([f30aeb6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f30aeb6d45b92e2c3069734aa248db26383fff0e))
* **profile:** phone otp migration from odb_account ([0b72bce](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0b72bce0449e6390497fcf89ca74fadfb99ab4b1))
* **profile:** update the ficp/fcc workflow ([3e821cb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3e821cb2f85ef08282314e75a84fb35f9a630944))
* **profile, document-generator:** add change to lib document-generator and update profile ([668f8b6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/668f8b6c3223f85eb6f815b6541144e46449ccfc))
* **profile, document-generator:** add htmlToPdf in env variables ([02a51e5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/02a51e565b4d225c62b24969f1bc82e1bcb54e4d))
* **profile,notification:** limit OTP generation to 5 attempts/user/day ([5e4cdbf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5e4cdbf493089a55d12e4f7b32f14dbcee936e89))
* profile - make update contract_references in OF asynchronous ([64183e2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/64183e2cf0503d4df507671a3145c07ba42ef3f3))





# [0.41.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.40.0...@oney/profile-adapters@0.41.0) (2021-04-14)


### Features

* **profile:** add remove birth_municipality_code and update birth_municipality_label ([5f28b41](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5f28b4169c5b9ff0fcfd235af798b604caaa3c76))





# [0.40.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.39.1...@oney/profile-adapters@0.40.0) (2021-04-14)


### Bug Fixes

* **monorepo:** fix conflict ([2798c4c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2798c4cec869258826b8a38095917408c98825dd))
* **payment:** fix name long ([cf0e0a7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cf0e0a75e7b8472ba4b498a3e5c8a49ce1742d77))
* **profile:** fix test and nock ([c6c5586](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c6c55865b0cf87c3ec7a111fecfcc4208c52bad0))
* **subscription:** fix comment and test ([f123f43](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f123f43d8636a2ced53b41eb1b4555b5cc0213e6))
* **subscription:** fix conflict ([f5492b0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f5492b0ed5744ca1733f5320b690542a13a52c8e))
* **subscription-api:** adding saga ([68fbe7d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/68fbe7d7f05c2c56e6a81048e8201aaf5f219682))


### Features

* **profile-subscription:** adding subscription step in profile with handler ([691480a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/691480ab8e60fcbc3f42213ceeee695d2c6fdef3))
* **subscription:** fix conflict ([f0d4035](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f0d403566b28b0450bddc636b607f0d7c13ced58))
* **subscription:** fixing comment ([98fd563](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/98fd5635a1f79989f61a389d86fdc8b090a7b8b2))
* **subscription:** handle subscription saga for process subscription ([2579bf7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2579bf76c78953f93cbc0f2de35fa16755029371))
* **subscription:** handling handler ([675366c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/675366c62f3f8ad614dfcb9af4c169ae1f7f1b44))





## [0.39.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.39.0...@oney/profile-adapters@0.39.1) (2021-04-14)


### Performance Improvements

* profile - add timeout on cdp request ([7cb1eda](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7cb1eda0145a3b88852dc396f633e4306f342555))





# [0.39.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.38.5...@oney/profile-adapters@0.39.0) (2021-04-13)


### Bug Fixes

* **profile:** add loggers for event handlers ([672c840](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/672c840ef39909cb4caf18ee75a5a25282ecd77f))
* **profile:** fix profile mapper ([45eb8aa](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/45eb8aa83a31a2f59cfdc3c8255b620c1baf4d8a))


### Features

* payment - send to SMO kyc document and filters on creation if already available ([81eba6b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/81eba6bab6dcdfba01a2deaa4338300979e26ba5))





## [0.38.5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.38.4...@oney/profile-adapters@0.38.5) (2021-04-13)


### Bug Fixes

* **profile:** delete getCustomerSituations call from civilStatus step ([10b7e0b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/10b7e0b0c56b9117cef22f06eb51c479189564ca))





## [0.38.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.38.3...@oney/profile-adapters@0.38.4) (2021-04-08)


### Bug Fixes

* **profile:** fix profile mapper ([7f53ce9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7f53ce92515446af34f4914e03c9ca786210bf0e))





## [0.38.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.38.2...@oney/profile-adapters@0.38.3) (2021-04-08)


### Bug Fixes

* profile - add new onHold tips to new created status ([b2b1995](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b2b1995df44ad13ab595abc995b5f773129c39bd))
* **profile:** add loggers for event handlers ([391b191](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/391b191d23b473e18411eacd9a9522a16c29e554))





## [0.38.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.38.1...@oney/profile-adapters@0.38.2) (2021-04-08)

**Note:** Version bump only for package @oney/profile-adapters





## [0.38.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.38.0...@oney/profile-adapters@0.38.1) (2021-04-08)


### Bug Fixes

* profile - await for post/patch OT form-data to finish to continue usecase ([b6aec30](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b6aec30cc5b114aa489debb488a76ee82f3496d2))





# [0.38.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.37.0...@oney/profile-adapters@0.38.0) (2021-04-08)


### Features

* **profile:** add console log for investigation ([07659bc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/07659bc4302a04a0880f864954dfe4276099e99b))





# [0.37.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.36.2...@oney/profile-adapters@0.37.0) (2021-04-06)


### Bug Fixes

* **profile:** do not send len information to OENY FR when not available ([5256c39](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5256c3999c5f1bad49982a68f50aa68a64809e50))


### Features

* **profile:** add call fcc and send event FicpFccCalculated ([fdd27fd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fdd27fdf12e7813482ac5f01558fdbf07c23329a))
* **profile:** add test for GetFicpFcc ([34191e0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/34191e002a9c265319d970a90cb09ba96ac2e903))





## [0.36.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.36.1...@oney/profile-adapters@0.36.2) (2021-04-06)

**Note:** Version bump only for package @oney/profile-adapters





## [0.36.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.36.0...@oney/profile-adapters@0.36.1) (2021-04-06)


### Bug Fixes

* profile - rollback the patch body when updating OT form-data ([3d9d15d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3d9d15dd55718163f8e7dcb94db8426a173e4b00))





# [0.36.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.35.0...@oney/profile-adapters@0.36.0) (2021-04-06)


### Features

* **profile:** add preEligibilityOK event handler ([ffcfd32](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ffcfd3248462a55e0baffb02c8ee59e45c98dfc0))





# [0.35.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.34.0...@oney/profile-adapters@0.35.0) (2021-04-06)


### Features

* profile - not activate user if not onwer of aggregated account ([a365367](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a365367df2b347031752cdb98a97e4b8c25928bd))





# [0.34.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.33.1...@oney/profile-adapters@0.34.0) (2021-04-02)


### Features

* **profile:** add ficp post request to get ficp_flag ([861cec0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/861cec01df8aefa1365d7536879fa24ebc541d99))
* **profile:** add ficp use case ([17ac5ce](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/17ac5ceeaacddaab3a80895445b1a68980a7687b))
* **project:** merge branch 'develop' into feat/ON-3515-ficp-api-integration ([0467364](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0467364661d13630649ac026625d419e73107f43))
* **project:** will set up necessary tools for calls fcc/ficp ([4b92974](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4b929740f300a9dcbb71452ad8205130afd68acd))





## [0.33.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.33.0...@oney/profile-adapters@0.33.1) (2021-04-02)


### Bug Fixes

* **profile:** fix the get customer_situations request ([508a6a4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/508a6a4cfb9e59fbf1585fa1d9cd79ab90b649f5))
* **project:** merge develop into fix/ON-3611 and resolve conflicts ([c804048](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c80404857a12e169a4147f7223c0c31e953ef2e6))





# [0.33.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.32.1...@oney/profile-adapters@0.33.0) (2021-04-02)


### Bug Fixes

* profile - fix wrong caseType for new OT cases ([5bbde34](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5bbde341bf8aee97f3de11f6f8afc142020fcdf6))
* **accounteligibilitycalculatedeventhandler:** fix test ([b815082](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b81508211c694a57936f36eb37a3e82c0b3e4ec7))
* **merge:** conflicts ([2aa376b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2aa376b18d535b422fbea4674c4ed4a3a26c6637))
* **profile:** fix test ([7676517](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7676517511f5a9732d7c3e23178db392f58c5d9e))
* **profile:** test ([340664c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/340664c8ee7a3d3a68353cecaec8e51c5009e02b))
* **test:** fix profile ([a982bcd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a982bcd6e823ceb63cc0a76e6f98f62014349119))
* profile - not delete KYC file if new KYC is created ([41d2bac](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/41d2bacc585884feb82c6d7b8b27e09fbfa7e4f7))


### Features

* **authentication-profile:** add ability to check register/create with phone ([1ff638b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1ff638bd1fc861d5c2f8c63a6da4c67e134fc4d4))
* **eligibility:** review cdp-messages interfaces according to discussion with PA and ABenj ([64d54bc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/64d54bc0f0da8c0db95e53dbd9fbc00b67779f7e))
* **profile:** add update consents route ([c3f1e8d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c3f1e8db3541cb1bda7701d5cbd7c79f7ccfca72))
* **profile:** add UpdateConsents usecase ([83ab680](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/83ab680c9f5cb889006f6e04221e2d813fb4f554))
* **profile notification:** add silent notification ([8fb1f9e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8fb1f9e84537e979beb077e05a2af56ea919f898))
* **profile subscription:** set or update the CNIL/LEN information during the civilstatus step ([e60d543](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e60d54347662d28d92ec1079bbda9cf6422a6354))
* profile - add new case api and separate form-data calls ([69a5d80](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/69a5d8022b9e513c6c21c9055ac5015b88a7f007))





## [0.32.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.32.0...@oney/profile-adapters@0.32.1) (2021-03-31)

**Note:** Version bump only for package @oney/profile-adapters





# [0.32.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.31.0...@oney/profile-adapters@0.32.0) (2021-03-30)


### Bug Fixes

* **aggregation:** tests were failing because of missing env variable ([a7f8b9a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a7f8b9a6f593a1292ec0acaa31f61b301b65ab83))
* **fix conflict:** fix conflict ([00c38b1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/00c38b1aa34cacca8d6cb64c36f5436c15ed41a6))
* **fix conflict:** fix conflict ([d41f849](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d41f8496e60d3f860c8ef9e87b193871bed638cf))
* **monorepo:** fix conflict from dev ([5df7085](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5df70858f1c3a583c54ebc5a57daa0f0bab26182))
* **monorepo:** fix conflicts ([6b96730](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6b96730ae32569d342aeb47cc6348d25f02b0684))
* **oney-messages:** fixed build ([ff93ab9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ff93ab900f454886ace4015da683739bb9df098d))
* **oney-messages:** fixed linter ([0c60db8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0c60db8d34cbcdbd82843953113ea465fea81c30))
* **oney-messages:** fixed linter ([571a0e9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/571a0e986c4b1ddc45419fd046812dccf6a417b3))
* **profile:** fix api call to digital identity ([482ea72](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/482ea72433b2072b2752aa0abcc2cf44ad1527d7))
* **profile:** fix birth_country mapping for OFR ([0c7c159](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0c7c1591e1c8334af6be10126ab1ac228b42200e))
* **profile:** fix merge conflicts ([fedf007](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fedf0078e2931280e4667a852afa06007979a2b3))
* **profile:** fix test failing in remote build, cause events interface changed ([93a9948](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/93a9948e278eb15a43ecc2a02b36fcb046a7d8f3))
* **profile:** make birthDepartmentCode and birthDistrictCode optional ([cff65cf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cff65cf22e0cf84464f88458b854143c4cb4f184))
* **profile-adapters:** fix build pb ([78e1322](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/78e1322fc4a14b4be2903a75f79a05cad7993720))
* **profile-adapters:** test fails on remote, cause target not met, but it is met locally wtf ([8876a99](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8876a99837e90e9d20a62b6144f571d97bf4a141))
* profile - improve data sent to oneytrust ([b3137d6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b3137d6cc38b105265f327652b9b364ee7409213))
* profile - improve profile change status local event handling ([ad584c2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ad584c275b26097b4cbb7635bcbf5674aed37065))
* profile - persist nationality from id step and not civil status step ([d9d4f03](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d9d4f038ec83965795bc0239d817e6c20e43cf02))
* **profile:** fixed bug SID = UID when updating custome ([5562f04](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5562f041b61681231945733332c230fd954750cc))
* **profile:** fixed bug SID = UID when updating customer ([965bd23](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/965bd2333d876cefdb5980c358af586ef83f749d))
* **profile:** update create account contract ([e43c744](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e43c74417340b89e406d785c25e8178ea5485704))
* **profile-adapters:** update condition to remove person_ids ([92fdf91](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/92fdf91696a14f7e58d5b39638e83f70dfc5214e))
* **project:** update the build of document-generator ([d0d0e3b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d0d0e3bc92227eca77762da21be341af131489e5))


### Features

* profile - add kyc versionning ([d67a6e3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d67a6e30cc8c1b5f9e275e4730dcaa23b8eb9c95))
* profile - add new endpoint to upload Tax Notice ([4615074](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/46150741cf1da100a22aeebb9614e0eecdfaf457))
* **oney-messages:** added some solution to be compatible with legacy ([cfbb857](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cfbb8575710f76c0c3b6f1a394687899acc35a68))
* **oney-messages:** fixed some tests ([2adb961](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2adb9611515cfe4614393f631fca9a2523d25935))
* **oney-messages:** fixed some tests ([e2252cf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e2252cf0279c098749cd99f3c5d7362eca0a7cad))
* **oney-messages:** migrated new develop version ([782e25c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/782e25c7e3cc940c0a135406b24cd9acd16dd45e))
* **profile:** add an endpoint to get the contract document ([f68b7ff](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f68b7ff3c1dd22a685881197784a43ca171bfb73))
* **profile:** add CUSTOMER_SERVICE_DEMAND_SENT and usecase SendDemandToCustomerService ([07fac42](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/07fac42678c90d53760b0200e7b4e4068db08ec6))
* **profile-api:** add endpoint to get customer service topics ([170bba0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/170bba05597da8fdd72d7385fd226ab71e16fbfb))
* **profile-core,adapters,api:** add an endpoint to get signed/unsigned contract ([a1bfaa5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a1bfaa50b8e516a13693c1ce4facc509774b4671))
* **profile-notification:** add email template for customer service, and birthname prop ([5decdc6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5decdc68ec83b6a0d356008191cd8503ef12d70e))
* **profile,payment,auth:** add birthDepartmentCode and birthDistritCode to the Profile ([bd15974](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bd15974135c231500824364866950070fe2d3896))
* profile - dispatch event when status profile changed ([44463f2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/44463f2ed6411826f22414b9e79df24883da4bbd))
* **project:** merge branch 'develop' of into hotfix/on-3931-develop ([a7ebdc6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a7ebdc66e598e03311b520298a27a13b5bd14839))
* **subscription:** adding azf and usecase for Schedule billing, refactor Subscription ([7411f43](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7411f43e514fb9c3cb1d6bd1db773402c3305c08))


### Performance Improvements

* profile - fix conf for unit and integration test ([a283676](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a283676154109c8f282afd83237ec2d36239c083))





# [0.31.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.30.0...@oney/profile-adapters@0.31.0) (2021-03-15)


### Features

* **profile:** add mock for lib document-generator ([7a59f04](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7a59f04fb309228ba2d4f08336b1004cf96ea3a3))
* **profile:** add type ContractDocumentRequest and its use ([34d53a1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/34d53a10f02db5a8611fb4e773d3af501fa587b8))
* **profile:** update endpoint signContract ([e3ad29a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e3ad29ace866cfb66856f3f89781e985fffded86))
* **project:** merge branch develop into feat/on-3795 ([5564810](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5564810e8f3520b30c7436af8b51e209b81af7dd))
* **project:** merge develop in feat/on-3701 and update test ([7fa6dc1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7fa6dc12002af88e27a17da8dd0401a73c33ab65))
* **project:** merge feat/on-3795 in feat/on-3701 ([f833bb3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f833bb39c34664f51c4816c43473e665f4678fab))





# [0.30.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.29.1...@oney/profile-adapters@0.30.0) (2021-03-12)


### Features

* profile - add new rejected and required tax notice tips ([485a9a0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/485a9a065514bf43d8748be803968086ce685c4c))





## [0.29.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.29.0...@oney/profile-adapters@0.29.1) (2021-03-10)


### Bug Fixes

* **profile:** avoid spaces in CDP tips URLs responses using trim ([9d6c9c2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9d6c9c261d2000856757dd10d5f5a032ebcedf9d))
* **profile:** fix tests ([96e72c6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/96e72c6734ff2da7b11112244c4cc378d725ba02))





# [0.29.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.28.1...@oney/profile-adapters@0.29.0) (2021-03-10)


### Features

* profile - Add endpoint to verify if user is the bank account owner ([5805bae](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5805bae1d20d83231f5d173e38dc60bcc18225f7))
* profile - specify uniq event ID for OT events API ([f7db025](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f7db025678bdd341beefd5f268a3916970e6b4b4))





## [0.28.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.28.0...@oney/profile-adapters@0.28.1) (2021-03-10)


### Bug Fixes

* **profile:** fix bug ODB_PAYMENT_TOPIC and remove ODB_PROFILE_TOPIC ([0f98953](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0f9895327ac425258d08ae19ea8abe7067e38294))





# [0.28.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.27.3...@oney/profile-adapters@0.28.0) (2021-03-08)


### Bug Fixes

* **profile-adapters:** fix CI build ([6c0903f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6c0903ff04a90998feae4c786f959f6f0890b8df))
* **project:** merge develop into feat/ON-2660-getcustomersituations and resolve conflicts ([c589024](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c58902460f1afb176eecfaf83a26936e10c40e49))
* **project:** merge develop into feat/ON-2660-getcutomersituations and resolve conflicts ([f696242](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f696242838468f8c3a54fe6899082e1f71ea800a))
* **project:** merge develop into feat/ON-2660-getcutomersituations, fix conflicts and broken tests ([5b33c3e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5b33c3e896c8a344be0068e81518891923519cf8))


### Features

* **profile-core,api,adapters:** implements GetCustomerSituations use case / ON-2660 ([f16881b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f16881bc2b6dfed9fb6422d41e21fa52070a6eee))





## [0.27.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.27.2...@oney/profile-adapters@0.27.3) (2021-03-05)


### Bug Fixes

* profile / payment - don't change status after activation even if new callback received ([e56174a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e56174a72b2865ae75a0952576de4eef88e414ef))





## [0.27.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.27.1...@oney/profile-adapters@0.27.2) (2021-03-04)


### Bug Fixes

* **profile:** fix empty steps ([86d26ee](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/86d26ee248daf9d7d11ab63d56c17e8c449cee44))
* **profile:** revert to original mapper ([feb11b2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/feb11b2920335ebc1c396afad48a1b11f8e172d4))





## [0.27.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.27.0...@oney/profile-adapters@0.27.1) (2021-03-04)


### Bug Fixes

* **fix comment:** fix comment ([3bece2a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3bece2a18b960adcc6ccf7b211ce352fd1b871df))
* **profile:** add DigitalIdentity entity ([27efe1a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/27efe1a517e3e51fb831d2696fd36fa8c33aa915))
* **profile:** fix digitalIdentity field for setting id ([3d48622](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3d486225705dc5c189fbc244aabdb0eec0a40cd4))
* **profile:** fix empty value issue when saving Profile Aggregate ([ac04cff](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ac04cff116b1dd6b595d930d403c98e9fbe661e9))
* **profile:** fix test azf and adapters ([a3994a1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a3994a1e5592f1d46a4129a9ecbea3423e8a9c17))
* **profile fix civilstatus:** fix issue with http client ([c093ee2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c093ee29a2cbf49794607dc78aff558bda13e117))
* **profile fix comments:** profile fix comments ([d949add](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d949addd209d45bc65eff57c9d069d836cd1622e))
* **profile fix optionnal return value:** profile fix optionnal return value ([e1df7b4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e1df7b4a3e21bd635301a460c5a6b00feb2c59de))
* **profile rm createdstep:** profile rm CreatedStep ([4f09af1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4f09af12546d99cecc3994bda41613cab19639d4))





# [0.27.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.26.1...@oney/profile-adapters@0.27.0) (2021-03-03)


### Bug Fixes

* **adapt dispatch:** adapt dispatch and fix issue ([75d793d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/75d793de4bd0ff36d7876041e143eb0ea577ef84))


### Features

* **profile:** migrate register in monorepo ([87255ef](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/87255efa6cb1fc11ee7955186cc008caca1e583b))





## [0.26.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.26.0...@oney/profile-adapters@0.26.1) (2021-03-03)

**Note:** Version bump only for package @oney/profile-adapters





# [0.26.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.25.3...@oney/profile-adapters@0.26.0) (2021-03-03)


### Features

* profile - send PROFILE_ACTIVATED when SCT_IN done and validated ([8a5d54b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8a5d54b83ae2b006e9de51579b9bfe414b46c971))





## [0.25.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.25.2...@oney/profile-adapters@0.25.3) (2021-03-02)

**Note:** Version bump only for package @oney/profile-adapters





## [0.25.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.25.1...@oney/profile-adapters@0.25.2) (2021-03-02)


### Bug Fixes

* profile - fix create and update contract references with new Oney FR specs ([ba0d429](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ba0d4294a13acd08d6e30627aa7754243b5b37a9))





## [0.25.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.25.0...@oney/profile-adapters@0.25.1) (2021-03-01)


### Bug Fixes

* profile - Add feature flag for Oney FR contract create and update ([b81aac3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b81aac34a9c06a03b6fec25550576a5fdae95914))
* profile - remove unwanted console log in contract gateway ([6c4b9c7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6c4b9c7be24c17df1bb2b29705c461518a2ca648))





# [0.25.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.24.0...@oney/profile-adapters@0.25.0) (2021-03-01)


### Features

* **profile-core,api,adapters:** add masterReference to the payload sent to Oney Trust ([44a8c77](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/44a8c77d32fbd08748641e34fb6f6472df180c8c))





# [0.24.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.23.4...@oney/profile-adapters@0.24.0) (2021-02-26)


### Bug Fixes

* profile - remove useless async await in proxy dispatcher ([097b7ba](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/097b7ba4d430276832db00d9efd229776d8e5cf5))


### Features

* profile - add legacy events for onboarding steps to be consumed by CDP ([3d0abec](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3d0abecd3961d4a3612141827dc263c2e9f6eae0))





## [0.23.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.23.3...@oney/profile-adapters@0.23.4) (2021-02-26)

**Note:** Version bump only for package @oney/profile-adapters





## [0.23.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.23.2...@oney/profile-adapters@0.23.3) (2021-02-25)


### Bug Fixes

* profile - fix payload to call Oney FR to create and update contract references ([d4d0a85](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d4d0a8503960cd22ee30c0a7dbce01f5bc13545b))
* **fix conflict:** fix conflict payment-azf ([7935d18](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7935d1851c10b201bae6a5644a1fa4f62059eaa6))





## [0.23.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.23.1...@oney/profile-adapters@0.23.2) (2021-02-25)

**Note:** Version bump only for package @oney/profile-adapters





## [0.23.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.23.0...@oney/profile-adapters@0.23.1) (2021-02-25)


### Bug Fixes

* profile - fix error on mocked data in SCT IN tests ([9319ad9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9319ad9f804356cab8ee81bbef4ce68b2f1fad62))





# [0.23.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.22.4...@oney/profile-adapters@0.23.0) (2021-02-24)


### Bug Fixes

* profile - fix CDP baseURL for env ([e463eae](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e463eae321e832023eb95ce312f3d03115e3da5c))
* **fix notif conflict:** fix notif conflict ([3cc520e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3cc520ed2da98e5976c7ee7358a70f39a2967443))
* **fix test:** fix test ([2e53b91](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2e53b9149dde2a6c30d51d894ea6fd22f61ab737))
* profile - add the document Side as an optionnal value for identityDocument endpoint ([61936b0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/61936b084dd2c60070e98c1aa7c162e9a23479c6))


### Features

* **globalconfig.json:** merge develop in feat/3283 and resolve conflits in globalConfig.json ([0d97717](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0d9771708e59bc4e4ea7ac778fe6d244734914cc))
* **profile:** add the SITUATION_ATTACHED event and remove the CUSTOMER_CREATED_OR_UPDATED event ([03aa195](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/03aa1957f3bffeba424a6b6940ae3c4e89075f38))
* profile - add new template for actionRequiredActivate tips ([f495ade](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f495adef5ceb4d021df88c9f5cacf6267928931f))
* profile - improve actioNRequiredActivate tips formatting ([cf680a3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cf680a339e77d423ef7ec176b2d05a2af6feb177))
* **profile:** add the migration of GetCustomers ([aa24012](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aa240129c340e70954163ca4264b375419c2613c))
* **profile:** add the sending of the event CUSTOMER_CREATED_OR_UPDATED ([44b8a67](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/44b8a67e270b1f2ecebc05d58ea301588eadfce1))
* **project:** merge develop in feat/3283 ([d75b726](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d75b72666d2c911487fc545c6509d7595a6008c7))
* **project:** merge develop in feat/3283 and resolve conflicts ([5cc8f33](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5cc8f33282845de101594e6be2fea1e63a19f0b7))





## [0.22.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.22.3...@oney/profile-adapters@0.22.4) (2021-02-18)

**Note:** Version bump only for package @oney/profile-adapters





## [0.22.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.22.2...@oney/profile-adapters@0.22.3) (2021-02-18)


### Bug Fixes

* profile - Bring back control on birthdate and birthcountry for civilStatus step ([9b7adb3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9b7adb354ddbde7f5f49ec767dfef967142047d7))
* profile - ensure that we don't set undefined birth country or date in profile model ([a6c3f5f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a6c3f5fbdbbfa52e19821d5330fef87d498e5fc5))
* profile - fix cdp tips and html tips template ([0bb31de](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0bb31debc581f2fe5b50fcf48aa8667d82b7275a))





## [0.22.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.22.1...@oney/profile-adapters@0.22.2) (2021-02-17)

**Note:** Version bump only for package @oney/profile-adapters





## [0.22.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.22.0...@oney/profile-adapters@0.22.1) (2021-02-17)

**Note:** Version bump only for package @oney/profile-adapters





# [0.22.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.21.0...@oney/profile-adapters@0.22.0) (2021-02-17)


### Features

* profile - Add tips for ACTION REQUIRED ID status ([c2c3393](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c2c3393f88ce9ad8d7b6fa4d14500b6e26e634af))





# [0.21.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.20.1...@oney/profile-adapters@0.21.0) (2021-02-16)


### Features

* profile - update Oney FR contract references when contract signed ([9c24fe2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9c24fe2897546c19b182ae138ef249d1add73711))





## [0.20.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.20.0...@oney/profile-adapters@0.20.1) (2021-02-16)

**Note:** Version bump only for package @oney/profile-adapters





# [0.20.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.19.2...@oney/profile-adapters@0.20.0) (2021-02-15)


### Features

* **profile, payment, common:** add additionalStreet is optional ([c897c3b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c897c3b9181d5e033620a113ac2b0526ab261f56))
* **profile, payment, common:** add additionalStreet to the user's address ([7e0a019](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7e0a019e5c1e1de2538cec1393045633c881b05a))





## [0.19.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.19.1...@oney/profile-adapters@0.19.2) (2021-02-12)

**Note:** Version bump only for package @oney/profile-adapters





## [0.19.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.19.0...@oney/profile-adapters@0.19.1) (2021-02-11)

**Note:** Version bump only for package @oney/profile-adapters





# [0.19.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.18.0...@oney/profile-adapters@0.19.0) (2021-02-11)


### Features

* profile - Add call to oneytrust to ask for a case analysis and trigger a callback ([7ca1d09](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7ca1d09e9eea03a1095884554fa1f13d63655f23))





# [0.18.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.17.0...@oney/profile-adapters@0.18.0) (2021-02-11)


### Features

* **payment-azf:** change the LCBFT callback fields according to SMONEY's updated contract ([f1cc29e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/f1cc29e7ebf5b6abfb26e5ef132274978256f564))





# [0.17.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.16.0...@oney/profile-adapters@0.17.0) (2021-02-11)


### Bug Fixes

* add generic OTP to validate phone and change dispatchEvent() for dispatch() ([51d1171](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/51d1171e518e254bca28ee3aedcdf15a77c96852))
* **fix conflict:** fix conflict ([bc0e7d2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bc0e7d2ba9a32b8954540ddfcb97bd25aed0aeb4))
* **fix tsconfig:** fix tsconfig ([369f5aa](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/369f5aa95a31451258f3dc6cb1700b9bf2c81908))
* profile - Improve wording and links in onboarding tips ([58a70de](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/58a70deeb10acbc2d025bc4b27565a50716de4fd))
* profileAzf - improve validation body request and tips handling ([479f698](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/479f69898b37831cc229e54fb1617a2f9e81664a))


### Features

* **fixing checkmarx:** fixing checkmarx ([92a4fb4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/92a4fb4138d708ee4bdbe24d8316c0ab114609a6))
* profile - Add RIB deeplink in tips ([7f7ccc0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7f7ccc0d07a61a84630fe1825e2a15102fc6b4af))
* **handling checkmarx:** remove test from build ([89482f2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/89482f2da9285ca9d48abfc42161e47f8c20c869))
* **profile:** modify event listener for bank account aggregation success to listen for bank account aggregated messages ([46a687f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/46a687fb741067c1c88bc0a80684ed91e82e3785))
* **profile:** modify event listener for bank account aggregation success to listen for bank account aggregated messages ([42f0bdb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/42f0bdb38c6bf0b3b93d0c5342ed602ad8816a26))
* **profile:** remove dead code in event listener ([1c49c44](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1c49c44cbac40779f8798094c334642d8bb2308e))
* profile - improve status handling based on OT callback ([bf6f33a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bf6f33a130d393a655eba8e628b741e55c4e0505))





# [0.16.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.15.0...@oney/profile-adapters@0.16.0) (2021-02-08)


### Features

* profile - change user Status for acivateProfile by aggreg usecase ([0c849e2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0c849e27e3c553c314cb175ff7577f1031d529b8))





# [0.15.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.14.0...@oney/profile-adapters@0.15.0) (2021-02-07)


### Features

* profile - add feature flag to activate callback URL in oneytrust payload ([9520ef0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9520ef07aea5a0332c2d213bf1d8308ac17ad235))





# [0.14.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.13.0...@oney/profile-adapters@0.14.0) (2021-02-06)


### Features

* **docs:** add living documentation ([aae039d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aae039d3d6feb08515853023e058ce7fd59a6c11))





# [0.13.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.12.2...@oney/profile-adapters@0.13.0) (2021-02-06)


### Bug Fixes

* **fix conflict:** fix conflict with dev ([69673dd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/69673ddbbf61324a29e8665bd8eab7e1c400be63))
* **fix coverage:** fix coverage ([0c240b7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0c240b7a785c89ea3f9adcc79509cca3cafd7da9))
* **fix lint:** fix lint ([97293ef](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/97293efa391da81437e632e12d9e45029b2a4481))


### Features

* **adding event libs:** adding event libs message for aggreg payment profile ([fe86f03](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fe86f03a9b54241aa374ac770bfae3926621b956))
* **harmonise:** harmonise handlers, fix typing between bounded context, fix tests ([2e1ae6c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2e1ae6c76d57dad05990537edae34a819e16338c))





## [0.12.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.12.1...@oney/profile-adapters@0.12.2) (2021-02-05)

**Note:** Version bump only for package @oney/profile-adapters





## [0.12.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.12.0...@oney/profile-adapters@0.12.1) (2021-02-03)

**Note:** Version bump only for package @oney/profile-adapters





# [0.12.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.11.2...@oney/profile-adapters@0.12.0) (2021-02-03)


### Bug Fixes

* **on-2241:** fix pr comment ([b58571a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b58571abde1f4c520c9eafa7a0e4ebf1514aa564))
* **on-2241:** fix pr comment - add comment ([5e1d69e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5e1d69eb76b2298a55868bfe5e9eb11be1283dd6))
* **on-2241:** fix pr comment - add description for saga ([c203904](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c203904fb94e3003d727597008d672c38c5295ae))
* **on-2241:** fix pr comment - fix typos on diligence status enum ([1c9b0e0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1c9b0e00e3f2571144dda9e16812766c59955152))
* **on-3228:** remove unused variables profile unit tests ([79f012d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/79f012d0546d7d1870a40d3d3c7a9508810212b7))


### Features

* **on-2241:** fix pr comment ([73ceb29](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/73ceb296da77554385ee764bb08690b53fb6fbd5))
* **on-2241:** fix pr comment ([8a7721c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8a7721c89d0d599bc481b2ea83c4f4977e835fec))
* **on-2241:** fix pr comment ([21e4fc5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/21e4fc5b97bd8bb8cc02605f3a5c732754282af0))
* **on-2241:** renaming for more accuracy in description ([7ee1e31](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7ee1e3106439cc6e60769277101d6744bfa0229c))
* **on-2241:** WIP handle pfm aggregation success event and activate profile ([e653144](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e653144e036e5a124e9934813cbd1505ffd3f1d8))





## [0.11.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.11.1...@oney/profile-adapters@0.11.2) (2021-02-02)


### Bug Fixes

* **add:** add ([7a5176a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7a5176a9bb1ef9dedb632302aa77dede60621711))





## [0.11.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.11.0...@oney/profile-adapters@0.11.1) (2021-02-02)

**Note:** Version bump only for package @oney/profile-adapters





# [0.11.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.10.0...@oney/profile-adapters@0.11.0) (2021-02-02)


### Bug Fixes

* change to the right status after diligence sct in ([3cefd03](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3cefd035e98520310824f4b00db29ce679bb055f))
* fix token AD issue (update token and nock calls) ([b255140](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b255140edf42b29ce66cfdc16998ee73876afb95))
* rename familyName to legalName ([7972da3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7972da39b17a489a052d669cc502bdf4b7fbf299))
* rename tin to fiscalNumber ([92a538c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/92a538cad29113b99bfe33c74d7ea4c1e2817a5b))
* send the data in body instead of query in oneyFR auth routes + return the list that require tin ([561fd5b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/561fd5b15b7ed983c9cf4d4f6bb6ed9a89a71f6c))
* **fix conflict:** fix conflict ([99f6897](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/99f6897ef0dfde11e471368ba4a7a41be823a708))


### Features

* in profile, rename marriedName to legalName ([e33ab42](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e33ab423a11284851c010fced554d1c45002644d))
* remove economicactivity from the smo account creation and update ([c16e4d1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c16e4d112aad754fffd233d2da7729fa7dc59711))
* update payment call from profile ([201ce8f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/201ce8f6238c7c85e9d04ec32bf8515264acb185))
* **add payment-events:** add payment-events ([32ce87f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/32ce87fdd95e0a970a22870f09578542bb4065ac))





# [0.10.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.9.0...@oney/profile-adapters@0.10.0) (2021-01-28)


### Features

* add a new route which returns the list of professional activities ([1dcf848](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1dcf84876819162ac9592108293210951faaf8f2))





# [0.9.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.8.0...@oney/profile-adapters@0.9.0) (2021-01-26)


### Bug Fixes

* **fix conflict:** fix conflict ([2739438](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/27394389356ee8b3f01b8ceaeba195498d469baa))


### Features

* **adding bankaccount and address step:** adding BankAccount and Address step in monorepo ([286927e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/286927e5b634e9308c74503f734983610d771d42))
* add fiscal status usecase + payment account update usecase and route ([6daa6ca](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6daa6cadb1a452bcb7462582525fa1282d534dd1))
* add fiscal status usecase + payment account update usecase and route ([305e6b8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/305e6b8ebd4a3ab5de20c5919de5333d880f871c))
* add odb payment api service and OT folder update ([0968c88](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0968c88b01b28201d13671ef855563ceec9fd9bc))
* add odb payment api service and OT folder update ([37d97ff](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/37d97ff3a281c09f5da341903e2fda0a5be5ca63))
* setup fiscal status tests ([a270b19](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a270b1998a8fe932133720aac489718d9dff71e2))
* setup fiscal status tests ([49b7088](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/49b7088ee5a53712bbc9fd2656cd9c437fedec60))
* update integration and unit tests with real fixtures for facematch, address and civilstatus ([05cbc29](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/05cbc29c993880e7892c27bed9a676d3acb00a3e))
* update integration and unit tests with real fixtures for facematch, address and civilstatus ([b940a93](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b940a933946d61788d702598c2d01c6737b35cb4))





# [0.8.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.7.0...@oney/profile-adapters@0.8.0) (2021-01-20)


### Bug Fixes

* fix error in build profile api kernel ([7c88c65](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7c88c65fffc6a5ef45275de1ec3df54261ce525a))


### Features

* add domainEvent handler to update user when LCB/FT received ([4e60964](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4e6096429c13b0bd84c5222e530a6e524354d9c9))
* add LCB/FT Smoney callback handling ([a781ebb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a781ebbd01c4da2d12cabe555bac3c556688eb67))





# [0.7.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.6.0...@oney/profile-adapters@0.7.0) (2021-01-20)


### Bug Fixes

* **adding address step:** adding oneyTrust and oneyCRM api ([5b7ae7f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5b7ae7fdf484a44ea7926e6bd01d2f33da6c8f36))
* **fix config:** fix config ([c9d0109](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c9d010959e9a3f232dccd0a824c76b66cbfe69ac))
* **fix conflict:** fix conflict ([8a51120](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8a51120bd97fe3a9baf798f2e8eb110592934525))


### Features

* **finalize civilstatus:** finalize civilStatus ([e7b8cb8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e7b8cb8a4922ac0de4db8502f24f92dcef5e0123))





# [0.6.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.5.4...@oney/profile-adapters@0.6.0) (2021-01-18)


### Features

* create a route which returns the list of fiscal countries ([24b4b8c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/24b4b8c61098fbd6c4025ef098c91a66e9fecae1))





## [0.5.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.5.3...@oney/profile-adapters@0.5.4) (2021-01-17)

**Note:** Version bump only for package @oney/profile-adapters





## [0.5.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.5.2...@oney/profile-adapters@0.5.3) (2021-01-14)


### Bug Fixes

* **fix mongo version:** fix mongo version ([a430fe1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a430fe1e590c2e40794338c80118c4e4fe7ed6da))
* **fix user creation:** fix user creation ([040e1b5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/040e1b5dede54d63584ad9a343207b92e8c2c248))





## [0.5.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.5.1...@oney/profile-adapters@0.5.2) (2021-01-13)


### Bug Fixes

* fix issues related to the domain events subscriptions and send ([6f25cce](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6f25cce1c42727ce6c325573d70dcbc3e01dc6d0))





## [0.5.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.5.0...@oney/profile-adapters@0.5.1) (2021-01-12)


### Bug Fixes

* fix typo in profile mapper ([bc28d7c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bc28d7c6ea9d29f4e9caf71104a28a3270b15c12))





# [0.5.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.4.3...@oney/profile-adapters@0.5.0) (2021-01-12)


### Features

* migrate sending kyc filters to S-Money in mono repo ([b87ae56](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b87ae5681c2089f0e7694ef8a44a8fb825beb7d0))





## [0.4.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.4.2...@oney/profile-adapters@0.4.3) (2021-01-11)


### Bug Fixes

* fix saving user in DB (don't mix legacy and profile models) ([635295d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/635295d3fb8cb323c4285de3c09b6d98d3c4ebdc))





## [0.4.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.4.1...@oney/profile-adapters@0.4.2) (2021-01-11)

**Note:** Version bump only for package @oney/profile-adapters





## [0.4.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.4.0...@oney/profile-adapters@0.4.1) (2021-01-11)

**Note:** Version bump only for package @oney/profile-adapters





# [0.4.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.3.0...@oney/profile-adapters@0.4.0) (2021-01-08)


### Bug Fixes

* fix conflicts ([22f946b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/22f946b09b00ea6e931473841fc4f801714091f3))
* fix import issues during the build state ([0d332b1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0d332b1b41552d654cf25110252cd689ff5dfc5a))


### Features

* add tests for complete diligence and setup keyvault ([07397eb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/07397eb56c82bdc8560bd64b973948407a81ede6))
* correct the callback type 31 payload according to the documentation ([4cb8012](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4cb8012e6262ef77776ad4a34353dc76e719ea4e))
* send domain event when the diligence sct in is completed ([fc23f29](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fc23f290a76c9a3968281593b0cd439b132986ce))





# [0.3.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.2.5...@oney/profile-adapters@0.3.0) (2021-01-08)


### Bug Fixes

* add timeout to dl mongo memory ([0a5e77f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0a5e77f32fdccf6fc98822675e50740c8cc6708c))
* feedback from PR ([d83038b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d83038bb59bad6484641cc1ee569fe23f30ce00c))


### Features

* migrate facematch step from odb_account ([b3cd1a1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b3cd1a1b8e693d06397d610fe06aa53d196fa872))





## [0.2.5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.2.4...@oney/profile-adapters@0.2.5) (2021-01-05)

**Note:** Version bump only for package @oney/profile-adapters





## [0.2.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.2.3...@oney/profile-adapters@0.2.4) (2020-12-30)

**Note:** Version bump only for package @oney/profile-adapters





## [0.2.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.2.2...@oney/profile-adapters@0.2.3) (2020-12-24)

**Note:** Version bump only for package @oney/profile-adapters





## [0.2.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.2.1...@oney/profile-adapters@0.2.2) (2020-12-24)


### Bug Fixes

* **fix image tips:** fix image tips ([aad5714](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aad5714a424843c11a87a7899a1e20714853f518))





## [0.2.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.2.0...@oney/profile-adapters@0.2.1) (2020-12-23)


### Bug Fixes

* **adding previewimg to tips detail:** adding previewImg to tips detail ([3423e05](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3423e053b09f0e6c8f34953dc3c84ae72f7ba5d1))





# [0.2.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.1.2...@oney/profile-adapters@0.2.0) (2020-12-23)


### Bug Fixes

* add fradu result to domainEvent ([da98890](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/da98890297e30a2bf22c881f4687fce80f28a854))
* improve tests and coverage ([633837a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/633837a2d057dec3aa0d002eb82513df52fe6523))
* pR feedback ([2112ebf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2112ebf63bf25d3686b698223188035af86e8443))
* refacto and use profile entity ([b830103](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b830103e0e5717f542364b4848175b0c4a9e707d))


### Features

* migrate Oneytrust Decision callback ([8fc0478](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8fc04787fb73039c6f91f969c6d2f3677d2f0a35))





## [0.1.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.1.1...@oney/profile-adapters@0.1.2) (2020-12-01)


### Bug Fixes

* **adding link:** adding link ([25ca3a8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/25ca3a86a1f5bd9a8b0d6a600112c04e5002e418))
* **fix eslint:** fix eslint ([ddac78c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ddac78cab9574d896e766d9f8fb5ab72c725e15b))
* **fix mapper:** fix mapper ([303bf3f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/303bf3f3b78d9e995dac9e177818551d8dad8db6))
* **fix profile mapper:** fix profile mapper ([3722d53](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3722d53356d0631c3b072d2fceee1aa8361635df))





## [0.1.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.1.0...@oney/profile-adapters@0.1.1) (2020-11-28)


### Bug Fixes

* **fix mappers:** fix mappers ([e4db25d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e4db25d08ddfe2b98b9f6358b1729aca3f1ca3ea))





# [0.1.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.0.1...@oney/profile-adapters@0.1.0) (2020-11-27)


### Bug Fixes

* **fix circular dependencies:** fix circular dependencies ([7549237](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/754923742c261d3a9304c022bea588b5e4f3b14f))
* **fix integration test:** fix integration test and refactor some code ([00ecb8e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/00ecb8e193128a37156fbe9804cb7738f784c5e8))
* **fix reviews:** fix reviews ([768f0b1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/768f0b140d9c9d9da84bd7d37230c87fb6a26b2f))
* **fix reviews:** fix reviews deleting index and fix codebase ([1f10ccb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1f10ccba749844a484730ea2aad79fbd7fdaff90))
* **fix tests:** fix tests with nock ([576872c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/576872ce97d4babf0fe1376e3c2e48c34262756a))
* **type:** type ([e713f26](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e713f261f9f6f900e27d9da30be47468e6465536))


### Features

* **add tips:** wIP add tip ([63a0b65](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/63a0b65b45fd4c64a9b39248774c2b9cf0b32b71))





## 0.0.1 (2020-11-23)


### Bug Fixes

* **aze:** aze ([4f7b264](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4f7b26457dbdec197d834e41518e4dc30b88b64b))
* **fixing version:** fixing version ([06c53e8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/06c53e800de80f9927054f4cff10ca22d4797f2f))
* **patching:** patching ([ea7f4d3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ea7f4d371dfb94a8c99f3b8fd86e2b78d8f7e91b))
* **testing versionning:** testing versionning ([3d5c51b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3d5c51b47ec98d737d4b2b571edd4a14aaf5f429))





## [0.0.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.0.8...@oney/profile-adapters@0.0.1) (2020-11-23)


### Bug Fixes

* **patching:** patching ([ea7f4d3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ea7f4d371dfb94a8c99f3b8fd86e2b78d8f7e91b))





## [0.0.8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.0.7...@oney/profile-adapters@0.0.8) (2020-11-23)

**Note:** Version bump only for package @oney/profile-adapters





## [0.0.7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.0.6...@oney/profile-adapters@0.0.7) (2020-11-23)

**Note:** Version bump only for package @oney/profile-adapters





## [0.0.6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.0.5...@oney/profile-adapters@0.0.6) (2020-11-23)

**Note:** Version bump only for package @oney/profile-adapters





## [0.0.5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.0.2...@oney/profile-adapters@0.0.5) (2020-11-23)


### Bug Fixes

* **aze:** aze ([4f7b264](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4f7b26457dbdec197d834e41518e4dc30b88b64b))





## [0.0.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.0.2...@oney/profile-adapters@0.0.4) (2020-11-23)


### Bug Fixes

* **aze:** aze ([4f7b264](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4f7b26457dbdec197d834e41518e4dc30b88b64b))





## [0.0.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/profile-adapters@0.0.2...@oney/profile-adapters@0.0.3) (2020-11-23)

**Note:** Version bump only for package @oney/profile-adapters





## 0.0.2 (2020-11-19)


### Bug Fixes

* **testing versionning:** testing versionning ([3d5c51b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3d5c51b47ec98d737d4b2b571edd4a14aaf5f429))
