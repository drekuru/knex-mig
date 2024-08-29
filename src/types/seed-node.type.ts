export type SeedNode = {
    fullPath: string;
    name: string;
    isFile: boolean;
    children?: Map<string, SeedNode>;
    type?: string;
    index?: number;
};
