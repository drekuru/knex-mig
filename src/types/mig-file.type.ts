export enum MigFileStatus {
    COMPLETED = 'COMPLETED',
    PENDING = 'PENDING'
}

export type MigFile = {
    fullName: string;
    cleanedName: string;
    index: number;
    status: MigFileStatus;
};

export type KnexFileType = {
    fullName: string;
    cleanedName: string;
};
