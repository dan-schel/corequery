import path from "path";
import { unixify } from "./utils.js";

export default {
  meta: {
    type: "problem",
    messages: {
      violation: "Replace relative import with {{ replacement }}.",
    },
    schema: [],
    fixable: "code",
  },
  create: (context) => {
    return {
      ImportDeclaration: (node) => {
        const repoRelativeFileName = unixify(
          context.filename.replace(context.cwd, ""),
        );

        // ESLint config doesn't use import aliases.
        if (repoRelativeFileName.startsWith("/scripts/eslint/")) return;
        if (repoRelativeFileName.startsWith("/eslint.config.js")) return;

        const value = node.source.value;
        if (!value.startsWith(".")) return;

        const absolutePath = path.resolve(
          path.dirname(context.filename),
          value,
        );
        const aliasedPath = unixify(absolutePath.replace(context.cwd, "@"));
        const replacement = `"${aliasedPath}"`;

        context.report({
          loc: node.source.loc,
          messageId: "violation",
          data: {
            replacement,
          },
          fix: (fixer) => {
            return fixer.replaceText(node.source, replacement);
          },
        });
      },
    };
  },
  defaultOptions: [],
};
