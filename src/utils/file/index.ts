/**
 * @description Extracts file name from a path, with or without file extension
 */
export const getFileName = (fileName: string, withoutExtension = true): string => {
    if (!fileName) return '';
    const name = fileName.split('/').pop();

    if (withoutExtension) {
        return name?.split('.')?.[0] || '';
    }

    return name || '';
};

/**
 * @description Extracts file extension from a file name
 */
export const getFileExtension = (fileName: string): string => {
    return fileName?.split('.').pop() || '';
};

/**
 * @description Cleans file name by removing any leading numbers and file extension
 */
export const cleanFileName = (fileName: string): string => {
    return fileName?.replace(/^\d+_/, '')?.replace(/\.\w+$/, '') || '';
};

export const isJSON = (fileName: string): boolean => {
    return getFileExtension(fileName) === 'json';
};
