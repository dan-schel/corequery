import z from "zod";
import type { Api } from "@/shared/apis/types";
import { foundationalDataSchema } from "@/shared/apis/foundational-data/v1/foundational-data";

const argsSchema = z.object({});

const resultSchema = foundationalDataSchema;

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/foundational-data/v1",
  argsSchema,
  resultSchema,
};
