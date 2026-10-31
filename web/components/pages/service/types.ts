import type { SERVICE_V0 } from "@/shared/apis";
import type { ClientFodaSyncedResultOf } from "@/web/hooks/api/types";

export type ServiceData = NonNullable<
  ClientFodaSyncedResultOf<typeof SERVICE_V0>["service"]
>;

export type MovementData = ServiceData["movements"][number];
