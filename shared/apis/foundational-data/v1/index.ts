import z from "zod";
import type { Api } from "@/shared/apis/types.js";
import { fodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data.js";

const argsSchema = z.object({});

const resultSchema = fodaSchema;

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/foundational-data/v1",
  argsSchema,
  resultSchema,
};
