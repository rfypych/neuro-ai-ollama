export interface RatelimitConfig {
  interval: number;
  uniqueTokenPerInterval: number;
}

export interface RatelimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export interface Ratelimit {
  limit: (identifier: string) => Promise<RatelimitResponse>;
} 