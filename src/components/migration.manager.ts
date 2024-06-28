import { existsSync, readdirSync } from 'fs';
import { EnvManager } from './env.manager';
import chalk from 'chalk';
import { cleanFileName } from '@src/utils';
import { MigrateOptions } from '@src/types';

export class MigrationManager {
    static listMigrations({ cleanNames = false } = {}): string[] {
        const pathToMigrations = EnvManager.get().MIGRATIONS_DIR;

        if (!pathToMigrations || !existsSync(pathToMigrations)) {
            console.log(chalk.red(`Migration directory not found at ${chalk.redBright(pathToMigrations)}`));
            process.exit(1);
        }

        const files = readdirSync(pathToMigrations);

        if (cleanNames) {
            return files.map((file) => cleanFileName(file));
        }

        return files;
    }

    static validateFileNames(filenames: string[], options: MigrateOptions): string[] {
        const fileNamesProvided = filenames.length > 0;
        const allOption = options.all ?? false;
        const doBetween = options?.between ? options?.between?.length > 0 : undefined;
        const doUpTo = options?.upto;

        if (!fileNamesProvided && !allOption && !doBetween && !doUpTo) {
            return [];
        }

        const existingMigrations = MigrationManager.listMigrations({ cleanNames: true });

        // if we are migrating all, then we don't need to compare with existing migrations
        const filesToMap: string[] = [];
        const filesToExclude: string[] = [];

        if (allOption) {
            filesToMap.push(...existingMigrations);
        } else {
            const matchingFilesByName = existingMigrations.filter((file) => filenames.includes(file));
            const matchingFilesByIndex = existingMigrations.filter((file, index) =>
                filenames.includes(index.toString())
            );

            filesToMap.push(...matchingFilesByName, ...matchingFilesByIndex);
        }

        return filesToMap;
    }
}
