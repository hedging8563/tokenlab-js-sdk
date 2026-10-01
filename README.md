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

## System One decisions

Discover `await tokenlab.listModels({ category: 'decision' })` and inspect the selected model with `getModel()` first. Decision models declare the `systemone` public operation, not a chat format.

```javascript
const decision = await tokenlab.evaluateDecisions({
  model: 'jev-1.13',
  state: { ticket: 'Please refund my duplicate charge.' },
  questions: { refund: { type: 'noul', instructions: 'Is a refund requested?' } },
}, { signal: AbortSignal.timeout(60_000) });
console.log(decision.answers, decision.usage);
```

This synchronous `/v1/systemone` call preserves typed answers, probabilities, optional confidence, and usage. It is not Chat, streaming, or Batch. A decision does not authorize a refund or another side effect. Errors are returned without automatic resubmission. Available in SDK 0.1.2+.

## Base URLs

- API: `https://api.tokenlab.sh`
- OpenAI-compatible SDK base URL: `https://api.tokenlab.sh/v1`
- OpenAPI: `https://tokenlab.sh/docs/openapi.json`
