import { ConnectionManager } from '@src/components';
import chalk from 'chalk';

export const ping = async (): Promise<void> => {
    const knex = ConnectionManager.get();

    try {
        await knex.raw('SELECT 1');
        console.log(chalk.green('Connection OK'));
        await ConnectionManager.destroy();
        return;
    } catch (err) {
        console.error(err);
        console.log(chalk.red('Connection failed'));
        return;
    }
};
