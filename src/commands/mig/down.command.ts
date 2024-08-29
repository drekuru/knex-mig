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
export const migDown = async (
    filenames: string[] = [],
    options: MigrateOptions = {
        force: false,
        all: false,
        between: [],
        but: []
    }
): Promise<void> => {
    const filesToMigrate = FileManager.prepareFilesToMigrate(filenames || [], options);

    // get existing migrations
    const completedMigrations = FileManager.getCompletedMigrations();

    // remove files that are not in the completed migrations
    for (const file of filesToMigrate.values()) {
        if (!completedMigrations.some((e) => e.cleanedName === file.cleanedName)) {
            pp.warn(`- Already Down: ${file.cleanedName}`);
            filesToMigrate.delete(file.cleanedName);
        }
    }

    if (filesToMigrate.size === 0) {
        pp.warn('No files to migrate');
        return;
    }

    const knex = ConnectionManager.knex;

    await knex
        .transaction(async (trx) => {
            for (const filename of filesToMigrate.values()) {
                pp.info(`Migrating down ${filename.cleanedName}`);
                await trx.migrate.down({
                    name: filename.fullName
                });
            }

            return trx;
        })
        .catch((err) => {
            pp.error(chalk.redBright('Error migrating down'));
            pp.log(err);
        });
};
