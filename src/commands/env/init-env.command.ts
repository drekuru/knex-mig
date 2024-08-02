import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * @description Create an empty .env file with all the required keys
 */
export const initEnv = (name?: string | null): void => {
    // path will always be where the command is executed
    const fileName = name ? `${name}.env` : '.env';
    const envPath = path.join(process.cwd(), fileName);

    // check if the file exists
    if (fs.existsSync(envPath)) {
        console.log(chalk.red(`File ${fileName} already exists`));
        process.exit(1);
    }

    // create the file
    fs.writeFileSync(envPath, '');
};
