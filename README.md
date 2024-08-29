Roadmap:
`mig seed run` - Run seed migrations (should work on .json and .js files)
`mig seed make <name>` - Create a new seed migration (should give user option to create .json or .js file)
`mig setup` - Setup the migration environment (should create a .mig folder in the root of the project, as well as help them initialize the .env file)
`mig whoami` - Show the current user (should show the current user that is logged in) (can be used with `mig ping`)
`mig destroy` - Should wipe all of the schemas and reset knex migrations table
