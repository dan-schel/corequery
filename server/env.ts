import z from "zod";

// Declares which environment variables CoreQuery uses.
//
// WARNING: There should be almost NO environment variables for CoreQuery, most
// (e.g. PORT, DATABASE_URL, etc.) should be implemented by the consumers of
// this package, and passed in via config (you wouldn't expect a random NPM
// package you install to read and act on env vars, right?).
//
// COREQUERY_HOT_RELOAD is an exception to this because it's designed to be set
// when developing CoreQuery itself (i.e. when working directly in this repo),
// and you want hot-reloading of the Vite frontend and server code. A consumer
// of CoreQuery cannot and would not be able to hot-reload CoreQuery's own code,
// as only the built javascript code gets bundled into the package. (The env var
// is prefixed with `COREQUERY_` to avoid possible conflicts.)

const envSchema = z.object({
  COREQUERY_HOT_RELOAD: z.coerce.boolean().default(false),
});

export const env = envSchema.parse(process.env);
