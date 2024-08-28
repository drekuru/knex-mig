import chalk from 'chalk';
import { ConnectionManager, FileManager } from '../../components';
import { MigrateOptions } from '../../types';

/**
 * @description Handles migrating up
 * the logic is as follows
 * 1. prepare filenames to be migrated
 * 2. migrate up the remaining migrations
 */
export const migUp = async (
    filenames: string[] = [],
    options: MigrateOptions = {
        force: false,
        all: false,
        between: [],
        but: []
    }
): Promise<void> => {
    const filesToMigrate = await FileManager.prepareFilesToMigrate(filenames || [], options);

    if (filesToMigrate.size === 0) {
        console.log(chalk.yellow('No files to migrate'));
        return;
    }

    const knex = ConnectionManager.knex;

    await knex
        .transaction(async (trx) => {
            for (const filename of filesToMigrate.values()) {
                console.log(`Migrating up ${filename.cleanedName}`);
                await trx.migrate.up({
                    name: filename.fullName
                });
            }

            return trx;
        })
        .catch((err) => {
            console.log(chalk.redBright('Error migrating up'));
            console.log(err);
        });
};
