# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.12.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.12.1...@oney/authentication-core@0.12.2) (2021-04-29)


### Bug Fixes

* **auth:** give specific message to error when verifying saml response signature ([e7c7419](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e7c7419cabb5277d190cc590e8bb5d54ecbea3ac))
* **auth:** throw a more accurate error on failure to verify saml response signature ([afcb3c1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/afcb3c1097ccbd4b57d3360df73b6cf7646c26fd))





## [0.12.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.12.0...@oney/authentication-core@0.12.1) (2021-04-14)


### Bug Fixes

* **authentication-core:** fix validator ([57bc777](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/57bc777ab6586b89cf718a58c268738c32f8d79d))





# [0.12.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.11.0...@oney/authentication-core@0.12.0) (2021-04-14)


### Bug Fixes

* **auth:** pr comment - typo + remove unnecessary boolean ([27d6a50](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/27d6a5045ab434cdf4f632195fc10b3c8e717b7e))


### Features

* **auth:** handle invalid saml response signature ([cf7d408](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cf7d4089bf9e26c78dd6603692869e3e0d22705e))





# [0.11.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.10.0...@oney/authentication-core@0.11.0) (2021-04-12)


### Features

* **auth:** add error handling on verification + tests ([330ae31](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/330ae31e39b1a39a02145094463418c8290b48b4))
* **auth:** verify saml response signature ([0c1cb52](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0c1cb528d7d95bce64c1a3cd6a49aa8b95bc398f))
* **authentication:** add authentication verification gateway abstraction ([960b834](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/960b834601181bf395e0fb7466e545fd4fe175d6))





# [0.10.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.9.0...@oney/authentication-core@0.10.0) (2021-04-07)


### Bug Fixes

* **authentication:** enhance codebase, add ability to toggle password and block api ([450a079](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/450a07976138b43088593a92ac102a1e273ab244))


### Features

* **authentication:** add ability to ban a user ([1eba00d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1eba00d9e966020726bf01bd4d73caf49f716074))
* **authentication:** add ability to setup password authent factor ([483016d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/483016d3410e39b0b47c33add2d66e41c82610ab))
* **authentication:** adding password ([1a44824](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1a44824bc54906541d30bd96b1cfcc4a080bd155))
* **authentication:** wIP adding user password mode ([6595376](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6595376531d366900d0bb23ace465f359b22997d))





# [0.9.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.8.0...@oney/authentication-core@0.9.0) (2021-04-07)


### Bug Fixes

