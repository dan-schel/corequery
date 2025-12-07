import z from "zod";

export const setupArgsSchema = z.object({
  source: z.literal("git"),
  gitRepoUrl: z.string(),
  branch: z.string().nullable(),
});

export type SetupArgs = z.infer<typeof setupArgsSchema>;

export function formatSetupArgs(args: SetupArgs): string {
  return `${args.source} - ${args.gitRepoUrl} (${
    args.branch ?? "default branch"
  })`;
}
