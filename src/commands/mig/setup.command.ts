import { ConnectionManager, PathManager } from '../../components';
import { pp } from '../../utils';

export const setup = async ({ initDb = false }): Promise<void> => {
    try {
        PathManager.setupPaths();

        if (initDb) {
            const knex = ConnectionManager.knex;

            pp.debug(`Schema set in config: ${process.env.MIGRATIONS_TABLE_SCHEMA}`);

            // here we only need to check if the schema exists and if not, create it
            const migrationsSchema = process.env.MIGRATIONS_TABLE_SCHEMA || 'public';

            pp.info(`Setting up mig in schema [${migrationsSchema}]`);

            await knex.raw(`CREATE SCHEMA IF NOT EXISTS ${migrationsSchema};`);
        }

        pp.info('Setup completed!');
    } catch (err) {
        pp.error('Error setting up mig');
        pp.error(err);
    }
};
