#! /usr/bin/env node

/**
 * TODO: Add description
 */
const pkg = require('../package.json');
import { Command } from 'commander';
import * as Commands from './commands';
import { REUSABLE_OPTIONS } from './constants';
import { handleCommaSeparateArgs } from './utils';
import { ConnectionManager } from './components';

const mig = new Command();
mig.name('mig').version(pkg.version);

const envCmd = mig.command('env');
const seedCmd = mig.command('seed');

/**
 * ---------------------------------------------------------------------------
 */
envCmd.description('Manages the env files, do `mig env -h` for more info');

envCmd.command('list').aliases(['l', 'ls']).description('List existing env configs').action(Commands.listEnvs);

envCmd
    .command('remove')
    .aliases(['r', 'delete', 'd'])
    .description('Delete an env configuration')
    .action(Commands.removeEnv)
    .argument('<name>', 'name of the env file to remove');

envCmd
    .command('set')
    .aliases(['s', 'use', 'select'])
    .description('Sets the current env')
    .action(Commands.setEnv)
    .argument('<name>', 'name of the env to use');

envCmd
    .command('edit')
    .aliases(['e'])
    .description('Opens VSCode to edit the env configuration')
    .action(Commands.editEnv)
    .argument('[name]', 'name of the env to edit - defaults to the current env');

envCmd
    .command('add')
    .aliases(['a', 'new'])
    .description('Adds a new env configuration')
    .action(Commands.addEnv)
    .argument('<path>', 'path to the env file to add')
    .argument('[name]', 'name of the env file to add - defaults to the name of the passed in file')
    .option('-c, --set-current', 'makes the env the current one', false)
    .option('-o, --overwrite', 'overwrites the env if it already exists', false);

envCmd
    .command('current')
    .aliases(['c', 'print'])
    .description('Prints the current env configuration')
    .action(Commands.getCurrentEnv)
    .option(...(REUSABLE_OPTIONS.verbose as [string, string]));

envCmd
    .command('init')
    .aliases(['i', 'create'])
    .description('Creates a new env file')
    .action(Commands.initEnv)
    .argument('[name]', 'name of the file to create');

/**
 * ---------------------------------------------------------------------------
 */
mig.command('make')
    .aliases(['m', 'mk', 'create', 'add', 'a', 'generate', 'g', 'gen'])
    .description('Creates a new migration file')
    .action(Commands.makeFile)
    .argument('<filename>', 'name of the file to create')
    .option('-e, --extension [name]', 'extension of the file to create', '.js');

mig.command('ping')
    .description('Checks the connection to the database')
    .action(Commands.ping)
    .aliases(['p', 'connect']);

mig.command('up')
    .description('Run migrations')
    .action(Commands.migUp)
    .argument('[filenames...]', 'migration files to run', handleCommaSeparateArgs)
    .option(...(REUSABLE_OPTIONS.all as [string, string]))
    .option(...(REUSABLE_OPTIONS.force as [string, string]))
    .option(...(REUSABLE_OPTIONS.between as [string, string]))
    .option(...(REUSABLE_OPTIONS.but as [string, string]))
    .option(...(REUSABLE_OPTIONS.verbose as [string, string]))
    .option(...(REUSABLE_OPTIONS.upto as [string, string]));

mig.command('state').aliases(['ss', 'status']).action(Commands.getState);

// handle closing the connection
mig.hook('postAction', async () => {
    await ConnectionManager.destroy();
});

mig.parse();
