import { describe, expect, it } from "vitest";
import { ServiceWorkerPreparer } from "../../../server/web-server/service-worker-preparer.js";
import { AssetPreparer } from "../../../server/web-server/asset-preparer.js";

describe("ServiceWorkerPreparer", () => {
  it("correctly replaces the content", async () => {
    const preparer = new ServiceWorkerPreparer("web/dist", {
      filesReplaced: AssetPreparer.ALL_MODIFIED_FILES,
      getFileHash: async (_filePath: string) => "bacon",
    });

    const newContent = await preparer.getReplacedContent();

    expect(newContent).toContain('{url:"index.html",revision:"bacon"}');
    expect(newContent).toContain(
      '{url:"manifest.webmanifest",revision:"bacon"}',
    );
    expect(newContent).toContain('{url:"favicon.svg",revision:"bacon"}');
    expect(newContent).toContain('{url:"pwa-192x192.png",revision:"bacon"}');

    // This is expected to appear in the manifest twice, and we should replace
    // it both times.
    expect(newContent).toMatch(
      /{url:"pwa-192x192\.png",revision:"bacon"}.+{url:"pwa-192x192\.png",revision:"bacon"}/g,
    );
  });
});
