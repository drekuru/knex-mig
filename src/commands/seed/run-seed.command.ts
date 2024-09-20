import { ConnectionManager } from '../../components';
import { SeedManager } from '../../components/seed.manager';
import { MigrateOptions } from '../../types';
import { pp } from '../../utils';

/**
 * Wherever the seed directory is, we will print out the folders and files in it the way the tree command does
 */
export const runSeeds = async (filenames: string[] = [], options: MigrateOptions): Promise<void> => {
    const filesToProcess = SeedManager.prepareSeedFiles(filenames, options);

    if (!filesToProcess.length) {
        pp.warn('No files to process');
        return;
    }

    const knex = ConnectionManager.knex;

    await knex.transaction(async (trx) => {
        for (const file of filesToProcess) {
            await SeedManager.runSeed(file, trx);
        }
    });
};
