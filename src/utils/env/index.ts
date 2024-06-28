import chalk from 'chalk';

export const safeRead = (key: string): string => {
    const value = process.env[key];

    if (!value) {
        console.log(chalk.red(`Missing env variable: ${chalk.redBright(key)}`));
        console.log(chalk.yellow(`Please set the ${chalk.yellowBright(key)} environment variable`));
        process.exit(1);
    }

    return value;
};
