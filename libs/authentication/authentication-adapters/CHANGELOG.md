# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.20.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.19.0...@oney/authentication-adapters@0.20.0) (2021-04-29)


### Bug Fixes

* **oney-messages:** fixed test and linter ([e5e32b0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e5e32b0819be1ccdcc2087c4d86013398165393d))
* **oney-messages:** fixed tests ([7417772](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7417772ff00a817a14ccda4f6c7921aa72677175))


### Features

* **oney-messages:** adapted some tests ([ab80767](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ab80767808c4806a32c109101f8ac8141b3f20d3))
* **oney-messages:** added EventHandlerExecution feature ([e4f71ec](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e4f71ec59dc59e300d5a8b63f08f5f89bda9bd53))





# [0.19.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.18.0...@oney/authentication-adapters@0.19.0) (2021-04-29)


### Bug Fixes

* **auth:** add feature toggle for saml response signature verification ([215f7b9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/215f7b9d210c53557b2518e40c4b620eeabc1bbc))
* **auth:** remove proxy ([d7cfb85](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d7cfb85e496501b15de987452081c61bb3e8218d))
* **auth:** throw a more accurate error on failure to verify saml response signature ([afcb3c1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/afcb3c1097ccbd4b57d3360df73b6cf7646c26fd))
* **auth:** user auth token as env var and robustify duration input validation ([b149be7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b149be7d44183ae4bcedb08de5c0912a250a5596))


### Features

* **auth:** variabilize expiration of user auth token as a secret ([2e990ed](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2e990ed0cf8b143207ddea08824ff76b6654c703))





# [0.18.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.17.0...@oney/authentication-adapters@0.18.0) (2021-04-14)


### Bug Fixes

* **auth:** pr comment - typo + remove unnecessary boolean ([27d6a50](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/27d6a5045ab434cdf4f632195fc10b3c8e717b7e))


### Features

* **auth:** dispatch signature verification error event ([5a1adb3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5a1adb34af95ac61a45acf19b2a9a6bfa8e934f1))
* **auth:** handle invalid saml response signature ([cf7d408](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cf7d4089bf9e26c78dd6603692869e3e0d22705e))
* **auth:** send email error notification on auth signature verification failed event ([7014c4d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7014c4ded076675e89cbd15252976afb0616c49a))





# [0.17.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.16.1...@oney/authentication-adapters@0.17.0) (2021-04-13)


### Features

* payment - send to SMO kyc document and filters on creation if already available ([81eba6b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/81eba6bab6dcdfba01a2deaa4338300979e26ba5))





## [0.16.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.16.0...@oney/authentication-adapters@0.16.1) (2021-04-13)

**Note:** Version bump only for package @oney/authentication-adapters





# [0.16.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.15.0...@oney/authentication-adapters@0.16.0) (2021-04-12)


### Features

* **auth:** add error handling on verification + tests ([330ae31](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/330ae31e39b1a39a02145094463418c8290b48b4))
* **auth:** verify saml response signature ([0c1cb52](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0c1cb528d7d95bce64c1a3cd6a49aa8b95bc398f))
* **authentication:** add proxy on refauth requests for local development ([1c439dd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1c439dd2ba812637eaf3e55bebbe823483b4646a))


### BREAKING CHANGES

* **authentication:** proxy is used - work in progress





# [0.15.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.14.0...@oney/authentication-adapters@0.15.0) (2021-04-07)


### Bug Fixes

* **authentication:** enhance codebase, add ability to toggle password and block api ([450a079](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/450a07976138b43088593a92ac102a1e273ab244))


### Features

* **authentication:** add ability to ban a user ([1eba00d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1eba00d9e966020726bf01bd4d73caf49f716074))
* **authentication:** add ability to setup password authent factor ([483016d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/483016d3410e39b0b47c33add2d66e41c82610ab))
* **authentication:** adding password ([1a44824](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1a44824bc54906541d30bd96b1cfcc4a080bd155))
* **authentication:** wIP adding user password mode ([6595376](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6595376531d366900d0bb23ace465f359b22997d))





