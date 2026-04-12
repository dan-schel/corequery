/* eslint-disable no-console */

import { Logger } from "@/server/logger/logger.js";

export class ConsoleLogger extends Logger {
  protected log(message: string) {
    console.log(message);
  }
}
