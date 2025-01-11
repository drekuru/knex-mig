import path from 'path';
import fs from 'fs';
import { pp } from '../utils';

export class PathManager {
    private static _USER_HOME = process.env.USERPROFILE || process.env.HOME || '';
    private static _GENERAL_CONFIGS_DIR_PATH = path.join(this._USER_HOME, '.config');
    private static _MIG_DIR_PATH = path.join(this._GENERAL_CONFIGS_DIR_PATH, 'knex-mig');
    private static _ENVS_DIR_PATH = path.join(this._MIG_DIR_PATH, 'envs');
    private static _CONTEXT_FILE_PATH = path.join(this._MIG_DIR_PATH, 'context.json');

    static setupPaths(): void {
        if (!fs.existsSync(PathManager._GENERAL_CONFIGS_DIR_PATH)) fs.mkdirSync(PathManager._GENERAL_CONFIGS_DIR_PATH);
        if (!fs.existsSync(PathManager._MIG_DIR_PATH)) fs.mkdirSync(PathManager._MIG_DIR_PATH);
        if (!fs.existsSync(PathManager._ENVS_DIR_PATH)) fs.mkdirSync(PathManager._ENVS_DIR_PATH);
        if (!fs.existsSync(PathManager._CONTEXT_FILE_PATH))
            fs.writeFileSync(PathManager._CONTEXT_FILE_PATH, JSON.stringify({ envName: 'default' }, null, 4));

        pp.debug(`Setup knex-mig at ${PathManager._MIG_DIR_PATH}`);
    }

    private static safeGetPath(pathToCheck: string): string {
        if (!fs.existsSync(pathToCheck)) {
            pp.error(`Path ${pathToCheck} does not exist`);
            pp.warn('Please run `mg setup`');
            process.exit(1);
        }

        return pathToCheck;
    }

    static get USER_HOME(): string {
        return this.safeGetPath(this._USER_HOME);
    }

    static get GENERAL_CONFIGS_DIR_PATH(): string {
        return this.safeGetPath(this._GENERAL_CONFIGS_DIR_PATH);
    }

    static get MIG_DIR_PATH(): string {
        return this.safeGetPath(this._MIG_DIR_PATH);
    }

    static get ENVS_DIR_PATH(): string {
        return this.safeGetPath(this._ENVS_DIR_PATH);
    }

    static get CONTEXT_FILE_PATH(): string {
        return this.safeGetPath(this._CONTEXT_FILE_PATH);
    }
}
