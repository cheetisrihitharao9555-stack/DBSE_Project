import { api } from "./api";
import type { HealthResponse } from "../types/health";

export const healthService = {
  check: async (): Promise<HealthResponse> => (await api.get<HealthResponse>("/health")).data,
};
