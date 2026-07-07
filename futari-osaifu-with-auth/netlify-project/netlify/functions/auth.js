import { isAllowedEmail, signToken } from "./_shared.js";

export default async (req, context) => {
  if (req.method !== "POST") {
    return json({ error: "method not allowed" }, 405);
  }
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return json({ error: "invalid JSON body" }, 400);
  }
  const email = String(body.email || "").trim().toLowerCase();

  if (!isAllowedEmail(email)) {
    return json({ error: "このメールアドレスは登録されていません" }, 403);
  }

  const token = signToken({
    email,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30日間有効
  });
  return json({ token });
};

export const config = { path: "/api/auth" };

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "Content-Type": "application/json" },
  });
}
