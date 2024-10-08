#! /usr/bin/env node

/**
 * TODO: Add description
 */
const pkg = require('../package.json');
import { Command } from 'commander';
import * as Commands from './commands';
import { REUSABLE_OPTIONS } from './constants';
import { handleCommaSeparateArgs, pp } from './utils';
import { ConnectionManager, FileManager } from './components';

const mig = new Command();
mig.name('knex-mig').version(pkg.version);

const envCmd = mig.command('env');

/**
 * ------------------------------ HOOKS ----------------------------------
 */
// handle loading the files (only for certain commands)
const commandsToPreLoadFilesFor = ['up', 'down', 'refresh', 'clean', 'state', 'destroy'];
mig.hook('preAction', async (cmd, action) => {
    action.getOptionValue('verbose') && pp.debugOn();

    if (commandsToPreLoadFilesFor.includes(action.name())) {
        await FileManager.init();
    }
});

// handle closing the connection
mig.hook('postAction', async () => {
    await ConnectionManager.destroy();
});

/**
 * ------------------------------- SEED --------------------------------------
 */
const seedCmd = mig.command('seed');
// seedCmd
//     .command('make')
//     .aliases(['m', 'mk'])
//     .description('Creates a new seed file')
//     .action(Commands.makeSeed)
//     .argument('<filename>', 'name of the file to create');

seedCmd
    .command('list')
    .aliases(['l', 'ls'])
    .description('List existing seed files')
    .action(Commands.listSeeds)
    .argument('[path]', 'path to the seed files');

seedCmd
    .command('run')
    .aliases(['r'])
    .description('Run seed files')
    .action(Commands.runSeeds)
    .argument('[filenames...]', 'seed files to run', handleCommaSeparateArgs)
    .option(...(REUSABLE_OPTIONS.all as [string, string]))
    .option(...(REUSABLE_OPTIONS.but as [string, string]));

/**
 * ------------------------------- ENV --------------------------------------
 */
envCmd.description('Manages the env files, do `mg env -h` for more info');

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
    .command('generate')
    .aliases(['g', 'gen', 'create', 'init'])
    .description('Generates a new env file with empty values')
    .action(Commands.generateEnv)
    .argument('[name]', 'name of the file to create');

/**
 * -------------------------------- MIG ---------------------------------------
 */
mig.command('make')
    .aliases(['m', 'mk', 'create', 'add', 'a', 'generate', 'g', 'gen'])
    .description('Creates a new migration file')
    .action(Commands.makeFile)
    .argument('<filename>', 'name of the file to create')
    .option('-e, --extension [name]', 'extension of the file to create', '.js');

mig.command('ping')
    .aliases(['p', 'connect', 'whoami'])
    .description('Checks the connection to the database - if used with verbose, it will print the connection details')
    .action(Commands.ping)
    .option(...(REUSABLE_OPTIONS.verbose as [string, string]));

mig.command('up')
    .aliases(['u'])
    .description('Run migrations')
    .action(Commands.migUp)
    .argument('[filenames...]', 'migration files to run', handleCommaSeparateArgs)
    .option(...(REUSABLE_OPTIONS.all as [string, string]))
    .option(...(REUSABLE_OPTIONS.force as [string, string]))
    .option(...(REUSABLE_OPTIONS.between as [string, string]))
    .option(...(REUSABLE_OPTIONS.but as [string, string]))
    .option(...(REUSABLE_OPTIONS.verbose as [string, string]))
    .option(...(REUSABLE_OPTIONS.upto as [string, string]));

mig.command('down')
    .aliases(['d'])
    .description('Rollback migrations')
    .action(Commands.migDown)
    .argument('[filenames...]', 'migration files to run', handleCommaSeparateArgs)
    .option(...(REUSABLE_OPTIONS.all as [string, string]))
    .option(...(REUSABLE_OPTIONS.force as [string, string]))
    .option(...(REUSABLE_OPTIONS.between as [string, string]))
    .option(...(REUSABLE_OPTIONS.but as [string, string]))
    .option(...(REUSABLE_OPTIONS.verbose as [string, string]))
    .option(...(REUSABLE_OPTIONS.upto as [string, string]));

mig.command('refresh')
    .aliases(['r'])
    .description('Runs mg down and mg up on specified migrations')
    .action(Commands.refresh)
    .argument('[filenames...]', 'migration files to run', handleCommaSeparateArgs)
    .option(...(REUSABLE_OPTIONS.all as [string, string]))
    .option(...(REUSABLE_OPTIONS.force as [string, string]))
    .option(...(REUSABLE_OPTIONS.between as [string, string]))
    .option(...(REUSABLE_OPTIONS.but as [string, string]))
    .option(...(REUSABLE_OPTIONS.verbose as [string, string]))
    .option(...(REUSABLE_OPTIONS.upto as [string, string]));

mig.command('state').aliases(['ss', 'status']).action(Commands.getState);

mig.command('clean')
    .description('Removes the log for migration file(s) from the database - but does not actually rollback the changes')
    .aliases(['c', 'clear'])
    .action(Commands.clean)
    .argument('[filenames...]', 'migration files to run', handleCommaSeparateArgs);

mig.command('destroy')
    .aliases(['nuke'])
    .description('Drops all schemas except information_schema and anything that starts with pg_')
    .action(Commands.destroy)
    .option(...(REUSABLE_OPTIONS.verbose as [string, string]));

mig.command('setup')
    .aliases(['s', 'init', 'i'])
    .description('Sets up knex-mig and optionally initializes the database')
    .action(Commands.setup)
    .option(...(REUSABLE_OPTIONS.verbose as [string, string]))
    .option(
        '-d, --init-db',
        'initialize the database with schemas (this is typically needed if you nuke your database)',
        false
    );

mig.parse();
