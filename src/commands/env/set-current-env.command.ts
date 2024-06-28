import { ContextManager, EnvManager } from '@src/components';
import chalk from 'chalk';

export const setEnv = (name: string): void => {
    EnvManager.validateENVPath(name);

    ContextManager.update('envName', name);

    console.log(chalk.green(`Current environment set to: ${chalk.greenBright(name)}`));
};
