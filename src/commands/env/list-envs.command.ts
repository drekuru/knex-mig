import { EnvManager } from '../../components';
import { printListStyle } from '../../utils';
import chalk from 'chalk';

export const listEnvs = (): void => {
    const envs = EnvManager.listAll();

    console.log('Available envs:');
    envs.forEach((env) => console.log(chalk.yellow(printListStyle(env))));
};