# [0.14.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.13.1...@oney/authentication-adapters@0.14.0) (2021-04-07)


### Bug Fixes

* **auhtentication:** pr comment - remove saving failed card provisioning to db + remove event ([be003d2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/be003d2504599c0c3de76f680105a27faf1250b4))
* **auth:** pr comment - abstract auth response in core ([51a46b5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/51a46b5c8d187515c18181d8179933cb140aaf3a))
* **auth:** pr comment - abstract cookies in verifier generator ([209fe9e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/209fe9ebc64c7df5aa83925695bf840fe9712142))
* **auth:** pr comment - abstract verify request config in core ([76284ef](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/76284ef896985ca64d0eaeb59a17201dd52b51a7))
* **auth:** pr comment - create hashed card pan by passing plaintext ([defb801](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/defb801c2f1da6c584134bcf3602c262813faf9b))
* **auth:** pr comment - remove abstraction from core ([c705cea](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c705cea49d13f0e66871b4814e192b8b059f75d9))
* **auth:** pr comment - remove null objects and uniform email value object ([1745e19](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1745e19cee7dba242be1780d320d7088e0d5340d))
* **auth:** pr comment - remove some icg details in core ([b692f90](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b692f90d0d61e6d7f081f9c63e9765648ccbaafa))
* **auth:** pr comment - remove state in auth init result mapper ([149a707](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/149a7077511a92aeec16f1b370bff6397842d168))
* **auth:** pr comment - remove state in icg verifier gateway ([e08634d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e08634dcf2f445b487a22c797795f0588469d628))
* **auth:** pr comment - remove state in icg verify request body mapper ([15bb2d9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/15bb2d9e7689155c95eb2396171590fd502d652e))
* **auth:** pr comment - rename typo ([bdc9ea2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bdc9ea22c85ff103b57e1c06ce3231864ea0fae7))
* **auth:** pr comment - robustify user request from repos ([b966253](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b9662539b1f50ae22b5eaff3a29d13ab0edb534d))
* **auth:** pr comment - separate interface gateways for phone and card provisioning ([65d1d2b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/65d1d2bf2d236d9396a5467831f31ea27ab36d0a))
* **auth:** pr comment - single implementation for phone and card provisioning gateway ([163ec10](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/163ec10bea759f9518ee0c6c042f3f1e2a758bf9))
* **auth:** pr comment = remove implementation detail from core ([4a4c3cc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4a4c3cc1bd23c395361cbad4de06d8bf575cbeb7))
* **authentication:** fix missing await in test and remove unnecessary timeout ([6237825](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/62378255481b2a553c5e487020dc29cd1b329c76))
* **authentication:** fix pr comment - move inmemory types from build dependencies file ([c651e7a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c651e7a73c09b5d991c051651a91103245cd5780))
* **authentication:** fix pr comment - renaming ([2ab9b5f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2ab9b5f8dc12912e85bbef91eb3f17dc7189e865))
* **authentication:** fix pr comments ([b21c349](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b21c349c928fcfeb04ecce63198047bb83f50982))
* **authentication:** fix pr comments ([62d2aa3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/62d2aa382a210673f23a885bdb7b5da73c37508a))
* **authentication:** fix pr comments ([e571dff](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e571dffad8a244880b63c373718eae26db38a6e2))
* **authentication:** fix pr comments ([a3f97ed](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a3f97ed8e8af47bd8d6e2c238a62c9b5a130ca9f))
* **authentication:** fix tests + coverage +  clean code ([bc42a1c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bc42a1c82e85e78c7a6c505f6253f9e170b89540))
* **authentication:** fixes for integrating new event handler management ([96ed025](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/96ed0257c7b69bb5ab65fbb98fd76ce0611cf4c3))
* **authentication:** handle booloean phone property casted to string for legacy users ([b157274](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b1572749138ef1f734ed1b54e581bb146e68a2f0))
* **authentication:** handle timeout or internal error when retrying ([a2751e1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a2751e1b00df85d02853a067f3fdde2bc8bde04f))
* **authentication:** pr comment - add device trusted and trusted device reset domain event ([0d846d4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0d846d4fc99cee38263b0c64f5fcf6b33493b2a4))
* **authentication:** pr comment - add Email value object to user aggregate root ([bd5b03e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bd5b03ebf02d6f2acde11f35b701b990a231e22a))
* **authentication:** pr comment - add pan validation in hashed card pan ([2df630d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2df630d0ab7f4aa6b6fa14dc92901d35f5f97018))
* **authentication:** pr comment - add user sign in domain event ([a7a660f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a7a660fedd71bfeb0a9e167a8fca4b9c824a8bc2))
* **authentication:** pr comment - create gateways to hide provisionings implementation details ([d2a2743](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d2a27436fa00806ccb210a99950d38eb20b7f80a))
* **authentication:** pr comment - don;t use class state ([56ebf9a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/56ebf9a2c4fd903aae657ba0a9e48bbd6b6b763c))
* **authentication:** pr comment - don't use internal state ([7781d22](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7781d227f3c41aeb43678c8104b2a034dbb3c8f8))
* **authentication:** pr comment - hide implementation details in card provisioning ([687c53d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/687c53dbaf9881c012efe34d08e4e5754304d0d2))
* **authentication:** pr comment - rename create user usecase to sign up user ([31a3fb6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/31a3fb6ea118c8f44534b768b2cee4168a772430))
* **authentication:** pr comment - rename phone provisioning aggregate method and associated event ([2b0a39e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2b0a39e5ad793dd5a7826a6b36a9ffb811f81737))
* **authentication:** pr comment - renaming ([c8aa2f1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c8aa2f11791a64a0da18a4732ad63b8111146f74))
* **authentication:** pr comment - return aggregate instead of new instance in set and clear pin code ([ef62b92](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ef62b921b497e4c80c2d5941e815441894ce20cc))
* **authentication:** pr comments - remove state ([cc3c3c8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cc3c3c84ce95a2155f619468377e2180666e4606))
* **authentication:** quick fix for when timeout on retries ([0e33938](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0e33938e85b0bfe1cae70df97846d2d6e0a91d9d))
* **authentication:** robustify default error strategy operator ([1b26326](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1b263263607222b2fa266023ac7cc1208e60862d))


