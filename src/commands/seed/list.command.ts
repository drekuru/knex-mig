import { SeedManager } from '../../components/seed.manager';
import { pp } from '../../utils';

/**
 * Wherever the seed directory is, we will print out the folders and files in it the way the tree command does
 */
export const listSeeds = async (): Promise<void> => {
    pp.info('Listing seeds');

    SeedManager.printTree();
};
