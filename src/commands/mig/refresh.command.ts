import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export class PathManager {
    private static USER_HOME = process.env.HOME || process.env.USERPROFILE || '.';
    private static CONFIG_DIR = path.join(PathManager.USER_HOME, '.config');
    private static MIG_DIR = path.join(PathManager.CONFIG_DIR, '.mig');
    private static ENV_S = path.join(PathManager.MIG_DIR, 'envs');
    private static CONTEXT_FILE = path.join(PathManager.MIG_DIR, 'context.json');
}
