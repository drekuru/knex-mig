import { SeedManager } from '../../components/seed.manager';

/**
 * Wherever the seed directory is, we will print out the folders and files in it the way the tree command does
 */
export const listSeeds = async (dirPath?: string): Promise<void> => {
    const subNode = dirPath ? SeedManager.getFile(dirPath) : undefined;
    SeedManager.printTree(subNode);
};
