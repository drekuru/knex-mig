import { handleCommaSeparateArgs } from '@src/utils';

export const REUSABLE_OPTIONS = {
    all: ['-a, --all', 'runs respective operation on all of the objects/files available'],
    but: ['-b, --but [filenames]', "don't use the listed files", handleCommaSeparateArgs],
    force: ['-f, --force', "don't stop when something fails"],
    confirm: ['-c, --confirm', 'confirm the action'],
    verbose: ['-v, --verbose', 'show more information'],
    upto: ['-u, --upto [number]', 'run operation upto a certain file'],
    between: ['-w, --between [range]', 'run operation on a range', handleCommaSeparateArgs],
    extensions: ['-ext, --extensions', 'to include postgis extensions in operation']
};
