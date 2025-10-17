/* eslint-disable @typescript-eslint/no-require-imports */
// lib/auth.ts - FIXED ESLINT WARNING
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY ||
    "your-super-secret-jwt-key-change-this-in-production"
);

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

interface TokenPayload {
  username: string;
  role: string;
  iat: number;
  exp: number;
}

// Generate JWT token
export async function generateToken(
  username: string,
  role: string = "admin"
): Promise<string> {
  const token = await new SignJWT({ username, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET_KEY);

  return token;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as TokenPayload;
  } catch {
    // FIXED: Removed unused 'error' variable
    return null;
  }
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  (await cookies()).set({
    name: "admin_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

// Get auth token from cookie
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  return token?.value || null;
}

// Remove auth cookie
export async function removeAuthCookie() {
  (await cookies()).delete("admin_token");
}

// Verify admin credentials
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const bcrypt = require("bcryptjs");

  if (!ADMIN_PASSWORD_HASH) {
    console.error("❌ Missing ADMIN_PASSWORD_HASH env variable");
    return false;
  }

  const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  const isValid = username === ADMIN_USERNAME && passwordMatch;

  console.log("DEBUG verifyAdminCredentials:", { username, passwordMatch, isValid });
  return isValid;
}

// Check if user is authenticated (server-side)
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const payload = await verifyToken(token);
  return payload !== null;
}

// Get current user (server-side)
export async function getCurrentUser(): Promise<TokenPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;

  return await verifyToken(token);
}

// Middleware helper
export async function requireAuth(): Promise<TokenPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}