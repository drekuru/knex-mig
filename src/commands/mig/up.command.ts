import chalk from 'chalk';
import { ConnectionManager, FileManager } from '../../components';
import { MigrateOptions } from '../../types';
import { pp } from '../../utils';

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
    const filesToMigrate = FileManager.prepareFilesToMigrate(filenames || [], options);

    // get existing migrations and remove them from the list
    const completedMigrations = FileManager.getCompletedMigrations();

    for (const completedMigration of completedMigrations) {
        filesToMigrate.delete(completedMigration.cleanedName);
    }

    if (filesToMigrate.size === 0) {
        pp.warn('No files to migrate');
        return;
    }

    const knex = ConnectionManager.knex;

    await knex
        .transaction(async (trx) => {
            for (const filename of filesToMigrate.values()) {
                pp.warn(`Migrating up [${chalk.greenBright(filename.cleanedName)}]`);
                await trx.migrate.up({
                    name: filename.fullName
                });
            }

            return trx;
        })
        .catch((err) => {
            pp.error('Error migrating up');
            pp.error(err);
        });
};
