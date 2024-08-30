import { ContextManager, EnvManager } from '../../components';
import { unlinkSync } from 'fs';
import { pp } from '../../utils';

export const removeEnv = (name: string): void => {
    const filePath = EnvManager.validateENVPath(name);

    unlinkSync(filePath);

    pp.log(`Env ${name} removed`);

    const { envName } = ContextManager.ctx;

    if (envName === name) {
        ContextManager.update('envName', null);
    }
};
