import { ContextManager, EnvManager } from '../../components';
import { execSync } from 'child_process';
import { pp } from '../../utils';

export const editEnv = (name?: string | null): void => {
    name = name ?? ContextManager.ctx.envName;

    if (!name) {
        pp.error('No env name provided');
        return;
    }

    const filePath = EnvManager.validateENVPath(name);

    execSync(`code ${filePath}`);
};
