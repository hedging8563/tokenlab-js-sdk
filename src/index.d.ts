export declare const TOKENLAB_API_BASE = "https://api.tokenlab.sh";
export declare const TOKENLAB_OPENAI_BASE_URL = "https://api.tokenlab.sh/v1";

export type TokenLabClientOptions = {
  apiKey?: string;
  apiBase?: string;
  openaiBaseURL?: string;
  headers?: Record<string, string>;
};

export type ModelListQuery = {
  provider?: string;
  tag?: string;
  category?: string;
  recommended_for?: string;
};

export type PricingQuery = {
  provider?: string;
  tag?: string;
};

export declare class TokenLabClient {
  apiKey: string;
  apiBase: string;
  openaiBaseURL: string;
  defaultHeaders: Record<string, string>;
  constructor(options?: TokenLabClientOptions);
  request<T = unknown>(path: string, options?: RequestInit & { body?: unknown }): Promise<T>;
  listModels<T = unknown>(query?: ModelListQuery): Promise<T>;
  getModel<T = unknown>(model: string): Promise<T>;
  getModelPricing<T = unknown>(model: string): Promise<T>;
  listPricing<T = unknown>(query?: PricingQuery): Promise<T>;
  getDiscovery<T = unknown>(): Promise<T>;
  getModelsJson<T = unknown>(): Promise<T>;
  getPricingJson<T = unknown>(): Promise<T>;
  createChatCompletion<T = unknown>(body: unknown): Promise<T>;
  createResponse<T = unknown>(body: unknown): Promise<T>;
  createAnthropicMessage<T = unknown>(body: unknown): Promise<T>;
  createGeminiContent<T = unknown>(model: string, body: unknown): Promise<T>;
}

export declare function createTokenLabClient(options?: TokenLabClientOptions): TokenLabClient;
