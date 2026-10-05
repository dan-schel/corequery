import type { EntireVehicleFormsServiceConnection } from "@/server/data/service/connection/entire-vehicle-forms-service-connection.js";
import type { GenericConnection } from "@/server/data/service/connection/generic-connection.js";

export type ServiceConnection =
  EntireVehicleFormsServiceConnection | GenericConnection;
