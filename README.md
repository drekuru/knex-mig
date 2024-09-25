<!-- align in center and make font large: text should be Knex Mig-->
<div align="center" > 
<!-- <div style="align:center">  -->
  <h1 style="font-size:45px"> Knex Mig</h1>
<p style="font-size: 16px"> CLI tool built on top of knex.js for managing migrations and seeds for PostgreSQL</p>
<!-- <P style="font-size: 14px"> Disclaimer: This is a work in progress and currently only tested with PostgreSQL -->
</div>

## Features

-   Atomic operations
-   Automatic rollback on error
-   Seeding
-   Transaction support
-   Migration locking
-   Multi environment support
-   Selective/Partial migration

## Installation

```bash
npm install -g knex-mig
```

## Usage

To get started, run `mg -h` to see the available commands and options.

1. To get the directories needed for the migrator to function properly, run `mg setup`. This will create some directories in your `$USER_HOME` directory.

```bash
mg setup
```

2. To setup a connection to a new database, we need to generate a new configuration file. Run `mg env generate <filename>` to generate a new configuration file. This will generate a new `sample.env` file from where you ran the command.

```bash
mg env g local-db
```

3. Open up the generated file and fill in the necessary details for your database connection.

4. Once you're done editing the necessary details, run `mg env add <filename>` to add the configuration to the migrator context. This will copy the file into the migrator's configuration directory. Note: Once added, you can always run a command to edit the file directly in the migrator config directory.

```bash
# we can use the -d flag to also automatically set the new file as the current configuration/context
mg env a ./local-db.env -d
```

5. Now the file is added to the migrator context, however we need to set it as the current context. To do this, run `mg env set <filename>`.

```bash
mg env set local-db.env
```

6. To generate a new migration file, run `mg make <name>`. This will generate a new migration file in the migrations directory that you specified in the `.env` file.

```bash
mg make users
```

7. Edit the generated file as necessary
8. To see a list of available migrations, and their current state run `mg state`.

```bash
mg ss
```

9. To run a migration file, do `mg up <filename>`. This will run the migration file and update the state of the migration in the database.

```bash
# we can use the file number instead of the name (in this case it would be `mig up 1` since it's our first migration)
mg up users
```

For more information on the available commands, run `mg -h`.

### Feature Roadmap:

-   `mig seed make <name>` - Create a new seed migration (should give user option to create .json or .js file)
-   add support for .sql files
-   `mig make <name>` - this exists but need to add option to create a .sql file
