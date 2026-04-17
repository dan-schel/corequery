export class WebServerLogCategory {
  constructor(private readonly _log: (message: string) => void) {}

  listeningOnPort(port: number) {
    this._log(`Server ready (http://localhost:${port})!`);
  }

  usingViteMiddleware() {
    this._log("Running with Vite middleware for hot-reloading...");
  }
}
