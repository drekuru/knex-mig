import { ConnectionManager, FileManager } from '../../components';
import { MakeFileOptions } from '../../types';
import { getFileName, pp } from '../../utils';
import chalk from 'chalk';
import path from 'path';

/**
 * @description Creates a new migration file, following this naming convention: `timestamp_migration_name`
 * if no extension is provided, it will default to `.js`, otherwise it will use the provided extension.
 */
export const makeFile = async (fileName: string, options?: MakeFileOptions): Promise<void> => {
    const existingMigrationFiles = FileManager.getMigrationFilesList();

    // no periods in name
    fileName = getFileName(fileName, true);

    // check for existing file
    const nameIsTaken = existingMigrationFiles.some((file) => file.cleanedName === fileName);

    if (nameIsTaken) {
        pp.error(`Migration file ${chalk.redBright(fileName)} already exists`);
        return;
    }

    // if extension is .sql we manually make the file
    // else we let knex handle it
    if (options?.extension === '.sql') {
        // TODO: implement this
    } else {
        const knex = ConnectionManager.knex;

        await knex
            .transaction(async (trx) => {
                const newFilePath = await trx.migrate.make(fileName);
                const name = path.basename(newFilePath);
                pp.log(`Migration file ${chalk.greenBright(name)} created`);
                return trx;
            })
            .catch((err) => {
                pp.error(err);
                pp.log('Failed to create migration file');
            });
    }
};
