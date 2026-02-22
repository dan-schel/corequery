import type { TagsConfig } from "@/server/config/types/tags-config.js";
import type { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { checkTagsNoDuplicatesInSuccession } from "@/server/config/linting/tags/no-duplicates-in-succession.js";

export function lintTagsConfig(issues: IssueCollector, config: TagsConfig) {
  checkTagsNoDuplicatesInSuccession(issues, config);
}
