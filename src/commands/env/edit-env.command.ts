import { ContextManager, EnvManager } from '@src/components';
import chalk from 'chalk';
import { execSync } from 'child_process';

export const editEnv = (name?: string | null): void => {
    name = name ?? ContextManager.ctx.envName;

    if (!name) {
        console.log(chalk.red('No env name provided'));
        return;
    }

    const filePath = EnvManager.validateENVPath(name);

    execSync(`code ${filePath}`);
};