### Features

* **authentication:** add acs provisioning api endpoint ([6e2b12e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6e2b12ea83c192ed0af4207d8f5695a826ff2a60))
* **authentication:** add card provisioning main events ([9005473](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/900547346683e7d8c39fcd74eff57dc78538990d))
* **authentication:** add error notification on on user not found on phone provisioning ([7cbd744](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7cbd744741545b457e595026cfe2a6e66aabfa6e))
* **authentication:** add error notification on phone provisioning failure ([cf54f2a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cf54f2a255be9687bc61ad7523b538890b658a25))
* **authentication:** add find latest blocked verifier to get unblocking date ([9e9034f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9e9034fde1c666860ece139d730ba75503898f1b))
* **authentication:** add logger in default retry strategy ([abeb7c5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/abeb7c5dc995b750ff429d80eea996acb5798dea))
* **authentication:** add phone provisioning events ([cde71d0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cde71d04bd9e8301c3dc42469422d8da36c2d5e1))
* **authentication:** add provisioning error notification recipient ([7685ad5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7685ad5afff21e53a1cb2b59e27dd3a824956c9c))
* **authentication:** add user created domain event ([d37a739](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d37a739e5c2264d4f8b7c746965f0a0a85e071e3))
* **authentication:** create card lifecycle function topic env var ([aefba61](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aefba6102b5f34acfa76cbf7c5d8b7fbfeb8e557))
* **authentication:** dispatch  phone provisioning error event with specific error ([332cd66](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/332cd66202d340c16d8c150478ca18de8613c1dd))
* **authentication:** handle legacy users with boolean phone ([57770af](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/57770afc7d2f7cc1679f738ea7274c05d1544e49))
* **authentication:** migrate user card acs provisioning to lib env events and handlers ([40ee676](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/40ee67636f3c7118d527077e63988eff5dc5bde0))
* **authentication:** populate legacy user with missing data when verify provisioning ([b698ef9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b698ef92e6f8b036ee9bf6f1207afdb68a7ba0df))
* **authentication:** transform phone field into a string to store number ([63c54f6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/63c54f6d839faad6a87c19c5c9d015acb8028a37))


