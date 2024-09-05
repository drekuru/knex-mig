import { ConnectionManager, FileManager } from '../../components';
import { MigFileStatus } from '../../types';
import { pp } from '../../utils';
import chalk from 'chalk';
/**
 * @description Creates a new migration file, following this naming convention: `timestamp_migration_name`
 * if no extension is provided, it will default to `.js`, otherwise it will use the provided extension.
 */
export const clean = async (fileNames: string[] = []): Promise<void> => {
    try {
        const existingMigrations = await FileManager.getMigrationFilesMap();

        if (!existingMigrations.size) {
            pp.warn('No files to clean');
            return;
        }

        const filesToClean: string[] = [];
        for (const filename of fileNames) {
            const match = FileManager.getMigrationFile(filename);

            if (match?.status === MigFileStatus.COMPLETED) {
                pp.warn(`Cleaning [${chalk.greenBright(match.cleanedName)}]`);
                filesToClean.push(match.fullName);
            }
        }

        if (!filesToClean.length) {
            pp.warn('No files to clean');
            return;
        }

        const knex = ConnectionManager.knex;

        await knex.transaction(async (trx) => {
            await trx('knex_migrations').whereIn('name', filesToClean).delete();

            for (const file of filesToClean) {
                pp.log(`Removed: - ${file}`);
            }

            return trx;
        });
    } catch (err) {
        pp.error('Error cleaning files');
        pp.error(err);
    }
};