* **auhtentication:** pr comment - remove saving failed card provisioning to db + remove event ([be003d2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/be003d2504599c0c3de76f680105a27faf1250b4))
* **auth:** pr comment - abstract auth response in core ([51a46b5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/51a46b5c8d187515c18181d8179933cb140aaf3a))
* **auth:** pr comment - abstract cookies in verifier generator ([209fe9e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/209fe9ebc64c7df5aa83925695bf840fe9712142))
* **auth:** pr comment - abstract verify request config in core ([76284ef](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/76284ef896985ca64d0eaeb59a17201dd52b51a7))
* **auth:** pr comment - create hashed card pan by passing plaintext ([defb801](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/defb801c2f1da6c584134bcf3602c262813faf9b))
* **auth:** pr comment - don't use null user ([7ea950d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7ea950dfa8e274855ed4c3536a19e69cd5785284))
* **auth:** pr comment - pass device id in trusted device reset event ([2ed0864](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2ed08640cd2d05e65a830604b4333dd9c440bbe0))
* **auth:** pr comment - remove abstraction from core ([c705cea](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c705cea49d13f0e66871b4814e192b8b059f75d9))
* **auth:** pr comment - remove null objects and uniform email value object ([1745e19](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1745e19cee7dba242be1780d320d7088e0d5340d))
* **auth:** pr comment - remove null user ([086f807](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/086f807323380def17b55b519fd922715a6e1c37))
* **auth:** pr comment - remove some icg details in core ([b692f90](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b692f90d0d61e6d7f081f9c63e9765648ccbaafa))
* **auth:** pr comment - remove state in auth init result mapper ([149a707](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/149a7077511a92aeec16f1b370bff6397842d168))
* **auth:** pr comment - remove state in register create and simplify code ([7779513](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/777951392153287b423e141a04b4322aeccdbffd))
* **auth:** pr comment - robustify user request from repos ([b966253](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b9662539b1f50ae22b5eaff3a29d13ab0edb534d))
* **auth:** pr comment - safeguard for completed invitation before user creation ([d6cde5b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d6cde5bf21c13280157d7cc08d0f1d7769e610ce))
* **auth:** pr comment - separate interface gateways for phone and card provisioning ([65d1d2b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/65d1d2bf2d236d9396a5467831f31ea27ab36d0a))
* **auth:** pr comment = remove implementation detail from core ([4a4c3cc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/4a4c3cc1bd23c395361cbad4de06d8bf575cbeb7))
* **authentication:** fix pr comments ([94b1236](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/94b12365277967157e6d026d506ec5667604c793))
* **authentication:** fix pr comments ([e571dff](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e571dffad8a244880b63c373718eae26db38a6e2))
* **authentication:** fix pr comments ([a3f97ed](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a3f97ed8e8af47bd8d6e2c238a62c9b5a130ca9f))
* **authentication:** fix pr valudation pipeline error with hashed card pan not found ([99d99d6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/99d99d6ea8c119f5e10abf4518d9667e06dae45c))
* **authentication:** handle booloean phone property casted to string for legacy users ([b157274](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/b1572749138ef1f734ed1b54e581bb146e68a2f0))
* **authentication:** make sure to not override user metadata ([5524525](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/5524525cf36ab7763ae59f8ab83040c37c395453))
* **authentication:** pr commemt - make the user ID the only required property for construction ([52905ff](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/52905ff9d190fc5b744390394578e03e82451c72))
* **authentication:** pr comment - add device trusted and trusted device reset domain event ([0d846d4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0d846d4fc99cee38263b0c64f5fcf6b33493b2a4))
* **authentication:** pr comment - add Email value object to user aggregate root ([bd5b03e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/bd5b03ebf02d6f2acde11f35b701b990a231e22a))
* **authentication:** pr comment - add pan validation in hashed card pan ([2df630d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2df630d0ab7f4aa6b6fa14dc92901d35f5f97018))
* **authentication:** pr comment - add user sign in domain event ([a7a660f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/a7a660fedd71bfeb0a9e167a8fca4b9c824a8bc2))
* **authentication:** pr comment - create gateways to hide provisionings implementation details ([d2a2743](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d2a27436fa00806ccb210a99950d38eb20b7f80a))
* **authentication:** pr comment - hide implementation details in card provisioning ([687c53d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/687c53dbaf9881c012efe34d08e4e5754304d0d2))
* **authentication:** pr comment - remove phone set true event to put logic i phone provisioned event ([61a962d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/61a962da59f1fcbf6efe2b47933c4b2a06c4a8ba))
* **authentication:** pr comment - rename card provision aggregate method and associated event ([96d580e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/96d580e7b5d130d67bbdd67dcb92a3d660634e8f))
* **authentication:** pr comment - rename create user usecase to sign up user ([31a3fb6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/31a3fb6ea118c8f44534b768b2cee4168a772430))
* **authentication:** pr comment - rename phone provisioning aggregate method and associated event ([2b0a39e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2b0a39e5ad793dd5a7826a6b36a9ffb811f81737))
* **authentication:** pr comment - renaming ([c8aa2f1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c8aa2f11791a64a0da18a4732ad63b8111146f74))
* **authentication:** pr comment - return aggregate instead of new instance in set and clear pin code ([ef62b92](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ef62b921b497e4c80c2d5941e815441894ce20cc))
* **authentication:** pr comment - signed up event and aggregate root metadata auto mngt ([d5c321a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d5c321adb9f65215aef82025a39181b6b408c817))
* **authentication:** pr comments - remove state ([cc3c3c8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cc3c3c84ce95a2155f619468377e2180666e4606))
* **authentication:** robustify default error strategy operator ([1b26326](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1b263263607222b2fa266023ac7cc1208e60862d))
* **authentication:** save and dispatch aggregate root in the correct order ([04e96a9](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/04e96a9f7f89b0fbaecbe1cdbdb61ca6ed85e2ea))
* **authentication:** send card provisioning fail event for error notification ([ea7055e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/ea7055e0d74703353b0ea50fdfcafe393170dada))


### Features

