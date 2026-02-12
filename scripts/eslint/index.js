import enforceImportAlias from "./enforce-import-alias.js";

const plugin = {
  meta: {
    name: "custom",
    version: "1.0.0",
  },
  rules: {
    "enforce-import-alias": enforceImportAlias,
  },
};

export default plugin;
