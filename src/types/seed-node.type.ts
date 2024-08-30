export enum SeedType {
    DYNAMIC = 'dynamic',
    STATIC = 'static',
    UNKNOWN = 'unknown'
}

export type SeedNode = {
    fullPath: string;
    name: string;
    isFile: boolean;
    children?: Map<string, SeedNode>;
    extension?: string;
    index?: number;
    seedType?: SeedType;
};
