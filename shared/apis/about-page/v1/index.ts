import z from "zod";
import type { Api } from "@/shared/apis/types.js";

const argsSchema = z.object({});

const resultSchema = z.object({
  primaryMarkdown: z.string(),
});

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/about-page/v1",
  argsSchema,
  resultSchema,
};
