import { EnvManager, PathManager } from '../../components';
import { AddEnvOptions } from '../../types';
import { getFileName, pp } from '../../utils';
import chalk from 'chalk';
import { copyFileSync, existsSync } from 'fs';
import path from 'path';
import { setEnv } from './set-current-env.command';

export const addEnv = (
    pathToEnv: string,
    name?: string,
    options: AddEnvOptions = { setCurrent: false, overwrite: false }
): void => {
    // first we must ensure they exist
    const fullPath = path.resolve(process.cwd(), pathToEnv);

    const exists = existsSync(fullPath);

    if (!exists) {
        pp.error(`Env file not found at ${fullPath}`);
        return;
    }

    const fileName = getFileName(name || path.basename(fullPath), true);

    if (!fileName) {
        pp.error(`Invalid name provided: ${name}`);
        return;
    }

    // prevent duplicate names
    const existingFiles = EnvManager.listAll();

    if (existingFiles.includes(fileName) && options.overwrite !== true) {
        pp.error(`Env file with name ${chalk.redBright(fileName)} already exists`);
        return;
    }

    // new file path is at the envs directory
    const newFilePath = path.join(PathManager.ENVS_DIR_PATH, `${fileName}.env`);

    copyFileSync(fullPath, newFilePath);

    pp.info(`${fileName} added`);

    if (options.setCurrent === true) {
        setEnv(fileName);
    }
};
