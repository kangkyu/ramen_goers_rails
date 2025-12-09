import { RequestHandler } from "express";
import crypto from "crypto";
import { users, addUser, findUserByEmail, PublicUser } from "./users";

const COOKIE_NAME = "auth";
const SECRET = process.env.DEV_AUTH_SECRET || "dev-secret-change";

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function sign(payload: object) {
  const body = base64url(JSON.stringify(payload));
  const sig = base64url(crypto.createHmac("sha256", SECRET).update(body).digest());
  return `${body}.${sig}`;
}

function verify(token: string): null | any {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = base64url(crypto.createHmac("sha256", SECRET).update(body).digest());
  if (expected !== sig) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

export const attachUser: RequestHandler = (req, _res, next) => {
  const cookie = req.headers.cookie || "";
  const map = Object.fromEntries(
    cookie.split(/;\s*/).filter(Boolean).map((c) => {
      const i = c.indexOf("=");
      return [decodeURIComponent(c.slice(0, i)), decodeURIComponent(c.slice(i + 1))];
    }),
  );
  const token = map[COOKIE_NAME];
  if (token) {
    const payload = verify(token);
    if (payload && payload.sub) {
      const u = users.find((x) => x.id === payload.sub);
      if (u) (req as any).user = { id: u.id, email: u.email, name: u.name } satisfies PublicUser;
    }
  }
  next();
};

function hashPassword(password: string, salt: string) {
  const key = crypto.scryptSync(password, salt, 64);
  return `${salt}:${key.toString("hex")}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, keyHex] = stored.split(":");
  const key = crypto.scryptSync(password, salt, 64).toString("hex");
  return key === keyHex;
}

export const register: RequestHandler = (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password are required" });
  if (findUserByEmail(email)) return res.status(409).json({ error: "email already registered" });
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);
  const user = addUser({ email, name: name || email.split("@")[0], passwordHash });
  const token = sign({ sub: user.id, iat: Date.now() });
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax`,
  );
  const { id } = user;
  res.status(201).json({ id, email: user.email, name: user.name } satisfies PublicUser);
};

export const login: RequestHandler = (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password are required" });
  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: "invalid credentials" });
  }
  const token = sign({ sub: user.id, iat: Date.now() });
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax`,
  );
  const { id } = user;
  res.json({ id, email: user.email, name: user.name } satisfies PublicUser);
};

export const me: RequestHandler = (req, res) => {
  const u = (req as any).user as PublicUser | undefined;
  if (!u) return res.status(204).send();
  res.json(u);
};

export const logout: RequestHandler = (_req, res) => {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  res.status(204).send();
};
