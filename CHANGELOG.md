# Changelog

## 1.0.0 (2023-12-03)


### ⚠ BREAKING CHANGES

* **env.ts:** Changing to using process.env instead of envs (envalid). Need to fix later.
* **printing request:** change from node-thermal-printer to node-printer

### Features

* **auth:** implement API for logout ([1143d44](https://github.com/TickLabVN/ssps-be/commit/1143d44b59c4bf58b2485fd20b0094029d845fa1))
* **auth:** implement authorization with admin and student ([565a308](https://github.com/TickLabVN/ssps-be/commit/565a30819109650995fb3146179bcd7596409303))
* **cd:** implement CD for cloned containers to ensure the success of development deployments ([c0d9f07](https://github.com/TickLabVN/ssps-be/commit/c0d9f07f9a40ff0abbe244361053822b791cda12))
* **configuration:** create new table for saving configurations ([8ca0d88](https://github.com/TickLabVN/ssps-be/commit/8ca0d88080fe12dd1130fb34e8ec3477bd617d31))
* **configuration:** implement API for getting all configurations and updating accepted extensions ([ac726ec](https://github.com/TickLabVN/ssps-be/commit/ac726ec7f5c4e98489f5eeedf004fbe9fb10562e))
* **configuration:** move dollar to coin config to db ([6416e91](https://github.com/TickLabVN/ssps-be/commit/6416e91fe257a82c27e926c645c2ba6d5b2e1dc7))
* **dev-dependency:** add commitlint and commitizen for conventional commit ([413d4f1](https://github.com/TickLabVN/ssps-be/commit/413d4f10ee2efdc09c7f44242108e0d6f0f901ac))
* **docker-compose:** modify docker-compose to using .env file and using ssps external network ([2040e31](https://github.com/TickLabVN/ssps-be/commit/2040e315fdf6ba2680d82c57eae64094c65c0ee0))
* **edit pdf file:** uncomple edit pdf file for config printing file ([e37593f](https://github.com/TickLabVN/ssps-be/commit/e37593f6d7ae4c948ce50897a64aa84c86d6e8f8))
* **edit pdf:** change select page custom from array to comma-separated string ([46a03ff](https://github.com/TickLabVN/ssps-be/commit/46a03fffc1a497882cded2c82b21b1e95270507f))
* **edit pdf:** implement a comprehensive function wrapping the entire setting functionality ([516be6a](https://github.com/TickLabVN/ssps-be/commit/516be6a389b2ee36d2470c46a67f5cb3bbb4b03d))
* **edit pdf:** implement landscape with page per sheet parameter ([0c01474](https://github.com/TickLabVN/ssps-be/commit/0c01474ed9105f4113c286d81e1205c2eef1050f))
* **edit pdf:** implement portrait with page per sheet parameter ([7d7ca4b](https://github.com/TickLabVN/ssps-be/commit/7d7ca4bf4791f38552b5c3d093c4e5a10b615732))
* **edit pdf:** implement setting for two-sided short or long edge ([f4ea167](https://github.com/TickLabVN/ssps-be/commit/f4ea167255f172926cdcd69a10d15882352d15ec))
* **google oauth:** implement handler logic for google oauth callback ([3e1c192](https://github.com/TickLabVN/ssps-be/commit/3e1c192db52ba2f971043a5286fef56208224159))
* **home page:** implement an api to send slide image urls of home page ([a37c900](https://github.com/TickLabVN/ssps-be/commit/a37c900218c4b378f5b1bbc5fa443bfc7b988c26))
* **printing request:** change to use node-printer, implement logic print whole printing request ([07fbc16](https://github.com/TickLabVN/ssps-be/commit/07fbc16551c09e44db93ace500f7598c2cc4d25a))
* **printing request:** create new table of file, add roll back mechanism for add new file ([6ee011e](https://github.com/TickLabVN/ssps-be/commit/6ee011ef5d8710e61aa4d24611233c4a74eb1c86))
* **printing request:** implement an api for get all printing request of an user ([192a999](https://github.com/TickLabVN/ssps-be/commit/192a9995f84b757f5508cdfc15e6b33ad35bf6a5))
* **printing request:** implement API for canceling printing requests ([8e92aff](https://github.com/TickLabVN/ssps-be/commit/8e92aff3be2f6b5f5af1109a97c75ef7f4c82793))
* **printing request:** implement API for changing the print quantity of files ([acc795d](https://github.com/TickLabVN/ssps-be/commit/acc795d46c247632a5863060ef835fdd3eb96572))
* **printing request:** implement api for create printing request ([1515e35](https://github.com/TickLabVN/ssps-be/commit/1515e35ac6facc7a1a36e5deb9fb7ea7d7daeb59))
* **printing request:** implment get all and remove specific file apis for printing request ([9657185](https://github.com/TickLabVN/ssps-be/commit/9657185b83d5a35d0b575874e3d5c3070de349e2))
* **printing request:** upload numPages and numFiles in file uploads ([fdad29d](https://github.com/TickLabVN/ssps-be/commit/fdad29d02f78a9f6c898e75700ce31c3cbaa447a))
* **printing-config:** implement API for adjusting copies of a single file ([4d5a5f6](https://github.com/TickLabVN/ssps-be/commit/4d5a5f69ac4d4cd06339c69835d4d1451ae9d785))
* **printing:** complete handler for configuring print file and sending it to printer ([953d97a](https://github.com/TickLabVN/ssps-be/commit/953d97a21ec09b96de3d1f0a3f7ba4aa2f848fb3))
* **printingrequest:** split upload file and config api to two seperate apis ([4e19fba](https://github.com/TickLabVN/ssps-be/commit/4e19fba07456e5c19565eb38098c185cbff27f11))
* **priting request:** implement api for upload file to priting request ([7a9cf05](https://github.com/TickLabVN/ssps-be/commit/7a9cf05151b40c0896f921097db132b049eb25a6))
* **purchase coin:** implement PayPal Coin Purchase APIs ([6999d15](https://github.com/TickLabVN/ssps-be/commit/6999d1597b024c8294ca9a16bc461962507a39e6))
* **upload file:** create schema body for upload file api to it can work in swagger ([1a33700](https://github.com/TickLabVN/ssps-be/commit/1a33700848b1bcc493df88676e936ad1a1082d38))
* **user:** implement api for get current remain coins of user ([5fb7e7f](https://github.com/TickLabVN/ssps-be/commit/5fb7e7fb4ff74d1b5753715c9e110e0f62992644))
* **workflows:** split cd for deploy of development and product ([8fd3c62](https://github.com/TickLabVN/ssps-be/commit/8fd3c62474e739e5fb8b463b852961146e401a0a))


### Bug Fixes

* **cd:** adjust name of docker compose file in dev-deploy ([e8868bf](https://github.com/TickLabVN/ssps-be/commit/e8868bfa9b9c8273a8fa4d9aa8f928ad39205a82))
* **cd:** separate ports and docker-compose file for test deployment service and developer service ([46e5410](https://github.com/TickLabVN/ssps-be/commit/46e5410e690b12757906edc6ea7eb554175f67c2))
* **cd:** update developer CD for new Docker Compose settings ([3882c49](https://github.com/TickLabVN/ssps-be/commit/3882c499d87f871e44aafcb1c90eda92b2549477))
* **configuration:** convert DB configuration getter to arrow function ([94f5cfa](https://github.com/TickLabVN/ssps-be/commit/94f5cfa09c3cdaedac36bd68a5941a9b778809fa))
* **configuration:** put retrieve configuration in db from configs folder to handlers ([94c78ba](https://github.com/TickLabVN/ssps-be/commit/94c78ba099b14516ee311ab7fbe3da952b9b897c))
* **configuration:** save value of DOLLAR_TO_COIN in code instead of database ([366a64f](https://github.com/TickLabVN/ssps-be/commit/366a64f24c02b025a123aa7a22c2e47e79aaf240))
* **cors:** cors is true for any incoming request on developer server ([0dfda11](https://github.com/TickLabVN/ssps-be/commit/0dfda11ac90006c6f45fb1a792497c4ae8340575))
* **deployment:** change CMD in docker container and fix random port when starting server ([7a4fde6](https://github.com/TickLabVN/ssps-be/commit/7a4fde664b55800421be7b95043acf6a86828072))
* **dockerfile:** add python3 and cup-devs to package of step 2 ([5d3e42b](https://github.com/TickLabVN/ssps-be/commit/5d3e42b0cb49e21804d72e3582a1ecfff55fbe1a))
* **docker:** install neccesary packets for node-printer at development stage of Dockerfile ([123ae77](https://github.com/TickLabVN/ssps-be/commit/123ae776d3b98b6662045c0ef7734896cf119668))
* **env.ts:** accessing env variable via 'process.env' and implementing Google Oauth ([1983de2](https://github.com/TickLabVN/ssps-be/commit/1983de20b46866e0b1c2b7298f2648b1b808f5cb))
* **env.ts:** resolve circular dependencies among configs, constants, utils, and repository modules ([e698ae9](https://github.com/TickLabVN/ssps-be/commit/e698ae9a9bb41199d78c4bd201d4bfae0c563ef6))
* **google oauth:** add response in gg redirect schema; fix catch handler ([fc534b5](https://github.com/TickLabVN/ssps-be/commit/fc534b593ffd9307f542622b9b9f37d36bdcef19))
* **printing config:** remove duplicate increase of coins and pages in printing request ([7ff7a0a](https://github.com/TickLabVN/ssps-be/commit/7ff7a0a84b8ff6f17b6c20063b8800118fefac6d))
* **printing config:** update coins of printing request base on number of copies in upload config API ([e6ed59c](https://github.com/TickLabVN/ssps-be/commit/e6ed59c180c4658438b3425bdc7fae6edf00fccf))
* **printing config:** update numOfCopies increase numCoins; increase max file upload in the system ([88b2472](https://github.com/TickLabVN/ssps-be/commit/88b2472413c40a27011104b8357f6a0d87d7b851))
* **printing file:** retrieve all files of printing requests ordered by creation time ([420d9eb](https://github.com/TickLabVN/ssps-be/commit/420d9eb55bf645cc2e3e96ec00f64cc010f2402d))
* **release.yml:** ensure image name don't have capitalize ([420637a](https://github.com/TickLabVN/ssps-be/commit/420637afd4533be83c178dd91cdad744d12e68ae))
* **release.yml:** remove needs of release job for buld and deploy jobs ([e74f22f](https://github.com/TickLabVN/ssps-be/commit/e74f22f4c7bbec5860e730180f7447d74cde8d58))
* **role:** create corresponding student when user has the 'student' role ([1b347df](https://github.com/TickLabVN/ssps-be/commit/1b347df27c8224b41e0cc2715e2f3a39bd03e9f2))
* **server.ts:** add credentials equal true to config of fastify/cors ([3d06865](https://github.com/TickLabVN/ssps-be/commit/3d06865a1d3d1bb7779ff955617e4c77cbb950fd))
* **upload file:** increase limits of fastify multipart ([4fab935](https://github.com/TickLabVN/ssps-be/commit/4fab935098930c86e74129523f8b422627f8a4f5))
* **user.handler.ts:** change return of api/user to {id, email} ([b7fb5a3](https://github.com/TickLabVN/ssps-be/commit/b7fb5a3e628fba935d62e64248353c987acaee71))

## [1.6.0](https://github.com/phucvinh57/fastify-template/compare/v1.5.0...v1.6.0) (2023-08-22)


### Features

* **dtos:** migrate from `fluent-json-schema` to `@sinclair/typebox` ([ab84294](https://github.com/phucvinh57/fastify-template/commit/ab84294906cb022d185164e91f07e872ff881029))
* **error handler:** catch more cases ([c746a39](https://github.com/phucvinh57/fastify-template/commit/c746a398788665c0be701a7daa81c9f3c595d85e))

## [1.5.0](https://github.com/phucvinh57/fastify-template/compare/v1.4.0...v1.5.0) (2023-08-07)


### Features

* update template structures & code quality ([114ed2e](https://github.com/phucvinh57/fastify-template/commit/114ed2ec65f5006ead6758e56d0b869211d943ee))

## [1.4.0](https://github.com/phucvinh57/fastify-template/compare/v1.3.0...v1.4.0) (2023-06-07)


### Features

* **envs:** add validations using `envalid` ([4cfff3e](https://github.com/phucvinh57/fastify-template/commit/4cfff3eeb0b5e77a8d0c8ec460a3164e1a56c158))

## [1.3.0](https://github.com/phucvinh57/fastify-template/compare/v1.2.4...v1.3.0) (2023-05-23)


### Features

* **request:** write custom type for authenticated request ([9340448](https://github.com/phucvinh57/fastify-template/commit/93404484bc99fd679eec7089ce4c2cf74f946e02))


### Bug Fixes

* **routes:** disable exposing HEAD route for each GET method ([5825529](https://github.com/phucvinh57/fastify-template/commit/5825529ee30acfeb18504ea32a128098480b31b8))

## [1.2.4](https://github.com/phucvinh57/fastify-template/compare/v1.2.3...v1.2.4) (2023-05-20)


### Bug Fixes

* **release.yml:** good fix ([ca14e0f](https://github.com/phucvinh57/fastify-template/commit/ca14e0f2a8489f5c6ff70d9518862a193714da9c))

## [1.2.3](https://github.com/phucvinh57/fastify-template/compare/v1.2.2...v1.2.3) (2023-05-20)


### Bug Fixes

* **release.yml:** fuking shit ([6e70795](https://github.com/phucvinh57/fastify-template/commit/6e70795d971c66467b435441045bcb209ca312b0))

## [1.2.2](https://github.com/phucvinh57/fastify-template/compare/v1.2.1...v1.2.2) (2023-05-20)


### Bug Fixes

* **ci:** remove print release step outputs ([a1c7bb4](https://github.com/phucvinh57/fastify-template/commit/a1c7bb40424df6e5265d13f1fc5dbd7d4929fdc7))

## [1.2.1](https://github.com/phucvinh57/fastify-template/compare/v1.2.0...v1.2.1) (2023-05-20)


### Bug Fixes

* github actions cannot read `release` job's outputs ([7264e4f](https://github.com/phucvinh57/fastify-template/commit/7264e4f2b6108da4d29c257db3462ebb47d994f9))

## [1.2.0](https://github.com/phucvinh57/fastify-template/compare/v1.1.0...v1.2.0) (2023-05-20)


### Features

* **ci:** adapt new ci workflows ([89ec5dc](https://github.com/phucvinh57/fastify-template/commit/89ec5dc4ae68bf9575cff6cb62d929e499a4056d))

## [1.1.0](https://github.com/phucvinh57/fastify-template/compare/v1.0.1...v1.1.0) (2023-05-20)


### Features

* add bot's PR header ([062e6ec](https://github.com/phucvinh57/fastify-template/commit/062e6ec4894483b7557e0bfc32fe9bf10e3272c3))

## [1.0.1](https://github.com/phucvinh57/fastify-template/compare/v1.0.0...v1.0.1) (2023-05-20)


### Bug Fixes

* **dependabot.yml:** disable version updates for npm dependencies ([a003e1a](https://github.com/phucvinh57/fastify-template/commit/a003e1a6db73adfc606eda32a1cb67b63eaab817))

## 1.0.0 (2023-05-20)


### Features

* manage tags and versions ([fd15413](https://github.com/phucvinh57/fastify-template/commit/fd154137c167922ca3dc9e00ae4c2f745a782379))


### Bug Fixes

* **dependabot.yml:** wrong configuration ([5707c12](https://github.com/phucvinh57/fastify-template/commit/5707c120c9dffae829732b9b8f52cd4ae222320f))
* **dependabot:** change target branch ([54e4384](https://github.com/phucvinh57/fastify-template/commit/54e43843700446aaaf0ccd6c3607b0d2ec9eb85f))
* **dependabot:** set target branch direct to master ([f3a0ab9](https://github.com/phucvinh57/fastify-template/commit/f3a0ab9d4885882a6df0891dfce4d9d2d1b502aa))
* **swagger:** update to openapi 3 ([c3197f9](https://github.com/phucvinh57/fastify-template/commit/c3197f9e4c82b945838603154e312778c5443e8d))
