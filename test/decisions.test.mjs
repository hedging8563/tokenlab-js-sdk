import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import test from 'node:test';
import { TokenLabClient } from '../src/index.js';

test('decisions preserve native payload, result, errors and cancellation without retries', async t => {
  const requests = [];
  const answer = { model: 'jev-1.13', answers: { refund: { type: 'noul', noul: 0.8 } }, usage: { input_tokens: 20, output_tokens: 3 } };
  let status = 200;
  const server = createServer(async (req, res) => {
    let raw = ''; for await (const chunk of req) raw += chunk;
    requests.push({ path: req.url, auth: req.headers.authorization, body: JSON.parse(raw) });
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status === 200 ? answer : { error: { code: 'invalid_request', message: 'Invalid question' }, retryable: false }));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const client = new TokenLabClient({ apiKey: 'sk-test', apiBase: `http://127.0.0.1:${server.address().port}` });
  const body = { model: 'jev-1.13', state: { ticket: 'Refund requested' }, questions: { refund: { type: 'noul', instructions: 'Is a refund requested?' } } };
  assert.deepEqual(await client.evaluateDecisions(body), answer);
  assert.deepEqual(requests[0], { path: '/v1/systemone', auth: 'Bearer sk-test', body });
  status = 400;
  await assert.rejects(client.evaluateDecisions(body), err => err.status === 400 && err.body.error.code === 'invalid_request');
  await assert.rejects(client.evaluateDecisions(body, { signal: AbortSignal.abort() }), { name: 'AbortError' });
  assert.equal(requests.length, 2);
});
