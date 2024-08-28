import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { CommonOptions } from '../types';

export class PathManager {
    static USER_HOME = process.env.USERPROFILE || process.env.HOME || '';
    static MIG_DIR_PATH = path.join(this.USER_HOME, '.omg-mig');
    static ENVS_DIR_PATH = path.join(this.MIG_DIR_PATH, 'envs');
    static CONTEXT_FILE_PATH = path.join(this.MIG_DIR_PATH, 'context.json');

    static setupPaths(options: CommonOptions = {}): void {
        if (!fs.existsSync(PathManager.MIG_DIR_PATH)) fs.mkdirSync(PathManager.MIG_DIR_PATH);
        if (!fs.existsSync(PathManager.ENVS_DIR_PATH)) fs.mkdirSync(PathManager.ENVS_DIR_PATH);
        if (!fs.existsSync(PathManager.CONTEXT_FILE_PATH))
            fs.writeFileSync(PathManager.CONTEXT_FILE_PATH, JSON.stringify({ envName: 'default' }, null, 4));

        if (options.verbose) console.log(chalk.green(`Setup mig at ${PathManager.MIG_DIR_PATH}`));
    }
}
