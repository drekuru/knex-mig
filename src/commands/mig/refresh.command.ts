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
export const refresh = async (
    filenames: string[] = [],
    options: MigrateOptions = {
        force: false,
        all: false,
        between: [],
        but: []
    }
): Promise<void> => {
    const filesToRefresh = FileManager.prepareFilesToMigrate(filenames, options);

    // for each file to refresh, check if it's up to be migrated down
    const pendingMigrations = FileManager.getPendingMigrations();

    for (const pendingMigration of pendingMigrations) {
        filesToRefresh.delete(pendingMigration.cleanedName);
    }

    if (filesToRefresh.size === 0) {
        pp.warn('No files to refresh');
        return;
    }

    const arrFilesToRefresh = Array.from(filesToRefresh.values());

    const knex = ConnectionManager.knex;

    await knex
        .transaction(async (trx) => {
            for (const filename of arrFilesToRefresh.reverse()) {
                pp.warn(`Migrating down: [${chalk.greenBright(filename.cleanedName)}]`);
                await trx.migrate.down({
                    name: filename.fullName
                });
            }

            for (const filename of arrFilesToRefresh.reverse()) {
                pp.warn(`Migrating up: [${chalk.greenBright(filename.cleanedName)}]`);
                await trx.migrate.up({
                    name: filename.fullName
                });
            }

            return trx;
        })
        .catch((err) => {
            pp.error('Error refreshing');
            pp.error(err);
        });
};
