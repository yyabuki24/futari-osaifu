import crypto from "node:crypto";

// 許可する2人のメールアドレスとTOTPシークレット(環境変数から読み込む)
function getAllowed() {
  return {
    [String(process.env.ALLOWED_EMAIL_1 || "").toLowerCase()]: process.env.TOTP_SECRET_1,
    [String(process.env.ALLOWED_EMAIL_2 || "").toLowerCase()]: process.env.TOTP_SECRET_2,
  };
}

function base32Decode(base32) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = base32.replace(/=+$/, "").toUpperCase();
  let bits = "";
  for (const char of clean) {
    const val = alphabet.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

function generateTOTP(secretBase32, counter, digits = 6) {
  const key = base32Decode(secretBase32);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = crypto.createHmac("sha1", key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code =
    (((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)) %
    10 ** digits;
  return String(code).padStart(digits, "0");
}

export function isAllowedEmail(email) {
  const allowed = getAllowed();
  return Object.prototype.hasOwnProperty.call(allowed, email) && !!allowed[email];
}

export function verifyTOTP(email, code) {
  const allowed = getAllowed();
  const secret = allowed[email];
  if (!secret || !code) return false;
  const step = 30;
  const counter = Math.floor(Date.now() / 1000 / step);
  // 時計のズレを許容するため、前後1ステップも確認する
  for (const delta of [0, -1, 1]) {
    if (generateTOTP(secret, counter + delta) === String(code).trim()) return true;
  }
  return false;
}

function b64url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function signToken(payload) {
  const secret = process.env.SESSION_SECRET || "dev-secret-change-me";
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(crypto.createHmac("sha256", secret).update(body).digest());
  return body + "." + sig;
}

export function verifyToken(token) {
  try {
    const secret = process.env.SESSION_SECRET || "dev-secret-change-me";
    const [body, sig] = String(token).split(".");
    if (!body || !sig) return null;
    const expected = b64url(crypto.createHmac("sha256", secret).update(body).digest());
    if (expected !== sig) return null;
    const json = Buffer.from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString();
    const payload = JSON.parse(json);
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}
