import chalk from 'chalk';
import { FileManager } from '../../components';
import { Colors, pp } from '../../utils';

/**
 * @description Gets current state of migrations
 * prints all the migrations that have been run
 * and the ones that are pending
 */
export const getState = async (): Promise<void> => {
    try {
        const completedMigrations = FileManager.getCompletedMigrations();
        const pendingMigrations = FileManager.getPendingMigrations();

        pp.info(`Found [${completedMigrations.length}] completed migrations`);
        for (const file of completedMigrations) {
            pp.info(`${file.index} - ${file.cleanedName}`, Colors.yellowOlive);
        }

        pp.warn(`\nFound [${chalk.yellowBright(pendingMigrations.length)}] pending migrations`);
        for (const file of pendingMigrations) {
            pp.log(`${file.index} - ${file.cleanedName}`, Colors.orange);
        }
    } catch (err) {
        pp.error('Error getting state');
        pp.error(err);
    }
};
