# TokenLab JavaScript SDK

Lightweight JavaScript client for TokenLab discovery, OpenAI-compatible APIs, and native endpoint families.

Install from npm:

```bash
npm install @tokenlabai/sdk
```

## Usage

```js
import { createTokenLabClient } from '@tokenlabai/sdk';

const tokenlab = createTokenLabClient({
  apiKey: process.env.TOKENLAB_API_KEY,
});

const models = await tokenlab.listModels({ category: 'chat' });
const response = await tokenlab.createResponse({
  model: 'gpt-5.5',
  input: 'Hello from TokenLab',
});
```

## Native Endpoints

```js
await tokenlab.createAnthropicMessage({
  model: 'claude-sonnet-5',
  max_tokens: 512,
  messages: [{ role: 'user', content: 'Hello' }],
});

await tokenlab.createGeminiContent('gemini-3.5-flash', {
  contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
});
```

## Discovery Helpers

```js
await tokenlab.getModelsJson();
await tokenlab.getPricingJson();
await tokenlab.getDiscovery();
```

## Base URLs

- API: `https://api.tokenlab.sh`
- OpenAI-compatible SDK base URL: `https://api.tokenlab.sh/v1`
- OpenAPI: `https://docs.tokenlab.sh/openapi.json`
