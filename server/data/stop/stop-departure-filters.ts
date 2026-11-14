import type {
  CustomStopDepartureFilterConfig,
  CustomStopDepartureFilterGroupConfig,
  StopDepartureFiltersConfig,
} from "@/server/config/types/get-filters-for-stop-config.js";
import type { StopPosition } from "@/server/data/stop/stop-position.js";

type StopDepartureFiltersFields = {
  readonly lines: readonly number[];
  readonly positions: readonly number[];
  readonly customGroups: readonly StopDepartureFiltersCustomGroup[];
};

export class StopDepartureFilters {
  readonly lines: readonly number[];
  readonly positions: readonly number[];
  readonly customGroups: readonly StopDepartureFiltersCustomGroup[];

  constructor(fields: StopDepartureFiltersFields) {
    this.lines = fields.lines;
    this.positions = fields.positions;
    this.customGroups = fields.customGroups;
  }

  static build(
    config: StopDepartureFiltersConfig,
    canonicalLinesServingStop: readonly number[],
    stopPositions: readonly StopPosition[],
  ) {
    return new StopDepartureFilters({
      lines: StopDepartureFilters._buildLines(
        config.lines,
        canonicalLinesServingStop,
      ),
      positions: StopDepartureFilters._buildPositions(
        config.positions,
        stopPositions,
      ),
      customGroups: config.customGroups.map((x) =>
        StopDepartureFiltersCustomGroup.build(x),
      ),
    });
  }

  private static _buildLines(
    linesConfig: StopDepartureFiltersConfig["lines"],
    canonicalLinesServingStop: readonly number[],
  ) {
    if (linesConfig === "off") return [];
    if (linesConfig === "canonical") return canonicalLinesServingStop;
    return linesConfig;
  }

  private static _buildPositions(
    positionsConfig: StopDepartureFiltersConfig["positions"],
    stopPositions: readonly StopPosition[],
  ) {
    if (positionsConfig === "off") return [];
    if (positionsConfig === "all") return stopPositions.map((p) => p.id);
    return positionsConfig;
  }
}

type StopDepartureFiltersCustomGroupFields = {
  readonly label: string;
  readonly items: StopDepartureFiltersCustomGroupItemFields[];
};

export class StopDepartureFiltersCustomGroup {
  readonly label: string;
  readonly items: StopDepartureFiltersCustomGroupItem[];

  constructor(fields: StopDepartureFiltersCustomGroupFields) {
    this.label = fields.label;
    this.items = fields.items;
  }

  static build(config: CustomStopDepartureFilterGroupConfig) {
    return new StopDepartureFiltersCustomGroup({
      label: config.label,
      items: config.items.map((x) =>
        StopDepartureFiltersCustomGroupItem.build(x),
      ),
    });
  }
}

type StopDepartureFiltersCustomGroupItemFields = {
  readonly name: string;
  readonly labelWithinGroup: string;
  readonly filterExpression: string;
};

export class StopDepartureFiltersCustomGroupItem {
  readonly name: string;
  readonly labelWithinGroup: string;
  readonly filterExpression: string;

  constructor(fields: StopDepartureFiltersCustomGroupItemFields) {
    this.name = fields.name;
    this.labelWithinGroup = fields.labelWithinGroup;
    this.filterExpression = fields.filterExpression;
  }

  static build(config: CustomStopDepartureFilterConfig) {
    return new StopDepartureFiltersCustomGroupItem({
      name: config.name,
      labelWithinGroup: config.labelWithinGroup,
      filterExpression: config.filterExpression,
    });
  }
}
