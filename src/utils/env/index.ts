import chalk from 'chalk';
import { pp } from '../logger';

export const safeRead = (key: string): string => {
    const value = process.env[key];

    if (!value) {
        pp.error(`Missing env variable: ${chalk.redBright(key)}`);
        pp.info(`Please set the ${chalk.yellowBright(key)} environment variable`);
        process.exit(1);
    }

    return value;
};