### BREAKING CHANGES

* **authentication:** user.phone is now a string type instead of a boolean
* **authentication:** invalid pans are no longer tolerated
* **authentication:** the user aggregate root now has an email property that is now a value object
instead a string

on-3543





## [0.13.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.13.0...@oney/authentication-adapters@0.13.1) (2021-04-03)


### Bug Fixes

* **notification:** fix notification-api ([0cd1675](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0cd16753f5a5e292a4828e51ac482305eefa65b8))





# [0.13.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.12.0...@oney/authentication-adapters@0.13.0) (2021-04-02)


### Features

* **authentication-profile:** add ability to check register/create with phone ([1ff638b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1ff638bd1fc861d5c2f8c63a6da4c67e134fc4d4))





# [0.12.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.11.0...@oney/authentication-adapters@0.12.0) (2021-03-30)


### Features

* **oney-messages:** migrated new develop version ([782e25c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/782e25c7e3cc940c0a135406b24cd9acd16dd45e))
* **profile,payment,auth:** add birthDepartmentCode and birthDistritCode to the Profile ([bd15974](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bd15974135c231500824364866950070fe2d3896))





# [0.11.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.10.0...@oney/authentication-adapters@0.11.0) (2021-03-10)


### Features

* **authentication-azf:** add mongo implementation ([12ed819](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/12ed8193cfc6c8883bbc1b83084a8c3e9286da8f))
* **authentication-azf:** mongo implem, test, fix code, almost there, tests OK ([ede2cab](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ede2cab4d486a8455b1e7de192d9a93afaaed7c2))





# [0.10.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.9.5...@oney/authentication-adapters@0.10.0) (2021-03-03)


### Bug Fixes

* **adapt dispatch:** adapt dispatch and fix issue ([75d793d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/75d793de4bd0ff36d7876041e143eb0ea577ef84))
* **fix comments:** fix comments ([a5eb386](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a5eb3860ab62174717dea626743eee8dcc0b63b3))


### Features

* **profile:** migrate register in monorepo ([87255ef](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/87255efa6cb1fc11ee7955186cc008caca1e583b))





## [0.9.5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.9.4...@oney/authentication-adapters@0.9.5) (2021-03-01)


### Bug Fixes

* **otp:** remove legacy otp envent handler and fix twilio payload ([fe04b10](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fe04b1075f2e7a940e2cd90d240922780068d476))





## [0.9.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.9.3...@oney/authentication-adapters@0.9.4) (2021-02-26)


### Bug Fixes

* **fix code and mapper:** fix code and mapper ([37b9723](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/37b9723de19cee3cfa76a203bd1d8911621bfc2e))
* **fix test build lint:** fix test build lint ([ae9278d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ae9278d67e4632ab3c368c7f9c9998a1215e7424))
* **sca:** standardize verifier response accross backend ([1f28caf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1f28caf8f2348316b20774708b96e98eb9983e8b))
* **sca:** standardize verifier response accross backend ([6a2930e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6a2930eadb18defc4d75c6cd70df76c5546d8e70))





