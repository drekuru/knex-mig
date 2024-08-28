export type CommonOptions = {
    verbose?: boolean;
};

export type AddEnvOptions = {
    setCurrent?: boolean;
    overwrite?: boolean;
};

export type MakeFileOptions = {
    extension?: string;
};

export type MigrateOptions = {
    all?: boolean;
    force?: boolean;
    but?: string[];
    between?: string[][];
    upto?: number;
    verbose?: boolean;
};