* **auth:** validate email at register create usecase level ([77a90e6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/77a90e6372b70d2c1e9e697349547c32937b1917))
* **authentication:** add acs provisioning api endpoint ([6e2b12e](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6e2b12ea83c192ed0af4207d8f5695a826ff2a60))
* **authentication:** add card provisioning main events ([9005473](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/900547346683e7d8c39fcd74eff57dc78538990d))
* **authentication:** add error notification on on user not found on phone provisioning ([7cbd744](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7cbd744741545b457e595026cfe2a6e66aabfa6e))
* **authentication:** add error notification on phone provisioning failure ([cf54f2a](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cf54f2a255be9687bc61ad7523b538890b658a25))
* **authentication:** add find latest blocked verifier to get unblocking date ([9e9034f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/9e9034fde1c666860ece139d730ba75503898f1b))
* **authentication:** add phone provisioning events ([cde71d0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cde71d04bd9e8301c3dc42469422d8da36c2d5e1))
* **authentication:** add user created domain event ([d37a739](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/d37a739e5c2264d4f8b7c746965f0a0a85e071e3))
* **authentication:** migrate user card acs provisioning to lib env events and handlers ([40ee676](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/40ee67636f3c7118d527077e63988eff5dc5bde0))
* **authentication:** transform phone field into a string to store number ([63c54f6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/63c54f6d839faad6a87c19c5c9d015acb8028a37))


### BREAKING CHANGES

* **authentication:** user.phone is now a string type instead of a boolean
* **authentication:** invalid pans are no longer tolerated
* **authentication:** the user aggregate root now has an email property that is now a value object
instead a string

on-3543





# [0.8.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.7.3...@oney/authentication-core@0.8.0) (2021-04-02)


### Features

* **authentication-profile:** add ability to check register/create with phone ([1ff638b](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1ff638bd1fc861d5c2f8c63a6da4c67e134fc4d4))





## [0.7.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.7.2...@oney/authentication-core@0.7.3) (2021-03-30)

**Note:** Version bump only for package @oney/authentication-core





## [0.7.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.7.1...@oney/authentication-core@0.7.2) (2021-02-25)


### Bug Fixes

* **authentication:** always set phone to true in provision phone use case ([6595aa2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/6595aa2b729c17774045c5ac1782ef102c0d0a06))
* **authentication:** fix the provisioning when icg disabled ([98cd703](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/98cd703da72f7c2096adbb2771d3683b87ef113d))
* **authentication:** return provisioning response code even when icg disabled ([08e742d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/08e742dcbfaa767a28687f5f7c079c7b99eba49d))





## [0.7.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.7.0...@oney/authentication-core@0.7.1) (2021-02-17)

**Note:** Version bump only for package @oney/authentication-core





# [0.7.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.6.0...@oney/authentication-core@0.7.0) (2021-02-16)


### Bug Fixes

* **authentication:** pass the correct type of argument when calling process provisioning ([adc37cc](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/adc37ccf7d65a99c80151917f37249201611d6fd))


### Features

* **authentication:** add health check for partner authentication service ([96b4470](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/96b447069b2d88be43dd51ea05fbf4e8821c4e3c))


### BREAKING CHANGES

* **authentication:** renames ping_icg into ping-refauth-icg

on-2250





# [0.6.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.5.0...@oney/authentication-core@0.6.0) (2021-02-11)


### Features

* **authentication:** add phone provisioning check before acs provisioning ([553d41c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/553d41c45f4dc0c9d7d5a553f4cb4adaaa319180))
* **authentication:** handle existing provisioning field with failed steps and when no provisioning field ([67adaeb](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/67adaeba52044ce28f6cefde3b1f75151a45789c))
* **authentication:** handle setting provisioning field with step and date on error response ([24e7d31](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/24e7d314738d83190438029a6d1078044dcb2462))
* **authentication:** implement async phone provisioing when icg disabled ([2247127](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/2247127429d34b2d28f4031fe793677240ceb409))
* **authentication:** integrate identity lib on authentication ([3a6b3fd](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3a6b3fdb6ead8c9d68b4627cf42a1fd009e05b85))
* **authentication:** save user phone when phone validated message received ([7a3a964](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/7a3a9647d06be3b097396e8b9a440de52eac2d10))
* **on-3121:** add provisioning field to user after successful phone provisioning ([8c1d63f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/8c1d63f00ba4cbb36ea3d1ea27bc3ba92af290ef))
* **on-3121:** add provisioning field to user after successful phone provisioning ([0ce71b8](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/0ce71b83b4ff828210314b91a1832b6defe257f5))
* **on-3121:** update authentication user and schema with provisioning field ([16339b6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/16339b6119bbb4dddef14047925d932eed58fea8))





# [0.5.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.4.3...@oney/authentication-core@0.5.0) (2021-02-06)


### Features

* **docs:** add living documentation ([aae039d](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/aae039d3d6feb08515853023e058ce7fd59a6c11))





