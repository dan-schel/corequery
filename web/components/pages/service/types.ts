import type { SERVICE_V0 } from "@/shared/apis";
import type { ClientResultOf } from "@/web/hooks/api/types";

export type ServiceData = NonNullable<
  ClientResultOf<typeof SERVICE_V0>["service"]
>;

export type MovementData = ServiceData["movements"][number];
