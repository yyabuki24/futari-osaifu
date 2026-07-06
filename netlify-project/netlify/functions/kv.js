import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("futari-osaifu-data");
  const url = new URL(req.url);

  if (req.method === "GET") {
    const key = url.searchParams.get("key");
    if (!key) return json({ error: "key is required" }, 400);
    const value = await store.get(key);
    return json({ key, value });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return json({ error: "invalid JSON body" }, 400);
    }
    const { key, value } = body || {};
    if (!key) return json({ error: "key is required" }, 400);
    await store.set(key, value == null ? "" : String(value));
    return json({ ok: true });
  }

  return json({ error: "method not allowed" }, 405);
};

export const config = { path: "/api/kv" };

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "Content-Type": "application/json" },
  });
}
