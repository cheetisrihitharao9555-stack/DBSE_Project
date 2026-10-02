export interface HealthResponse {
  status: "UP" | "DOWN";
  application: string;
  database: "UP" | "DOWN";
  timestamp: string;
}
