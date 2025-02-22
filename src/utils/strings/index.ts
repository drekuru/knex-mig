import { SeedType } from '../../types';
import { pp } from '../logger';

/**
 * Custom arg parser for delimiter separated args
 */
export const createDelimitingFunction = (delimiters: string[]): ((val: string, prev?: string[]) => string[]) => {
    const rgx = new RegExp(`[${delimiters.join('')}]`);

    return (val: string, prev?: string[]): string[] => {
        const cleanVal = val.split(rgx).filter((it) => it);

        if (!prev) prev = [];

        prev.push(...cleanVal);

        return prev;
    };
};

export const handleCommaSeparateArgs = createDelimitingFunction([',', ' ']);

// function that takes in pairs of value ranges that look like this: 1-5,6-10,11-15 and returns an array of arrays
export const handleCommaSeparatePairs = (val: string, prev?: string[][]): string[][] => {
    if (!prev) prev = [];

    // first split by comma
    const pairs = val.split(',');

    // then split by dash
    for (const pair of pairs) {
        const [start, end] = pair.split('-');

        const startNum = parseInt(start);
        const endNum = parseInt(end);
        if (isNaN(startNum) || isNaN(endNum)) {
            pp.error('Invalid range provided');
            pp.warn(`Input: ${val}`);
            process.exit(1);
        }

        // make sure the order is correct, if not reverse it
        if (startNum > endNum) {
            prev.push([end, start]);
        } else {
            prev.push([start, end]);
        }
    }

    return prev;
};

/**
 * ========================
 * Ripped out of objection.js to help handle snake_case mapping
 */
export function snakeCase(
    str: string,
    { upperCase = false, underscoreBeforeDigits = false, underscoreBetweenUppercaseLetters = false } = {}
): string {
    if (str.length === 0) {
        return str;
    }

    const upper = str.toUpperCase();
    const lower = str.toLowerCase();

    let out = lower[0];

    for (let i = 1, l = str.length; i < l; ++i) {
        const char = str[i];
        const prevChar = str[i - 1];

        const upperChar = upper[i];
        const prevUpperChar = upper[i - 1];

        const lowerChar = lower[i];
        const prevLowerChar = lower[i - 1];

        // If underScoreBeforeDigits is true then, well, insert an underscore
        // before digits :). Only the first digit gets an underscore if
        // there are multiple.
        if (underscoreBeforeDigits && isDigit(char) && !isDigit(prevChar)) {
            out += '_' + char;
            continue;
        }

        // Test if `char` is an upper-case character and that the character
        // actually has different upper and lower case versions.
        if (char === upperChar && upperChar !== lowerChar) {
            const prevCharacterIsUppercase = prevChar === prevUpperChar && prevUpperChar !== prevLowerChar;

            // If underscoreBetweenUppercaseLetters is true, we always place an underscore
            // before consecutive uppercase letters (e.g. "fooBAR" becomes "foo_b_a_r").
            // Otherwise, we don't (e.g. "fooBAR" becomes "foo_bar").
            if (underscoreBetweenUppercaseLetters || !prevCharacterIsUppercase) {
                out += '_' + lowerChar;
            } else {
                out += lowerChar;
            }
        } else {
            out += char;
        }
    }

    if (upperCase) {
        return out.toUpperCase();
    } else {
        return out;
    }
}

export const camelCase = (str: string, { upperCase = false } = {}): string => {
    if (str.length === 0) {
        return str;
    }

    if (upperCase && isAllUpperCaseSnakeCase(str)) {
        // Only convert to lower case if the string is all upper
        // case snake_case. This allows camelCase strings to go
        // through without changing.
        str = str.toLowerCase();
    }

    let out = str[0];

    for (let i = 1, l = str.length; i < l; ++i) {
        const char = str[i];
        const prevChar = str[i - 1];

        if (char !== '_') {
            if (prevChar === '_') {
                out += char.toUpperCase();
            } else {
                out += char;
            }
        }
    }

    return out;
};

export const isDigit = (char: string): boolean => {
    return char >= '0' && char <= '9';
};

export const isAllUpperCaseSnakeCase = (str: string): boolean => {
    for (let i = 1, l = str.length; i < l; ++i) {
        const char = str[i];

        if (char !== '_' && char !== char.toUpperCase()) {
            return false;
        }
    }

    return true;
};

const staticTypes = ['.json'];
const dynamicTypes = ['.js'];

export const getSeedType = (extension: string): SeedType => {
    if (staticTypes.includes(extension)) {
        return SeedType.STATIC;
    } else if (dynamicTypes.includes(extension)) {
        return SeedType.DYNAMIC;
    }

    return SeedType.UNKNOWN;
};
