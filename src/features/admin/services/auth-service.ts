import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";

import { db } from "@/integrations/drizzle";
import { adminUsers } from "@/integrations/drizzle/schema";

import { ADMIN_TOKEN_MAX_AGE_SECONDS } from "../constants";

const SALT_ROUNDS = 12;

export type AdminSessionPayload = {
  adminId: string;
  email: string;
  name: string;
};

export type AuthenticatedAdmin = {
  id: string;
  email: string;
  name: string;
};

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_JWT_SECRET is missing or too short.");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAdminToken(payload: AdminSessionPayload): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + ADMIN_TOKEN_MAX_AGE_SECONDS)
    .sign(getJwtSecretKey());
}

export async function verifyToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.adminId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }

    return {
      adminId: payload.adminId,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

export async function getAdminById(id: string): Promise<AuthenticatedAdmin | null> {
  const [admin] = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      isActive: adminUsers.isActive,
    })
    .from(adminUsers)
    .where(eq(adminUsers.id, id))
    .limit(1);

  if (!admin || !admin.isActive) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
  };
}

export async function login(
  email: string,
  password: string,
): Promise<{ token: string; admin: AuthenticatedAdmin } | null> {
  const normalizedEmail = email.trim().toLowerCase();

  const [admin] = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      passwordHash: adminUsers.passwordHash,
      isActive: adminUsers.isActive,
    })
    .from(adminUsers)
    .where(and(eq(adminUsers.email, normalizedEmail), eq(adminUsers.isActive, true)))
    .limit(1);

  if (!admin) {
    return null;
  }

  const isValid = await verifyPassword(password, admin.passwordHash);
  if (!isValid) {
    return null;
  }

  const adminData: AuthenticatedAdmin = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
  };

  const token = await signAdminToken({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
  });

  return { token, admin: adminData };
}
