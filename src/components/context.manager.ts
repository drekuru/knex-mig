import { PathManager } from './path.manager';
import chalk from 'chalk';
import fs from 'fs';
import { Context } from '@src/types';

export class ContextManager {
    private static context: Context;

    static get ctx(): Context {
        if (!this.context) {
            this.context = this.load();
        }
        return this.context;
    }

    private static load(): Context {
        if (!fs.existsSync(PathManager.CONTEXT_FILE_PATH)) {
            console.log(chalk.red('context file not found, run `mig setup` to create one'));
            process.exit(1);
        }

        return JSON.parse(fs.readFileSync(PathManager.CONTEXT_FILE_PATH, 'utf-8'));
    }

    static update(key: keyof Context, value: string | null): void {
        const ctx = this.ctx;

        ctx[key] = value;

        fs.writeFileSync(PathManager.CONTEXT_FILE_PATH, JSON.stringify(ctx, null, 4));
    }
}
