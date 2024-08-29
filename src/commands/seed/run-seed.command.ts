import { SeedManager } from '../../components/seed.manager';
import { pp } from '../../utils';

/**
 * Wherever the seed directory is, we will print out the folders and files in it the way the tree command does
 */
export const runSeeds = async (filenames: string[] = []): Promise<void> => {
    for (const filename of filenames) {
        pp.info(`Running seed [${filename}]`);
        const file = SeedManager.getFile(filename);
        console.log(file);
    }
};
