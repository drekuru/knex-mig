import chalk from 'chalk';
import { ConnectionManager } from '../../components';
import { Colors, pp } from '../../utils';
import { createInterface } from 'readline/promises';

/**
 * @description Gets all schemas from the database and drops them - hard reset pretty much
 */
export const destroy = async (): Promise<void> => {
    try {
        const knex = ConnectionManager.knex;

        // we only let the user proceed if env is local
        if (process.env.ENV === 'prod' || process.env.ENV === 'production') {
            pp.error('This command is NOT available in prod environment');
            return;
        }

        // drop schemas
        await knex.transaction(async (trx) => {
            // get all schemas
            const { rows } = await knex.raw(`SELECT schema_name FROM information_schema.schemata`);

            // drop all schemas except information_schema and anything that starts with pg_
            const schemasToDrop = rows.filter(
                (row) => !row.schema_name.startsWith('pg_') && row.schema_name !== 'information_schema'
            );

            if (schemasToDrop.length === 0) {
                pp.warn('No schemas to drop');
                return;
            }

            const schemaNames = schemasToDrop.map((row) => row.schema_name);

            pp.debug('Schemas to drop:');
            pp.debug(schemaNames.join('\n'));

            const rl = createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const response = await rl.question(Colors.orange('Are you sure you want to drop all schemas? (yes/no): '));

            if (response.toLowerCase() !== 'yes') {
                pp.warn('Aborted dropping schemas - wise choice');
                rl.close();
                return;
            }

            // second confirmation
            const response2 = await rl.question(
                Colors.indianRed(
                    `ENV [${chalk.redBright(process.env.ENV)}] - Are you sure you want to drop all schemas? (yes/no): `
                )
            );

            if (response2.toLowerCase() !== 'yes') {
                pp.warn('Aborted dropping schemas - wise choice');
                rl.close();
                return;
            }

            for (const schema of schemaNames) {
                pp.warn(`Dropping schema [${schema}]`);
                await trx.raw(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
            }

            pp.info('Dropped schemas successfully!');
            pp.log(`To reinitialize the database, run 'mig setup'`);

            rl.close();
            return;
        });
    } catch (err) {
        pp.error('Error destroying database');
        pp.error(err);
    }
};
