import { IdentifierMapperOptions, IdentifierMappersReturn } from '@src/types';
import { camelCase, snakeCase } from '../strings';

export const isObject = (value: any): boolean => {
    return value !== null && typeof value === 'object';
};

// Super fast memoize for single argument functions.
export const memoize = <T, U>(func: (input: T) => U): ((input: T) => U) => {
    const cache = new Map<T, U>();

    return (input: T): U => {
        let output = cache.get(input);

        if (output === undefined) {
            output = func(input);
            cache.set(input, output);
        }

        return output;
    };
};

// Returns a function that splits the inputs string into pieces using `separator`,
// only calls `mapper` for the last part and concatenates the string back together.
// If no separators are found, `mapper` is called for the entire string.
export const mapLastPart = (mapper: (part: string) => string, separator: string): ((str: string) => string) => {
    return (str: string) => {
        if (!str) return str;
        const idx = str.lastIndexOf(separator);
        const mapped = mapper(str.slice(idx + separator.length));
        return str.slice(0, idx + separator.length) + mapped;
    };
};

// Returns a function that takes an object as an input and maps the object's keys
// using `mapper`. If the input is not an object, the input is returned unchanged.
export const keyMapper = (mapper: (key: string) => string): ((obj: Record<string, any>) => Record<string, any>) => {
    return (obj) => {
        if (!isObject(obj) || Array.isArray(obj)) {
            return obj;
        }

        const keys = Object.keys(obj);
        const out = {};

        for (let i = 0, l = keys.length; i < l; ++i) {
            const key = keys[i];
            out[mapper(key)] = obj[key];
        }

        return out;
    };
};

export const knexIdentifierMappers = ({
    parse,
    format,
    idSeparator = ':'
}: IdentifierMapperOptions): IdentifierMappersReturn => {
    const formatId = memoize(mapLastPart(format, idSeparator));
    const parseId = memoize(mapLastPart(parse, idSeparator));
    const parseKeys = keyMapper(parseId);

    return {
        wrapIdentifier(identifier: string, origWrap: (identifier: string) => string) {
            return origWrap(formatId(identifier));
        },

        postProcessResponse(result: any) {
            if (Array.isArray(result)) {
                const output = new Array(result.length);

                for (let i = 0, l = result.length; i < l; ++i) {
                    output[i] = parseKeys(result[i]);
                }

                return output;
            } else {
                return parseKeys(result);
            }
        }
    };
};

export const knexSnakeCaseMappers = (opt = {}): IdentifierMappersReturn => {
    return knexIdentifierMappers({
        parse: (str: string) => camelCase(str, opt),
        format: (str: string) => snakeCase(str, opt)
    });
};
