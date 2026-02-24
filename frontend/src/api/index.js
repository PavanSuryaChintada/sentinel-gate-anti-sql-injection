const API_BASE = '';

async function safeJson(res) {
  const text = await res.text();
  if (!text) {
    return { status: 'error', message: 'Empty response from server', statusCode: res.status };
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    return { status: 'error', message: 'Invalid JSON from server', statusCode: res.status, raw: text };
  }
}

export async function queryEndpoint(type, input, table = 'secrets', testCase = null) {
  const body = { chat_input: input, table };
  if (testCase) body.test_case = testCase;
  const res = await fetch(`${API_BASE}/query/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return safeJson(res);
}

export async function chatEndpoint(type, message) {
  const res = await fetch(`${API_BASE}/chat/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return safeJson(res);
}

export async function resetDatabase() {
  const res = await fetch(`${API_BASE}/reset`, { method: 'GET' });
  return safeJson(res);
}
