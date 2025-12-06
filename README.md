# CoreQuery

## Architecture TODO

To prove it works:

- Hot reloading server code, and `COREQUERY_HOT_RELOAD` env var set by script
- Prove everything works when installed in an external repo
- Script to create demo app from external git repo
- Some mechanism to inject stuff into the built Vite project (i.e. the app name and favicons into PWA manifest, etc.)

For the real deal:

- Setup linting with ESLint and TSC
- Setup Prisma, and check it can easily swap between PostgreSQL and SQLite.
- Setup Prettier
- Setup unit tests
- Setup renovate
- Setup CI
- Setup PWA properly
