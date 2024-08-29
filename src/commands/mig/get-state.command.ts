import chalk from 'chalk';
import { FileManager } from '../../components';

/**
 * @description Gets current state of migrations
 * prints all the migrations that have been run
 * and the ones that are pending
 */
export const getState = async (): Promise<void> => {
    try {
        const completedMigrations = await FileManager.getCompletedMigrations();
        const pendingMigrations = await FileManager.getPendingMigrations();

        console.log(chalk.yellow(`Found [${chalk.yellowBright(completedMigrations.length)}] completed migrations`));
        for (const migration of completedMigrations) {
            console.log(chalk.green(`- ${migration.cleanedName}`));
        }

        console.log(chalk.yellow(`Found [${chalk.bgYellowBright(pendingMigrations.length)}] pending migrations`));
        for (const migration of pendingMigrations) {
            console.log(chalk.red(`- ${migration.cleanedName}`));
        }
    } catch (err) {
        console.log(chalk.redBright('Error getting state'));
        console.log(err);
    }
};
