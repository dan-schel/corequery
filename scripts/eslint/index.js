import enforceImportAlias from "./enforce-import-alias.js";
import warnDebugDelayOrError from "./warn-debug-delay-or-error.js";

const plugin = {
  meta: {
    name: "custom",
    version: "1.0.0",
  },
  rules: {
    "enforce-import-alias": enforceImportAlias,
    "warn-debug-delay-or-error": warnDebugDelayOrError,
  },
};

export default plugin;
