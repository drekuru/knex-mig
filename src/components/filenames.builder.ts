import { MigrateOptions } from '@src/types';

export class FileNamesBuilder {
    private preppedFilenames: Map<string, string> = new Map();

    constructor(
        private filenames: string[],
        private opts: MigrateOptions,
        private existingMigrations: Map<string, string>
    ) {}

    compile(): string[] {
        if (this.opts.all) this.withAll();
        else if (this.filenames.length) this.mapFileNames();

        if (this.opts.between?.length) this.withBetween();
        if (this.opts.but?.length) this.withBut();
        if (this.opts.upto) this.withUpTo();

        return Array.from(this.preppedFilenames.values());
    }

    private withAll(): void {
        this.preppedFilenames = this.existingMigrations;
    }

    private mapFileNames(): void {}

    private withBetween(): void {
        // for each pair of filenames
    }
    private withBut(): void {}
    private withUpTo(): void {}
}
