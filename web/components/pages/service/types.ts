import type { SERVICE_V0 } from "@/shared/apis";
import type { ServerResultOf } from "@/shared/apis/types";

export type ServiceData = NonNullable<
  ServerResultOf<typeof SERVICE_V0>["service"]
>;

export type MovementData = ServiceData["movements"][number];
