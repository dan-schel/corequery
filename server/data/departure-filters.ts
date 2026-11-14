import type {
  CustomFilterConfig,
  CustomFilterGroupConfig,
  DepartureFiltersConfig,
} from "@/server/config/types/get-filters-for-stop-config.js";
import type { StopPosition } from "@/server/data/stop-position.js";

type DepartureFiltersFields = {
  readonly lines: readonly number[];
  readonly positions: readonly number[];
  readonly customGroups: readonly DepartureFiltersCustomGroup[];
};

export class DepartureFilters {
  readonly lines: readonly number[];
  readonly positions: readonly number[];
  readonly customGroups: readonly DepartureFiltersCustomGroup[];

  constructor(fields: DepartureFiltersFields) {
    this.lines = fields.lines;
    this.positions = fields.positions;
    this.customGroups = fields.customGroups;
  }

  static build(
    config: DepartureFiltersConfig,
    canonicalLinesServingStop: readonly number[],
    stopPositions: readonly StopPosition[],
  ) {
    return new DepartureFilters({
      lines: DepartureFilters._buildLines(
        config.lines,
        canonicalLinesServingStop,
      ),
      positions: DepartureFilters._buildPositions(
        config.positions,
        stopPositions,
      ),
      customGroups: config.customGroups.map((x) =>
        DepartureFiltersCustomGroup.build(x),
      ),
    });
  }

  private static _buildLines(
    linesConfig: DepartureFiltersConfig["lines"],
    canonicalLinesServingStop: readonly number[],
  ) {
    if (linesConfig === "off") return [];
    if (linesConfig === "canonical") return canonicalLinesServingStop;
    return linesConfig;
  }

  private static _buildPositions(
    positionsConfig: DepartureFiltersConfig["positions"],
    stopPositions: readonly StopPosition[],
  ) {
    if (positionsConfig === "off") return [];
    if (positionsConfig === "all") return stopPositions.map((p) => p.id);
    return positionsConfig;
  }
}

type DepartureFiltersCustomGroupFields = {
  readonly label: string;
  readonly items: DepartureFiltersCustomGroupItemFields[];
};

export class DepartureFiltersCustomGroup {
  readonly label: string;
  readonly items: DepartureFiltersCustomGroupItem[];

  constructor(fields: DepartureFiltersCustomGroupFields) {
    this.label = fields.label;
    this.items = fields.items;
  }

  static build(config: CustomFilterGroupConfig) {
    return new DepartureFiltersCustomGroup({
      label: config.label,
      items: config.items.map((x) => DepartureFiltersCustomGroupItem.build(x)),
    });
  }
}

type DepartureFiltersCustomGroupItemFields = {
  readonly name: string;
  readonly labelWithinGroup: string;
  readonly filterExpression: string;
};

export class DepartureFiltersCustomGroupItem {
  readonly name: string;
  readonly labelWithinGroup: string;
  readonly filterExpression: string;

  constructor(fields: DepartureFiltersCustomGroupItemFields) {
    this.name = fields.name;
    this.labelWithinGroup = fields.labelWithinGroup;
    this.filterExpression = fields.filterExpression;
  }

  static build(config: CustomFilterConfig) {
    return new DepartureFiltersCustomGroupItem({
      name: config.name,
      labelWithinGroup: config.labelWithinGroup,
      filterExpression: config.filterExpression,
    });
  }
}
