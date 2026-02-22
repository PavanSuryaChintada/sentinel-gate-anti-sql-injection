const API_BASE = '';

export async function queryEndpoint(type, input, table = 'secrets', testCase = null) {
  const body = { chat_input: input, table };
  if (testCase) body.test_case = testCase;
  const res = await fetch(`${API_BASE}/query/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function chatEndpoint(type, message) {
  const res = await fetch(`${API_BASE}/chat/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return res.json();
}

export async function resetDatabase() {
  const res = await fetch(`${API_BASE}/reset`, { method: 'GET' });
  return res.json();
}