## [0.9.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.9.2...@oney/authentication-adapters@0.9.3) (2021-02-25)


### Bug Fixes

* **authentication:** fix missing couloir cookie for non-prod environments ([b7df769](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b7df769d02f42692a6a476445a0c81e63ccf364e))
* **authentication:** return provisioning response code even when icg disabled ([08e742d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/08e742dcbfaa767a28687f5f7c079c7b99eba49d))
* **authentication:** store all cookies from auth init to use them in verify ([c8f9d6c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c8f9d6cd1df5b65ff6649fce8be9d71c4cbdf7fe))
* **fix conflict:** fix conflict payment-azf ([7935d18](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7935d1851c10b201bae6a5644a1fa4f62059eaa6))





## [0.9.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.9.1...@oney/authentication-adapters@0.9.2) (2021-02-24)


### Bug Fixes

* **fix test:** fix test ([2e53b91](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2e53b9149dde2a6c30d51d894ea6fd22f61ab737))
* **fix test authentication:** fix test authentication ([6f10763](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6f10763956972ed1c8b55a7e3a6ced09afebff66))
* **fix tests auth:** fix tests auth adapters ([774da4c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/774da4c514a5cc59a4b259f54851862b1902e2fc))
* **remove import:** remove import global jest ([42275d6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/42275d6511f3c1e0e1f5d853db05a754f8473a71))





## [0.9.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.9.0...@oney/authentication-adapters@0.9.1) (2021-02-17)


### Bug Fixes

* **authentication:** correct cookie positioning for production ([519ef67](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/519ef67c5f35ec122148e8eb9b5b0508daa4a9a1))





# [0.9.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.8.0...@oney/authentication-adapters@0.9.0) (2021-02-16)


### Features

* **authentication:** add health check for partner authentication service ([96b4470](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/96b447069b2d88be43dd51ea05fbf4e8821c4e3c))


### BREAKING CHANGES

* **authentication:** renames ping_icg into ping-refauth-icg

on-2250





# [0.8.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.7.0...@oney/authentication-adapters@0.8.0) (2021-02-11)


### Bug Fixes

* **fix env:** fix env ([0636a64](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0636a64ba117e969f29d9de018792c1f3b0633c7))
* **fix env for selfcertificate:** fix env for selfCertificate ([869da14](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/869da14b07dc24b81c91844bfdd7098e74e8c8c3))
* **fix tsconfig:** fix tsconfig ([369f5aa](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/369f5aa95a31451258f3dc6cb1700b9bf2c81908))


### Features

