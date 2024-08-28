import chalk from 'chalk';
import { EnvManager, ContextManager } from '../../components';
import { CommonOptions } from '../../types';

export const getCurrentEnv = (options: CommonOptions = {}): void => {
    const { envName } = ContextManager.ctx;

    if (!envName) {
        console.log(chalk.red(`No env set. Try running 'mig env set <envName>'`));
        return;
    }

    if (options.verbose) {
        const env = EnvManager.get();

        console.log(chalk.magenta('ENVIRONMENT VARIABLES:'));
        console.dir(env, { colors: true });
    } else {
        console.log(chalk.bold(chalk.magenta(`CURRENT ENV: ${chalk.magentaBright(envName)}`)));
    }
};
