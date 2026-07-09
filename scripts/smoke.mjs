import { TokenLabClient, TOKENLAB_OPENAI_BASE_URL, createTokenLabClient } from '../src/index.js';

const client = createTokenLabClient({ apiKey: 'test-token', apiBase: 'https://api.tokenlab.sh' });

if (!(client instanceof TokenLabClient)) {
  throw new Error('createTokenLabClient did not return TokenLabClient');
}

if (client.openaiBaseURL !== TOKENLAB_OPENAI_BASE_URL) {
  throw new Error('unexpected OpenAI-compatible base URL');
}

console.log('smoke ok');
