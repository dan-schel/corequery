import type { ServiceSourcesConfig } from "@/server/config/index.js";
import type {
  DeparturesIterationDirection,
  ServiceSource,
} from "@/server/data/service/service-source.js";
import { ZipperDeparturesIterator } from "@/server/data/service/zipper-departures-iterator.js";

export class ServiceRepository {
  constructor(private readonly _sources: readonly ServiceSource[]) {}

  static build(config: ServiceSourcesConfig) {
    return new ServiceRepository(config);
  }

  async getService(sourceId: string, intrasourceId: string) {
    const source = this._getSource(sourceId);
    if (source == null) return null;
    return await source.getService(intrasourceId);
  }

  async requireService(sourceId: string, intrasourceId: string) {
    const source = this._requireSource(sourceId);
    const service = await source.getService(intrasourceId);
    if (service == null) {
      throw new Error(`Service "${sourceId}" / "${intrasourceId}" not found.`);
    }
    return service;
  }

  getDeparturesIterator(
    stopId: number,
    instant: Temporal.Instant,
    direction: DeparturesIterationDirection,
  ) {
    const iterators = this._sources.map((s) =>
      s.getDeparturesIterator(stopId, instant, direction),
    );
    return new ZipperDeparturesIterator(iterators, direction);
  }

  private _getSource(sourceId: string): ServiceSource | null {
    return this._sources.find((s) => s.sourceId === sourceId) ?? null;
  }

  private _requireSource(sourceId: string): ServiceSource {
    const source = this._getSource(sourceId);
    if (source == null) throw new Error(`Bad service source: "${sourceId}".`);
    return source;
  }
}
