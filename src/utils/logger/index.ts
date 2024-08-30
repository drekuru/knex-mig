import chalk, { Chalk } from 'chalk';
import { DateTime } from 'luxon';

// Pretty print
export const pp = {
    debugEnabled: false,
    log: (message: any = '', color: Chalk = chalk.white): void => {
        console.log(color(message));
    },
    debug: (message?: string, color: Chalk = chalk.blue): void => {
        if (pp.debugEnabled) pp.log(`[${DateTime.utc().toString()}] ${message}`, color);
    },
    info: (message?: string, color: Chalk = chalk.green): void => {
        pp.log(message, color);
    },
    warn: (message?: string, color: Chalk = chalk.yellow): void => {
        pp.log(message, color);
    },
    error: (message?: string, color: Chalk = chalk.red): void => {
        pp.log(message, color);
    },
    debugOn: (): void => {
        pp.debugEnabled = true;
        pp.debug('Debug Mode Enabled');
    }
};

export const Colors = {
    orange: chalk.rgb(255, 136, 0),
    indianRed: chalk.rgb(255, 95, 135),
    yellowOlive: chalk.rgb(135, 175, 0)
};
