import { existsSync, readdirSync } from 'fs';
import { EnvManager } from './env.manager';
import chalk from 'chalk';
import { cleanFileName } from '../utils';
import { MigrateOptions, MigFile, KnexFileType } from '../types';
import { ConnectionManager } from './connection.manager';

export class FileManager {
    private static mapOfExistingMigrationFiles: Map<string, MigFile> = new Map();
    private static indexedMapOfExistingMigrationFiles: Map<number, MigFile> = new Map();
    private static completedMigrations: KnexFileType[] = [];

    static {
        this.loadExistingMigrationFiles();
    }

    private static loadExistingMigrationFiles(): void {
        // load existing migrations
        if (!this.mapOfExistingMigrationFiles.size) {
            const pathToMigrations = EnvManager.get().MIGRATIONS_DIR;

            if (!pathToMigrations || !existsSync(pathToMigrations)) {
                console.log(chalk.red(`Migration directory not found at ${chalk.redBright(pathToMigrations)}`));
                process.exit(1);
            }

            const files = readdirSync(pathToMigrations);

            for (let i = 0; i < files.length; i++) {
                const cleanName = cleanFileName(files[i]);

                const migFile: MigFile = {
                    index: i,
                    fullName: files[i],
                    cleanedName: cleanName
                };

                this.mapOfExistingMigrationFiles.set(cleanName, migFile);
                this.indexedMapOfExistingMigrationFiles.set(i, migFile);
            }
        }
    }

    public static async prepareFilesToMigrate(
        filenames: string[],
        opts: MigrateOptions
    ): Promise<Map<string, MigFile>> {
        let filesToMigrate: Map<string, MigFile> = new Map();

        // handle all flag
        if (opts.all === true) {
            filesToMigrate = new Map(this.mapOfExistingMigrationFiles);
        }
        // handle specific files
        else if (filenames.length) {
            for (const filename of filenames) {
                const match = this.getMigrationFile(filename);

                if (match) {
                    filesToMigrate.set(match.cleanedName, match);
                }
            }
        }

        // handle between flag
        if (opts.between?.length) {
            for (const [start, end] of opts.between) {
                let firstIndex = Number.parseInt(start);
                let lastIndex = Number.parseInt(end);

                // if pair is backwards, swap them
                if (firstIndex > lastIndex) {
                    [firstIndex, lastIndex] = [lastIndex, firstIndex];
                }

                for (let i = firstIndex; i <= lastIndex; i++) {
                    const match = this.indexedMapOfExistingMigrationFiles.get(i);
                    if (match) {
                        filesToMigrate.set(match.cleanedName, match);
                    }
                }
            }
        }

        // handle upto flag
        if (opts.upto !== undefined) {
            for (let i = 0; i <= opts.upto; i++) {
                const match = this.indexedMapOfExistingMigrationFiles.get(i);
                if (match) {
                    filesToMigrate.set(match.cleanedName, match);
                }
            }
        }

        // handle but flag
        if (opts.but?.length) {
            for (const filename of opts.but) {
                const match = this.getMigrationFile(filename);

                if (match) {
                    filesToMigrate.delete(match.cleanedName);
                }
            }
        }

        // get existing migrations and remove them from the list
        const completedMigrations = await this.getCompletedMigrations();

        for (const completedMigration of completedMigrations) {
            filesToMigrate.delete(completedMigration.cleanedName);
        }

        return filesToMigrate;
    }

    private static getMigrationFile(val: string): MigFile | undefined {
        return this.mapOfExistingMigrationFiles.get(val) || this.indexedMapOfExistingMigrationFiles.get(Number(val));
    }

    static getMigrationFiles(): MigFile[] {
        return Array.from(this.mapOfExistingMigrationFiles.values());
    }

    static async getCompletedMigrations(): Promise<KnexFileType[]> {
        if (!this.completedMigrations.length) {
            const [completed] = await ConnectionManager.knex.migrate.list();

            this.completedMigrations = completed.map((e) => {
                const cleanedName = cleanFileName(e.name);
                const knexFile: KnexFileType = {
                    cleanedName,
                    fullName: e.name
                };

                return knexFile;
            });
        }

        return this.completedMigrations;
    }
}
