import chalk from 'chalk';
import { ConnectionManager, FileManager } from '../../components';
import { MigrateOptions } from '../../types';
import { pp } from '../../utils';

/**
 * @description Handles migrating up
 * the logic is as follows
 * 1. prepare filenames to be migrated
 * 2. migrate up the remaining migrations
 */
export const refresh = async (
    filenames: string[] = [],
    options: MigrateOptions = {
        force: false,
        all: false,
        between: [],
        but: []
    }
): Promise<void> => {};
