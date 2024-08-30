import { ConnectionManager } from '../../components';
import { Colors, pp } from '../../utils';

export const ping = async (): Promise<void> => {
    const knex = ConnectionManager.knex;

    try {
        const user = await ConnectionManager.getKnexUser();
        pp.debug(`HOST: ${Colors.yellowOlive(user.host)}`);
        pp.debug(`USER: ${Colors.yellowOlive(user.user)}`);
        pp.debug(`DATABASE: ${Colors.yellowOlive(user.database)}`);
        pp.debug(`PORT: ${Colors.yellowOlive(user.port)}`);
        pp.debug(`PASSWORD: ${Colors.yellowOlive(user.password)}`);
        pp.log('Pinging database...');
        await knex.raw('SELECT 1');
        pp.log('Connection: OK');
        await ConnectionManager.destroy();
        return;
    } catch (err) {
        pp.error('Connection: Failed');
        pp.error(err);
        return;
    }
};
