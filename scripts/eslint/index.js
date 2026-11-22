import enforceImportAlias from "./enforce-import-alias.js";
import requireApiVersionFolder from "./require-api-version-folder.js";
import isolateApiImports from "./isolate-api-imports.js";
import warnDebugDelayOrError from "./warn-debug-delay-or-error.js";

const plugin = {
  meta: {
    name: "custom",
    version: "1.0.0",
  },
  rules: {
    "enforce-import-alias": enforceImportAlias,
    "require-api-version-folder": requireApiVersionFolder,
    "isolate-api-imports": isolateApiImports,
    "warn-debug-delay-or-error": warnDebugDelayOrError,
  },
};

export default plugin;
