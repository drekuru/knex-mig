import chalk from 'chalk';
import { ContextManager } from './context.manager';
import path from 'path';
import fs from 'fs';
import { PathManager } from './path.manager';
import dotenv from 'dotenv';
import { getFileName, pp } from '../utils';

export class EnvManager {
    private static env: Record<string, string>;

    static get(): Record<string, string> {
        if (!this.env) {
            this.env = this.load();
            Object.assign(process.env, this.env);
        }

        return this.env;
    }

    static listAll(): string[] {
        return fs.readdirSync(PathManager.ENVS_DIR_PATH).map((file) => getFileName(file, true));
    }

    private static load(): Record<string, string> {
        const { envName } = ContextManager.ctx;

        const envPath = this.validateENVPath(envName);

        pp.log(chalk.bold(chalk.magenta(`CURRENT ENV: ${chalk.magentaBright(envName)}`)));

        const data = dotenv.parse(fs.readFileSync(envPath));

        // resolve paths for migrations and seeds
        if (data.MIGRATIONS_DIR) data.MIGRATIONS_DIR = path.resolve(data.MIGRATIONS_DIR);
        if (data.SEEDS_DIR) data.SEEDS_DIR = path.resolve(data.SEEDS_DIR);

        return data;
    }

    /**
     * @description - allows for a safe read of whatever env file we're attempting to use
     */
    static validateENVPath(envName: string | null): string {
        if (!envName) {
            pp.error('Env name not provided. Maybe try `mg env set <envName>`');
            process.exit(1);
        }

        if (!envName.endsWith('.env')) envName = `${envName}.env`;

        const envFilePath = path.join(PathManager.ENVS_DIR_PATH, envName);

        if (!fs.existsSync(envFilePath)) {
            pp.error(`Env ${envName} not found at ${envFilePath}`);
            process.exit(1);
        }

        return envFilePath;
    }
}
