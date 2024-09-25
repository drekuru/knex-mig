import chalk from 'chalk';
import { EnvManager, ContextManager } from '../../components';
import { pp } from '../../utils';

export const getCurrentEnv = (): void => {
    const { envName } = ContextManager.ctx;

    if (!envName) {
        pp.error(`No env set. Try running 'mg env set <envName>'`);
        return;
    }

    if (pp.debugEnabled) {
        const env = EnvManager.get();

        pp.log('ENVIRONMENT VARIABLES:');
        console.dir(env, { colors: true });
    } else {
        pp.log(chalk.bold(`CURRENT ENV: ${chalk.magentaBright(envName)}`), chalk.magenta);
    }
};
