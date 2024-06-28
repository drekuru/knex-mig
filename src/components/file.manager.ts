import { existsSync, readdirSync } from 'fs';
import { EnvManager } from './env.manager';
import chalk from 'chalk';
import { cleanFileName } from '@src/utils';

export class FileManager {
    private static listedMigrations: string[] = [];
    private static namedMigrations: Record<string, string> = {};
    private static indexedMigrations: Record<string, string> = {};

    static listMigrations({ cleanNames = false } = {}): string[] {
        if (!this.listedMigrations.length) {
            const pathToMigrations = EnvManager.get().MIGRATIONS_DIR;

            if (!pathToMigrations || !existsSync(pathToMigrations)) {
                console.log(chalk.red(`Migration directory not found at ${chalk.redBright(pathToMigrations)}`));
                process.exit(1);
            }

            const files = readdirSync(pathToMigrations);

            if (cleanNames) {
                this.listedMigrations = files.map((file) => cleanFileName(file));
            }
        }

        return this.listedMigrations;
    }

    static deleteMigration(migrationName: string): void {
        delete this.namedMigrations[migrationName];
        delete this.indexedMigrations[migrationName];
    }

    static getMigration(migrationName: string): string {
        const file = this.namedMigrations[migrationName] || this.indexedMigrations[migrationName];

        return file;
    }

    static get migrations(): {
        named: Record<string, string>;
        indexed: Record<string, string>;
    } {
        if (!this.migrations) {
            const migrations = this.listMigrations({ cleanNames: true });

            for (let i = 0; i < migrations.length; i++) {
                this.namedMigrations[migrations[i]] = migrations[i];
                this.indexedMigrations[i.toString()] = migrations[i];
            }
        }

        return {
            named: this.namedMigrations,
            indexed: this.indexedMigrations
        };
    }
}
