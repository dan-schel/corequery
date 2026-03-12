import { describe, expect, it } from "vitest";
import { IndexHtmlPreparer } from "@/server/web-server/index-html-preparer.js";

describe("IndexHtmlPreparer", () => {
  it("correctly replaces the content", async () => {
    const preparer = new IndexHtmlPreparer("web/dist", {
      appName: "Corequery Test App",
      shortAppName: "CorequeryTest",
      description: "A test app for Corequery",
      frontendVersion: "abc123",
      corequeryPackageVersion: "def456",
    });

    const newContent = await preparer.getReplacedContent();

    expect(newContent).toContain("<title>Corequery Test App</title>");
    expect(newContent).toContain(
      '<meta name="description" content="A test app for Corequery">',
    );
    expect(newContent).toContain(
      '<meta name="corequery-app-name" content="Corequery Test App">',
    );
    expect(newContent).toContain(
      '<meta name="corequery-frontend-version" content="abc123">',
    );
    expect(newContent).toContain(
      '<meta name="corequery-package-version" content="def456">',
    );
  });
});
