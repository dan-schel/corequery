import { describe, expect, it } from "vitest";
import { IndexHtmlPreparer } from "@/server/web-server/index-html-preparer.js";

describe("IndexHtmlPreparer", () => {
  it("correctly replaces the content", async () => {
    const preparer = new IndexHtmlPreparer("web/dist", {
      appName: "Corequery Test App",
      shortAppName: "CorequeryTest",
      description: "A test app for Corequery",
      corequeryPackageVersion: "corequery-package-version",
      serverVersion: "server-version",
    });

    const newContent = await preparer.getReplacedContent(
      false,
      "frontend-version",
    );

    expect(newContent).toContain("<title>Corequery Test App</title>");
    expect(newContent).toContain(
      '<meta name="description" content="A test app for Corequery">',
    );
    expect(newContent).toContain(
      '<meta name="corequery-app-name" content="Corequery Test App">',
    );
    expect(newContent).toContain(
      '<meta name="corequery-frontend-version" content="frontend-version">',
    );
    expect(newContent).toContain(
      '<meta name="corequery-package-version-on-last-update" content="corequery-package-version">',
    );
    expect(newContent).toContain(
      '<meta name="corequery-server-version-on-last-update" content="server-version">',
    );
  });
});