* **authentication:** add phone provisioning check before acs provisioning ([553d41c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/553d41c45f4dc0c9d7d5a553f4cb4adaaa319180))
* **authentication:** force phone provisioning when user not provisionned or no phone provisionned ([a3c1075](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a3c107504d28b384dbd296ffac61abf457a21c96))
* **authentication:** force provisioning for user not provisionned before acs provisioning ([aba2456](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aba2456cc105485fac0f2dd36908cde1c2db1f70))
* **authentication:** get details of authentication methods available for user ([b57474c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b57474c5a8371d33db34d5209863b2731af1751f))
* **authentication:** handle existing provisioning field with failed steps and when no provisioning field ([67adaeb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/67adaeba52044ce28f6cefde3b1f75151a45789c))
* **authentication:** handle failure when updating provisioning ([79fd60a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/79fd60aeb9fc6f80d7609c30f6665733d7269d09))
* **authentication:** handle legacy users without provisioning field ([d21a1e9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d21a1e918bd6be590af51d6c41b0d0bf503651f4))
* **authentication:** handle saving failed acs provisioning when decryption error ([fa9c5a9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/fa9c5a9b871677dc63713414dc45aa8eb506dbda))
* **authentication:** handle setting provisioning field with step and date on error response ([24e7d31](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/24e7d314738d83190438029a6d1078044dcb2462))
* **authentication:** handle user not provisionned on authentication partner ([804fdc4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/804fdc4735bbd10f27eb030278c83fe3dd7765e0))
* **authentication:** handle when user not provisionned on authentication partner ([8454afa](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8454afa007e8b01f336cf8824342685315c8b368))
* **authentication:** integrate identity lib on authentication ([3a6b3fd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3a6b3fdb6ead8c9d68b4627cf42a1fd009e05b85))
* **authentication:** save user phone when phone validated message received ([7a3a964](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7a3a9647d06be3b097396e8b9a440de52eac2d10))
* **authentication:** set provisioning acs field to fail when no encrypted data in card sent event ([ecd06f2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ecd06f2ed3f0e90ab6a916926938a9291e472ceb))
* **fixing checkmarx:** fixing checkmarx ([92a4fb4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/92a4fb4138d708ee4bdbe24d8316c0ab114609a6))
* **handling checkmarx:** remove test from build ([89482f2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/89482f2da9285ca9d48abfc42161e47f8c20c869))
* **on-3121:** add provisioning field to user after successful phone provisioning ([8c1d63f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8c1d63f00ba4cbb36ea3d1ea27bc3ba92af290ef))
* **on-3121:** add provisioning field to user after successful phone provisioning ([0ce71b8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0ce71b83b4ff828210314b91a1832b6defe257f5))
* **on-3121:** update authentication user and schema with provisioning field ([16339b6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/16339b6119bbb4dddef14047925d932eed58fea8))





# [0.7.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.6.0...@oney/authentication-adapters@0.7.0) (2021-02-07)


### Features

* authentication - add new handler for PHONE_STEP_VALIDATED ([5d315e2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5d315e2ed07a888a57139d0fa3422401902a1815))
* profile - add feature flag to activate callback URL in oneytrust payload ([9520ef0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9520ef07aea5a0332c2d213bf1d8308ac17ad235))





# [0.6.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.5.4...@oney/authentication-adapters@0.6.0) (2021-02-06)


### Features

* **docs:** add living documentation ([aae039d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aae039d3d6feb08515853023e058ce7fd59a6c11))





## [0.5.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.5.3...@oney/authentication-adapters@0.5.4) (2021-02-05)

**Note:** Version bump only for package @oney/authentication-adapters





## [0.5.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.5.2...@oney/authentication-adapters@0.5.3) (2021-02-03)

**Note:** Version bump only for package @oney/authentication-adapters





## [0.5.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.5.1...@oney/authentication-adapters@0.5.2) (2021-02-03)


### Bug Fixes

* **on-3333:** delete unused secret OdbBusEndpoint ([a724564](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a7245640e740eb01d2a67bce5eea81867d0cae45))
* **on-3333:** remove db name from connection string and make it an env var ([37e4776](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/37e4776ae143e79a34b37c1cb6aa4da688a0a440))
* **on-3333:** remove icg config from keyvault secrets and make them env vars ([a4dfa8c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a4dfa8c24f98c393bb7504918cc237e7be812313))
* **on-3333:** rename key vault secret for service bus connection string ([be06295](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/be062959b6645761e830fdb400b2662f2b17c422))
* **on-3333:** rename key vault secrets for card data pan decryption for acs provisioning ([5d1bb0c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5d1bb0cebe3e96187f05e0953ca4e848428f473d))





## [0.5.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.5.0...@oney/authentication-adapters@0.5.1) (2021-02-02)


### Bug Fixes

* **on-3222:** fix self signed certificate flag for saml request + renaming it ([e5a8af6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e5a8af606880fea9dcbeea036298cadccb69cbfa))





# [0.5.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.4.0...@oney/authentication-adapters@0.5.0) (2021-01-27)


### Bug Fixes

* pr Fix ([77d5bcd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/77d5bcd20d8e373967c3a59f70e39cdba2aaae87))


### Features

* create a route which returns all the public key allowed wy BQ_DIGIT ([279e6df](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/279e6dfa2fb1874dfc3c23f1690ec972360be853))





