import path from 'path';
import fs from 'fs';
import { pp } from '../utils';

export class PathManager {
    static USER_HOME = process.env.USERPROFILE || process.env.HOME || '';
    static GENERAL_CONFIGS_DIR_PATH = path.join(this.USER_HOME, '.config');
    static MIG_DIR_PATH = path.join(this.GENERAL_CONFIGS_DIR_PATH, 'mig');
    static ENVS_DIR_PATH = path.join(this.MIG_DIR_PATH, 'envs');
    static CONTEXT_FILE_PATH = path.join(this.MIG_DIR_PATH, 'context.json');

    static setupPaths(): void {
        if (!fs.existsSync(PathManager.GENERAL_CONFIGS_DIR_PATH)) fs.mkdirSync(PathManager.GENERAL_CONFIGS_DIR_PATH);
        if (!fs.existsSync(PathManager.MIG_DIR_PATH)) fs.mkdirSync(PathManager.MIG_DIR_PATH);
        if (!fs.existsSync(PathManager.ENVS_DIR_PATH)) fs.mkdirSync(PathManager.ENVS_DIR_PATH);
        if (!fs.existsSync(PathManager.CONTEXT_FILE_PATH))
            fs.writeFileSync(PathManager.CONTEXT_FILE_PATH, JSON.stringify({ envName: 'default' }, null, 4));

        pp.debug(`Setup mig at ${PathManager.MIG_DIR_PATH}`);
    }
}
