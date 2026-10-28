import type { SERVICE_V0 } from "@/shared/apis";
import type { ResultOf } from "@/shared/apis/types";

export type ServiceData = NonNullable<ResultOf<typeof SERVICE_V0>["service"]>;

export type MovementData = ServiceData["movements"][number];
