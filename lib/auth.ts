import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const DEFAULT_SECRET = "wedding_luxury_secret_session_jwt_key_2026_super_secure_royal_pass";
const SESSION_SECRET = process.env.SESSION_SECRET || DEFAULT_SECRET;
const secret = new TextEncoder().encode(SESSION_SECRET);
const COOKIE_NAME = "admin_session";

// Default fallback hash for 'admin'
const DEFAULT_ADMIN_HASH = "$2b$10$jG.dS4GwkD1jTRhkcXqUqOHsalibAW2SkvQycFmqMAqGJmAlmIJdu";

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  if (username !== expectedUsername) return false;

  const expectedHash = process.env.ADMIN_PASSWORD_HASH || DEFAULT_ADMIN_HASH;

  try {
    const isMatch = await bcrypt.compare(password, expectedHash);
    if (isMatch) return true;
  } catch {
    // If bcrypt compare fails for any reason, continue to fallback check
  }

  // Fallback direct check for default or explicit ADMIN_PASSWORD
  const fallbackPassword = process.env.ADMIN_PASSWORD || "admin";
  return password === fallbackPassword;
}

export async function createAdminSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60, // 12 hours
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}