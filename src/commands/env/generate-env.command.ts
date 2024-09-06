import fs from 'fs';
import path from 'path';
import { DateTime } from 'luxon';
import { Colors, pp } from '../../utils';

const pathToSampleEnv = path.resolve(__dirname, '../../sample.env');

export const generateEnv = (name?: string): void => {
    const fileName = `${name || DateTime.utc().toFormat('yyyyLLdd-HHmmss')}.env`;
    pp.info(`Generating env: ${Colors.yellowOlive(fileName)}`);

    // write to where the command was run
    const filePath = path.resolve(process.cwd(), fileName);

    fs.linkSync(pathToSampleEnv, filePath);
};
