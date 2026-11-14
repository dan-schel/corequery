export class CorequeryFilters {
  static readonly arr = "arr";
  static readonly sdo = "sdo";

  static readonly notArr = CorequeryFilters.not(CorequeryFilters.arr);
  static readonly notSdo = CorequeryFilters.not(CorequeryFilters.sdo);

  static line(lineId: number) {
    return `line:${lineId}`;
  }

  static position(positionId: number) {
    return `position:${positionId}`;
  }

  static serviceTag(serviceTag: number) {
    return `service-tag:${serviceTag}`;
  }

  static lineTag(lineTag: number) {
    return `line-tag:${lineTag}`;
  }

  static not(filterExpression: string) {
    return `!${filterExpression}`;
  }

  static or(...filterExpressions: string[]) {
    if (filterExpressions.some((x) => x.includes(" "))) {
      throw new Error("Filter expression is too complex.");
    }

    return filterExpressions.join("|");
  }

  static and(...filterExpressions: string[]) {
    return filterExpressions.join(" ");
  }

  static cnf(filterExpressions: string[][]) {
    return CorequeryFilters.and(
      ...filterExpressions.map((x) => CorequeryFilters.or(...x)),
    );
  }
}
