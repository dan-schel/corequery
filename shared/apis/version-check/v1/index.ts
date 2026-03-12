import z from "zod";
import type { Api } from "@/shared/apis/types.js";

const argsSchema = z.object({
  frontendVersion: z.string(),
  corequeryPackageVersion: z.string(),

  // Originally I thought I'd include foundationalDataHash here too, but
  // actually I want the force update mechanism to live outside the
  // <FoundationalDataProvider> on the frontend, because if it's inside it, then
  // it can't be used to rescue apps stuck loading the foundational data.
  //
  // Admitedly, it's hard to imagine an app is both (1) on an old version of the
  // app, and (2) has never successfully loaded the foundational data (because
  // if it had EVER loaded it, even an API failure should have it fall back to
  // it's cached version), but you never know what sort of freak bug couldn't
  // make it into the frontend one day, so the higher this mechanism lives in
  // the chain, the better imo.
});

const resultSchema = z.object({
  isForceUpdateOfServiceWorkerRequired: z.boolean(),
});

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/version-check/v1",
  argsSchema,
  resultSchema,
};
