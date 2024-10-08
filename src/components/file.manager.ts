import { existsSync, readdirSync } from 'fs';
import { EnvManager } from './env.manager';
import chalk from 'chalk';
import { cleanFileName } from '../utils';
import { MigrateOptions, MigFile, KnexFileType, MigFileStatus } from '../types';
import { ConnectionManager } from './connection.manager';
import path from 'path';

// TODO: refactor this class to be more modular
export class FileManager {
    private static mapOfExistingMigrationFiles: Map<string, MigFile> = new Map();
    private static indexedMapOfExistingMigrationFiles: Map<number, MigFile> = new Map();

    public static async init(): Promise<void> {
        await this.loadExistingMigrationFiles();
    }

    private static async loadExistingMigrationFiles(): Promise<void> {
        // load existing migrations
        if (!this.mapOfExistingMigrationFiles.size) {
            const pathToMigrations = EnvManager.get().MIGRATIONS_DIR;

            if (!pathToMigrations || !existsSync(pathToMigrations)) {
                console.log(chalk.red(`Migration directory not found at ${chalk.redBright(pathToMigrations)}`));
                process.exit(1);
            }

            const files = readdirSync(pathToMigrations, { withFileTypes: true });
            const { completedMigrations } = await this.getMigrationStateInDb();

            for (let i = 0; i < files.length; i++) {
                if (files[i].isDirectory()) {
                    continue;
                }
                // if not extension - it's a directory
                const cleanName = cleanFileName(files[i].name);

                // accounting for this because parentPath doesn't exist in Node <v20.12.0
                // const basePath = files[i].parentPath || files[i].path;
                // const fullPath = path.resolve(basePath, files[i].name);
                const index = i + 1;

                const migFile: MigFile = {
                    index,
                    fullName: files[i].name,
                    cleanedName: cleanName,
                    status: completedMigrations.has(cleanName) ? MigFileStatus.COMPLETED : MigFileStatus.PENDING
                };

                this.mapOfExistingMigrationFiles.set(cleanName, migFile);
                this.indexedMapOfExistingMigrationFiles.set(index, migFile);
            }
        }
    }

    public static prepareFilesToMigrate(filenames: string[], opts: MigrateOptions): Map<string, MigFile> {
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

        return filesToMigrate;
    }

    public static getMigrationFile(val: string): MigFile | undefined {
        return this.mapOfExistingMigrationFiles.get(val) || this.indexedMapOfExistingMigrationFiles.get(Number(val));
    }

    static getMigrationFilesMap(): Map<string, MigFile> {
        return this.mapOfExistingMigrationFiles;
    }

    static getMigrationFilesList(): MigFile[] {
        return Array.from(this.mapOfExistingMigrationFiles.values());
    }

    private static async getMigrationStateInDb(): Promise<{
        completedMigrations: Map<string, KnexFileType>;
    }> {
        const completedMigrations = new Map<string, KnexFileType>();
        const [completed] = await ConnectionManager.knex.migrate.list();

        for (const e of completed) {
            const cleanedName = cleanFileName(e.name);
            completedMigrations.set(cleanedName, {
                cleanedName,
                fullName: e.name
            });
        }

        return { completedMigrations };
    }

    static getCompletedMigrations(): MigFile[] {
        return Array.from(this.mapOfExistingMigrationFiles.values()).filter(
            (e) => e.status === MigFileStatus.COMPLETED
        );
    }

    static getPendingMigrations(): MigFile[] {
        return Array.from(this.mapOfExistingMigrationFiles.values()).filter((e) => e.status === MigFileStatus.PENDING);
    }
}
