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
}
