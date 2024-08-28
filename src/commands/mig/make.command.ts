import { ConnectionManager, FileManager } from '../../components';
import { MakeFileOptions } from '../../types';
import { getFileName } from '../../utils';
import chalk from 'chalk';
import path from 'path';

/**
 * @description Creates a new migration file, following this naming convention: `timestamp_migration_name`
 * if no extension is provided, it will default to `.js`, otherwise it will use the provided extension.
 */
export const makeFile = async (fileName: string, options?: MakeFileOptions): Promise<void> => {
    const existingMigrationFiles = await FileManager.getMigrationFiles();

    // no periods in name
    fileName = getFileName(fileName, true);

    // check for existing file
    const nameIsTaken = existingMigrationFiles.some((file) => file.cleanedName === fileName);

    if (nameIsTaken) {
        console.log(chalk.red(`Migration file ${chalk.redBright(fileName)} already exists`));
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
                console.log(chalk.green(`Migration file ${chalk.greenBright(name)} created`));
                return trx;
            })
            .catch((err) => {
                console.error(err);
                console.log(chalk.red('Failed to create migration file'));
                process.exit(1);
            })
            .finally(async () => await knex.destroy());
    }
};
