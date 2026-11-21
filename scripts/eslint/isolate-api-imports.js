import { unixify } from "./utils.js";

const exceptions = [
  "zod",
  "@/shared/apis/foda-synced-result.js",
  "@/shared/apis/types.js",
];

const apiCodeRegex = /^\/shared\/apis\/[^\/]+\/v[0-9]\//;

export default {
  meta: {
    type: "problem",
    messages: {
      violation:
        "API schemas should be isolated from other code, so that breaking changes are introduced explicitly and intentionally.",
    },
    schema: [],
  },
  create: (context) => {
    const repoRelativeFileName = unixify(
      context.filename.replace(context.cwd, ""),
    );
    const match = repoRelativeFileName.match(apiCodeRegex);
    if (!match) return {};

    return {
      ImportDeclaration: (node) => {
        const value = node.source.value;
        if (exceptions.includes(value)) return;

        const myApi = match[0];
        if (value.startsWith(`@${myApi}`)) return;

        context.report({ node, messageId: "violation" });
      },
    };
  },
  defaultOptions: [],
};
