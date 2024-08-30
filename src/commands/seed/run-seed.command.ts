import { ConnectionManager } from '../../components';
import { SeedManager } from '../../components/seed.manager';
import { SeedNode, SeedType } from '../../types';
import { pp } from '../../utils';

/**
 * Wherever the seed directory is, we will print out the folders and files in it the way the tree command does
 */
export const runSeeds = async (filenames: string[] = []): Promise<void> => {
    const filesToProcess: SeedNode[] = [];
    for (const filename of filenames) {
        pp.info(`Looking for seed [${filename}]`);
        const file = SeedManager.getFile(filename);

        if (!file) {
            pp.error(`Seed [${filename}] not found`);
            continue;
        } else if (file.seedType === SeedType.UNKNOWN) {
            pp.error(`Seed type not supported for [${filename}]`);
            continue;
        }

        filesToProcess.push(file);
    }

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
