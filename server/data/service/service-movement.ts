import type { ServiceOriginatingMovement } from "@/server/data/service/service-originating-movement.js";
import type { ServicePassingMovement } from "@/server/data/service/service-passing-movement.js";
import type { ServiceRegularMovement } from "@/server/data/service/service-regular-movement.js";
import type { ServiceTerminatingMovement } from "@/server/data/service/service-terminating-movement.js";

export type ServiceMovement =
  | ServiceOriginatingMovement
  | ServiceRegularMovement
  | ServiceTerminatingMovement
  | ServicePassingMovement;

export type ServiceServicingMovement =
  | ServiceOriginatingMovement
  | ServiceRegularMovement
  | ServiceTerminatingMovement;
