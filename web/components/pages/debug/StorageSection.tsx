import { useEffect, useState } from "preact/hooks";
import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { AsyncFieldValue } from "@/web/components/pages/debug/AsyncFieldValue";
import { formatBytes } from "@/web/components/pages/debug/utils/format-bytes";
import { Alert } from "@/web/components/Alert";

export function StorageSection() {
  const [estimate, setEstimate] = useState<StorageEstimate | null>(null);
  const [loading, setLoading] = useState(true);
  const [hadError, setHadError] = useState(false);

  useEffect(() => {
    async function loadEstimate() {
      setLoading(true);
      setHadError(false);

      try {
        const result = await navigator.storage.estimate();
        setEstimate(result);
      } catch (e) {
        console.warn("An error occurred while retrieving storage metrics.", e);
        setHadError(true);
      } finally {
        setLoading(false);
      }
    }
    void loadEstimate();
  }, []);

  const usage = estimate?.usage != null ? formatBytes(estimate.usage) : null;
  const quota = estimate?.quota != null ? formatBytes(estimate.quota) : null;

  return (
    <Column class="gap-6">
      <TextBlock style="strong">On-device storage</TextBlock>
      {hadError && (
        <Alert type="error">
          <TextBlock>
            An error occurred while retrieving storage metrics.
          </TextBlock>
        </Alert>
      )}
      <Column class="gap-4 empty:hidden">
        <AsyncFieldValue
          prefix="Storage used"
          value={usage}
          loading={loading}
        />
        <AsyncFieldValue
          prefix="Storage quota"
          value={quota}
          loading={loading}
        />
      </Column>
    </Column>
  );
}
