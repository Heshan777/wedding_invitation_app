import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const DEFAULT_SECRET = "wedding_luxury_secret_session_jwt_key_2026_super_secure_royal_pass";
const SESSION_SECRET = process.env.SESSION_SECRET || DEFAULT_SECRET;
const secret = new TextEncoder().encode(SESSION_SECRET);
const COOKIE_NAME = "admin_session";

export interface SessionPayload {
  managerId: string;
  username: string;
  name: string;
  role: string;
}

// Authenticate an Event Manager with username/email & password
export async function verifyManagerCredentials(
  identifier: string,
  password: string
): Promise<{
  id: string;
  username: string;
  name: string;
  role: string;
  email?: string | null;
  company?: string | null;
  phone?: string | null;
} | null> {
  const cleanId = identifier.trim().toLowerCase();

  // Look up manager by username or email
  const manager = await prisma.eventManager.findFirst({
    where: {
      OR: [
        { username: cleanId },
        { email: cleanId },
      ],
    },
  });

  if (manager) {
    const isMatch = await bcrypt.compare(password, manager.password);
    if (isMatch) {
      return {
        id: manager.id,
        username: manager.username,
        name: manager.name,
        role: manager.role,
        email: manager.email,
        company: manager.company,
        phone: manager.phone,
      };
    }
  }

  // Fallback check against environment credentials for bootstrap safety
  const expectedUsername = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
  if (cleanId === expectedUsername) {
    const fallbackPassword = process.env.ADMIN_PASSWORD || "admin";
    if (password === fallbackPassword) {
      // Return or create default admin manager
      let defaultMgr = await prisma.eventManager.findUnique({ where: { username: "admin" } });
      if (!defaultMgr) {
        const hashedPassword = await bcrypt.hash(fallbackPassword, 10);
        defaultMgr = await prisma.eventManager.create({
          data: {
            username: "admin",
            password: hashedPassword,
            name: "Lead Wedding Planner",
            company: "Royal Digital Wedding Suite",
            role: "SUPER_ADMIN",
          },
        });
      }
      return {
        id: defaultMgr.id,
        username: defaultMgr.username,
        name: defaultMgr.name,
        role: defaultMgr.role,
        email: defaultMgr.email,
        company: defaultMgr.company,
        phone: defaultMgr.phone,
      };
    }
  }

  return null;
}

// Legacy wrapper
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const mgr = await verifyManagerCredentials(username, password);
  return mgr !== null;
}

// Create secure manager session cookie with full profile payload
export async function createManagerSession(manager: {
  id: string;
  username: string;
  name: string;
  role: string;
  email?: string | null;
  company?: string | null;
  phone?: string | null;
}) {
  const token = await new SignJWT({
    managerId: manager.id,
    username: manager.username,
    name: manager.name,
    role: manager.role,
    email: manager.email || "",
    company: manager.company || "",
    phone: manager.phone || "",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

// Legacy wrapper
export async function createAdminSession() {
  const defaultMgr = await prisma.eventManager.findFirst();
  if (defaultMgr) {
    await createManagerSession({
      id: defaultMgr.id,
      username: defaultMgr.username,
      name: defaultMgr.name,
      role: defaultMgr.role,
      email: defaultMgr.email,
      company: defaultMgr.company,
      phone: defaultMgr.phone,
    });
  } else {
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Get the authenticated manager from current session (0ms in-memory verification)
export async function getAuthenticatedManager() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const managerId = payload.managerId as string | undefined;

    // High-Performance Fast Path: Return directly from cryptographically verified JWT payload (0ms, 0 DB roundtrips)
    if (managerId && payload.username && payload.name && payload.role) {
      return {
        id: managerId,
        username: payload.username as string,
        name: payload.name as string,
        role: payload.role as string,
        email: (payload.email as string) || null,
        company: (payload.company as string) || null,
        phone: (payload.phone as string) || null,
      };
    }

    if (managerId) {
      const manager = await prisma.eventManager.findUnique({
        where: { id: managerId },
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          company: true,
          phone: true,
          role: true,
        },
      });
      if (manager) return manager;
    }

    // Fallback if legacy token has no managerId
    const firstMgr = await prisma.eventManager.findFirst({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        company: true,
        phone: true,
        role: true,
      },
    });
    return firstMgr;
  } catch {
    return null;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const mgr = await getAuthenticatedManager();
  return mgr !== null;
}