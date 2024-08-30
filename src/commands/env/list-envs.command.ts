import { EnvManager } from '../../components';
import { pp, printListStyle } from '../../utils';

export const listEnvs = (): void => {
    const envs = EnvManager.listAll();

    pp.log('Available envs:');
    envs.forEach((env) => pp.info(printListStyle(env)));
};
