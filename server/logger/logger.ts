import { GeneralLogCategory } from "@/server/logger/general-log-category.js";
import { WebServerLogCategory } from "@/server/logger/web-server-log-category.js";

export abstract class Logger {
  readonly general: GeneralLogCategory;
  readonly webServer: WebServerLogCategory;

  constructor() {
    const logFunc = this.log.bind(this);

    this.general = new GeneralLogCategory(logFunc);
    this.webServer = new WebServerLogCategory(logFunc);
  }

  protected abstract log(message: string): void;
}
