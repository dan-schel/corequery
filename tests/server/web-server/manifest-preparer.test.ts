import { describe, expect, it } from "vitest";
import { ManifestPreparer } from "@/server/web-server/manifest-preparer.js";

describe("ManifestPreparer", () => {
  it("correctly replaces the content", async () => {
    const preparer = new ManifestPreparer("web/dist", {
      appName: "Corequery Test App",
      shortAppName: "CorequeryTest",
      description: "A test app for Corequery",
    });

    const newContent = await preparer.getReplacedContent();

    expect(newContent).toContain('"name":"Corequery Test App"');
    expect(newContent).toContain('"short_name":"CorequeryTest"');
    expect(newContent).toContain('"description":"A test app for Corequery"');
  });
});
