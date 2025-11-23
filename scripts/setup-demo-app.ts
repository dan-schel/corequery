// Probably just need to replace the "corequery" dependency, but otherwise keep
// package.json as is. E.g. there may be other dependencies added by the
// specific implementation.
const packageJson = {
  type: "module",
  dependencies: {
    corequery: "file:../",
  },
};
