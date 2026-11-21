import { unixify } from "./utils.js";

export default {
  meta: {
    type: "problem",
    messages: {
      violation:
        "API files must be inside a version folder named, e.g. v1, v2.",
    },
    schema: [],
  },
  create: (context) => {
    const repoRelativeFileName = unixify(
      context.filename.replace(context.cwd, ""),
    );

    if (!repoRelativeFileName.startsWith("/shared/apis/")) return {};

    const parts = repoRelativeFileName.slice("/shared/apis/".length).split("/");
    if (parts.length < 2) return {};
    if (parts.length >= 3 && /^v[0-9]+$/.test(parts[1])) return {};

    return {
      Program: (node) => context.report({ node, messageId: "violation" }),
    };
  },
  defaultOptions: [],
};
