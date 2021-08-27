import * as packageJson from '../package.json';
import { getEnv } from './getEnv';

module.exports = async function (context) {
    const { version = null, name = null } = packageJson;
    const { BUILD_ID = null , VERSION_DATETIME = null } = getEnv();
    context.res = {
        status: 200,
        body: { version, name, build: BUILD_ID, deployedTime: VERSION_DATETIME }
    };
}
