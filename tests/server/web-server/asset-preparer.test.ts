import { describe, expect, it } from "vitest";
import { AssetPreparer } from "../../../server/web-server/asset-preparer.js";

describe("AssetPreparer", () => {
  it("expects the format of the currently built Vite project", async () => {
    const preparer = new AssetPreparer("web/dist", {
      appName: "Corequery Test App",
      shortAppName: "CorequeryTest",
      description: "A test app for Corequery",
      version: "1.0.0",
      faviconSvgPath: "nothing.txt",
      appleTouchIconPngPath: "nothing.txt",
      pwa192PngPath: "nothing.txt",
      pwa512PngPath: "nothing.txt",
      pwaMaskable192PngPath: "nothing.txt",
      pwaMaskable512PngPath: "nothing.txt",
    });

    await expect(preparer.validateDistFolder()).resolves.not.toThrow();
  });
});