# [0.4.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.3.0...@oney/authentication-adapters@0.4.0) (2021-01-17)


### Features

* **on-3117:** add logs for easier provisioning debugging ([cb3a341](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cb3a341326f34f530b8cca6b60d49407320c185f))
* **on-3117:** be more explicit about phone provisioning response code meaning in use case ([e57799f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e57799f450233cde0ed22dd82f109a9a6a8a7bb6))
* **on-3117:** fix pr comment ([34e84c0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/34e84c03205b62a130402628ad53018abe2258aa))
* **on-3117:** replace console logs with oney logger ([12f7199](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/12f71992a63e1822e11026f46577b90aabdf3073))





# [0.3.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.2.8...@oney/authentication-adapters@0.3.0) (2021-01-14)


### Bug Fixes

* **fix rbac and otplenght:** fix rbac and otplenght ([1dc5506](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1dc55063fdfe94f3916a0073a9691f4908e9691e))


### Features

* **adding metadata and generate:** adding metadata and generate automatically email ([dd4a7c2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/dd4a7c27d1f68d7316a896712ea5d029f939eabd))





## [0.2.8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.2.7...@oney/authentication-adapters@0.2.8) (2021-01-13)


### Bug Fixes

* **fix otp abstract:** fix otp abstract password to same than icg default ([3838d2b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3838d2b7d831e8d8353f16b0b9aa9999beab46ec))





## [0.2.7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.2.6...@oney/authentication-adapters@0.2.7) (2021-01-08)


### Bug Fixes

* fix conflicts ([22f946b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/22f946b09b00ea6e931473841fc4f801714091f3))
* fix import issues during the build state ([0d332b1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0d332b1b41552d654cf25110252cd689ff5dfc5a))





## [0.2.6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.2.5...@oney/authentication-adapters@0.2.6) (2021-01-08)

**Note:** Version bump only for package @oney/authentication-adapters





## [0.2.5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.2.4...@oney/authentication-adapters@0.2.5) (2021-01-05)

**Note:** Version bump only for package @oney/authentication-adapters





## [0.2.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.2.3...@oney/authentication-adapters@0.2.4) (2020-12-30)

**Note:** Version bump only for package @oney/authentication-adapters





## [0.2.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.2.2...@oney/authentication-adapters@0.2.3) (2020-12-24)


### Bug Fixes

* **fixing provisionning:** fixing provisionning ([3710c6c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3710c6cb80f8d5bcd74872a1da834487b3aa1bc7))





## [0.2.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.2.1...@oney/authentication-adapters@0.2.2) (2020-12-23)


### Bug Fixes

* **fix env:** fix env on authentication service ([3261c15](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3261c1586e7fa4bb3072f3cc0985f2452f533669))





## [0.2.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.2.0...@oney/authentication-adapters@0.2.1) (2020-12-21)


### Bug Fixes

* **fix unused mapper:** fix unused mapper ([335fbff](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/335fbff75c23803fc4d4a82a856768a82e5b728d))
* **migrate acs provisionning to auth adapters:** migrate acs provisionning to auth adapters ([90ebd72](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/90ebd720a1f4f50e061c5d31fab7b5906ff7f422))





# [0.2.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.1.1...@oney/authentication-adapters@0.2.0) (2020-12-17)


### Features

* **adding rbac in monorepo, and a lot of enhancements:** adding RBAC in monorepo ([c250621](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c2506216b9c1bc251971944ee2606e61dea7c3de))





## [0.1.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-adapters@0.1.0...@oney/authentication-adapters@0.1.1) (2020-12-09)

**Note:** Version bump only for package @oney/authentication-adapters





# 0.1.0 (2020-12-09)


### Features

* **add strong auth:** add strong auth to monorepo ([0aececf](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0aececf72d542bb0f3352b26865a0f7826be9f73))
