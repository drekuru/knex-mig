import { FileManager } from '../../components/file-manager/manager';
import { MigrateOptions } from '../../types';

/**
 * @description Handles migrating up
 * the logic is as follows
 * 1. prepare filenames to be migrated
 * 2. get existing migrations
 * 3. remove existing migrations from filenames
 * 4. migrate up the remaining migrations
 */
export const migUp = async (
    filenames?: string[],
    options: MigrateOptions = {
        force: false,
        all: false,
        between: [],
        but: []
    }
): Promise<void> => {
    const filesToMigrate = FileManager.prepareFilesToMigrate(filenames || [], options);
};
