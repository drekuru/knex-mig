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

        pp.warn(`Found <${completedMigrations.length}> completed migrations`, Colors.indianRed);
        for (const file of completedMigrations) {
            pp.info(`[${file.index}] - ${file.cleanedName}`);
        }

        pp.warn(`Found [${chalk.yellowBright(pendingMigrations.length)}] pending migrations`);
        for (const file of pendingMigrations) {
            pp.log(`${file.index} - ${file.cleanedName}`, Colors.orange);
        }
    } catch (err) {
        pp.error('Error getting state');
        pp.error(err);
    }
};
