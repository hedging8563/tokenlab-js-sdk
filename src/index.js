export const TOKENLAB_API_BASE = 'https://api.tokenlab.sh';
export const TOKENLAB_OPENAI_BASE_URL = `${TOKENLAB_API_BASE}/v1`;

function joinUrl(baseUrl, path) {
  return `${String(baseUrl).replace(/\/+$/, '')}${path}`;
}

async function parseResponse(response) {
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = body?.error?.message || body?.message || `TokenLab request failed with ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
}

export class TokenLabClient {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.TOKENLAB_API_KEY || '';
    this.apiBase = options.apiBase || TOKENLAB_API_BASE;
    this.openaiBaseURL = options.openaiBaseURL || `${this.apiBase.replace(/\/+$/, '')}/v1`;
    this.defaultHeaders = options.headers || {};
  }

  async request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.defaultHeaders,
      ...options.headers,
    };

    if (this.apiKey && !headers.Authorization && !headers['x-goog-api-key']) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(joinUrl(this.apiBase, path), {
      ...options,
      headers,
      body: options.body && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body,
    });

    return parseResponse(response);
  }

  listModels(query = {}) {
    const params = new URLSearchParams(query);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/v1/models${suffix}`, { method: 'GET' });
  }

  getModel(model) {
    return this.request(`/v1/models/${encodeURIComponent(model)}`, { method: 'GET' });
  }

  getModelPricing(model) {
    return this.request(`/v1/models/${encodeURIComponent(model)}/pricing`, { method: 'GET' });
  }

  listPricing(query = {}) {
    const params = new URLSearchParams(query);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/v1/pricing${suffix}`, { method: 'GET' });
  }

  getDiscovery() {
    return this.request('/integrations.json', { method: 'GET' });
  }

  getModelsJson() {
    return this.request('/models.json', { method: 'GET' });
  }

  getPricingJson() {
    return this.request('/pricing.json', { method: 'GET' });
  }

  createChatCompletion(body) {
    return this.request('/v1/chat/completions', { method: 'POST', body });
  }

  createResponse(body) {
    return this.request('/v1/responses', { method: 'POST', body });
  }

  evaluateDecisions(body, options = {}) {
    return this.request('/v1/systemone', { signal: options.signal, method: 'POST', body });
  }

  createAnthropicMessage(body) {
    return this.request('/v1/messages', { method: 'POST', body });
  }

  createGeminiContent(model, body) {
    return this.request(`/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: {
        'x-goog-api-key': this.apiKey,
      },
      body,
    });
  }
}

export function createTokenLabClient(options) {
  return new TokenLabClient(options);
}
