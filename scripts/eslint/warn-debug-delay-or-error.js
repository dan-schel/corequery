import { unixify } from "./utils.js";

export default {
  meta: {
    type: "problem",
    messages: {
      violation: "Remember to remove {{ value }}.",
    },
    schema: [],
  },
  create: (context) => {
    return {
      Program: () => {
        const repoRelativeFileName = unixify(
          context.filename.replace(context.cwd, ""),
        );

        // The file where they're defined is an exception.
        if (repoRelativeFileName === "/web/hooks/use-api.ts") return;

        const sourceCode = context.sourceCode;
        const text = sourceCode.getText();
        const pattern = /\b(debugDelay|debugError)\b/g;

        let match;
        while ((match = pattern.exec(text)) !== null) {
          const value = match[1];
          const start = sourceCode.getLocFromIndex(match.index);
          const end = sourceCode.getLocFromIndex(match.index + value.length);

          context.report({
            loc: { start, end },
            messageId: "violation",
            data: {
              value,
            },
          });
        }
      },
    };
  },
  defaultOptions: [],
};
