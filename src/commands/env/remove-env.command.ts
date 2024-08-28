import { ContextManager, EnvManager } from '../../components';
import chalk from 'chalk';
import { unlinkSync } from 'fs';

export const removeEnv = (name: string): void => {
    const filePath = EnvManager.validateENVPath(name);

    unlinkSync(filePath);

    console.log(chalk.green(`Env ${name} removed`));

    const { envName } = ContextManager.ctx;

    if (envName === name) {
        ContextManager.update('envName', null);
    }
};