## [0.4.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.4.2...@oney/authentication-core@0.4.3) (2021-02-05)

**Note:** Version bump only for package @oney/authentication-core





## [0.4.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.4.1...@oney/authentication-core@0.4.2) (2021-02-03)

**Note:** Version bump only for package @oney/authentication-core





## [0.4.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.4.0...@oney/authentication-core@0.4.1) (2021-02-02)

**Note:** Version bump only for package @oney/authentication-core





# [0.4.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.3.0...@oney/authentication-core@0.4.0) (2021-01-27)


### Features

* create a route which returns all the public key allowed wy BQ_DIGIT ([279e6df](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/279e6dfa2fb1874dfc3c23f1690ec972360be853))





# [0.3.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.2.0...@oney/authentication-core@0.3.0) (2021-01-17)


### Features

* **on-3117:** add logs for easier provisioning debugging ([cb3a341](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/cb3a341326f34f530b8cca6b60d49407320c185f))
* **on-3117:** be more explicit about phone provisioning response code meaning in use case ([e57799f](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/e57799f450233cde0ed22dd82f109a9a6a8a7bb6))
* **on-3117:** fix pr comment ([34e84c0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/34e84c03205b62a130402628ad53018abe2258aa))
* **on-3117:** replace console logs with oney logger ([12f7199](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/12f71992a63e1822e11026f46577b90aabdf3073))





# [0.2.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.1.7...@oney/authentication-core@0.2.0) (2021-01-14)


### Bug Fixes

* **fix rbac and otplenght:** fix rbac and otplenght ([1dc5506](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/1dc55063fdfe94f3916a0073a9691f4908e9691e))


### Features

* **adding metadata and generate:** adding metadata and generate automatically email ([dd4a7c2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/dd4a7c27d1f68d7316a896712ea5d029f939eabd))





## [0.1.7](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.1.6...@oney/authentication-core@0.1.7) (2021-01-05)

**Note:** Version bump only for package @oney/authentication-core





## [0.1.6](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.1.5...@oney/authentication-core@0.1.6) (2020-12-30)

**Note:** Version bump only for package @oney/authentication-core





## [0.1.5](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.1.4...@oney/authentication-core@0.1.5) (2020-12-24)


### Bug Fixes

* **fixing provisionning:** fixing provisionning ([3710c6c](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3710c6cb80f8d5bcd74872a1da834487b3aa1bc7))





## [0.1.4](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.1.3...@oney/authentication-core@0.1.4) (2020-12-24)

**Note:** Version bump only for package @oney/authentication-core





## [0.1.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.1.2...@oney/authentication-core@0.1.3) (2020-12-23)


### Bug Fixes

* **adding logs:** adding logs ([c59d6b3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c59d6b3cab2838e5ddfd3bbc0b1462742cc448b0))
* **adding logs on icg healthcheck:** adding logs on icg healthcheck ([22f1113](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/22f11137bc66a44d4e03f44d7c946b0fad66ecbc))
* **fix ping_icg:** fix ping_icg usecase ([28609ed](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/28609ede82ba33759135017480f5351525f6bd2b))





## [0.1.2](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.1.1...@oney/authentication-core@0.1.2) (2020-12-23)


### Bug Fixes

* **fix env:** fix env on authentication service ([3261c15](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/3261c1586e7fa4bb3072f3cc0985f2452f533669))





## [0.1.1](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.1.0...@oney/authentication-core@0.1.1) (2020-12-21)


### Bug Fixes

* **migrate acs provisionning to auth adapters:** migrate acs provisionning to auth adapters ([90ebd72](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/90ebd720a1f4f50e061c5d31fab7b5906ff7f422))





# [0.1.0](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.0.3...@oney/authentication-core@0.1.0) (2020-12-17)


### Bug Fixes

* **fix rbac for partner routes:** fix rbac for partner routes ([67c4931](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/67c49315a2975544d6b9f09721f786a0e1473c86))


### Features

* **adding rbac in monorepo, and a lot of enhancements:** adding RBAC in monorepo ([c250621](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/commits/c2506216b9c1bc251971944ee2606e61dea7c3de))





## [0.0.3](https://dev.azure.com/OneyPay/OneyPay-API/_git/oney/compare/@oney/authentication-core@0.0.2...@oney/authentication-core@0.0.3) (2020-12-09)

**Note:** Version bump only for package @oney/authentication-core





## 0.0.2 (2020-12-09)

**Note:** Version bump only for package @oney/authentication-core
