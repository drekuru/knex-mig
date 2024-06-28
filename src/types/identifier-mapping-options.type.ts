export type IdentifierMapperOptions = {
    parse: (str: string) => string;
    format: (str: string) => string;
    idSeparator?: string;
};

export type IdentifierMappersReturn = {
    wrapIdentifier: (identifier: string, origWrap: (identifier: string) => string) => string;
    postProcessResponse: (result: any) => any;
};
