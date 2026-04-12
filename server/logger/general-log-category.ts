export class GeneralLogCategory {
  constructor(private readonly _log: (message: string) => void) {}

  starting(
    appName: string,
    serverVersion: string,
    frontendVersion: string,
    corequeryVersion: string,
  ) {
    this._log(
      [
        `Starting ${appName}...`,
        `- Server version: ${serverVersion}`,
        `- Frontend version: ${frontendVersion}`,
        `- CoreQuery version: ${corequeryVersion}`,
      ].join("\n"),
    );
  }

  apiError(path: string, err: unknown) {
    const message =
      err instanceof Error ? (err.stack ?? err.message) : String(err);
    this._log(`500 Error handling ${path}:\n${message}`);
  }
}
