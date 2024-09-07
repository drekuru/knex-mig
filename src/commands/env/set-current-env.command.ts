import { ContextManager, EnvManager } from '../../components';
import { Colors, pp } from '../../utils';

export const setEnv = (name: string): void => {
    EnvManager.validateENVPath(name);

    ContextManager.update('envName', name);

    pp.info(Colors.orange(`Set current environment to: [${Colors.indianRed(name)}]`));
};
