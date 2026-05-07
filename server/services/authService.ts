import { deleteExpiredSessions, deleteSession, createSession } from "~/server/repositories/sessionRepository";
import { createUser, findUserByEmail } from "~/server/repositories/userRepository";
import { hashPassword, verifyPassword } from "~/server/utils/password";
import { createSessionToken, hashToken } from "~/server/utils/token";
import { toPublicUser } from "~/server/utils/auth";

const sessionDays = 30;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function validatePassword(password: string) {
  return /[a-z]/.test(password) && /[0-9]/.test(password) && password.length >= 6;
}

async function issueSession(userId: string) {
  const token = createSessionToken();
  const tokenHash = await hashToken(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + sessionDays);

  await createSession({
    tokenHash,
    userId,
    expiresAt,
  });

  return token;
}

export async function registerUser(payload: {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  phone?: string;
}) {
  const email = normalizeEmail(payload.email || "");
  const password = payload.password || "";
  const username = payload.username?.trim() || "";
  const phone = payload.phone?.trim() || "";

  if (!email || !password || !username || !phone) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please enter username, phone, email, and password.",
    });
  }

  if (password !== payload.confirmPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password does not match.",
    });
  }

  if (!validatePassword(password)) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Password must be at least 6 characters long and contain at least one lowercase letter and one number.",
    });
  }

  try {
    const user = await createUser({
      email,
      passwordHash: await hashPassword(password),
      username,
      phone,
    });

    return toPublicUser(user);
  } catch (error: any) {
    if (error?.code === "23505") {
      throw createError({
        statusCode: 409,
        statusMessage: "Email is already registered.",
      });
    }

    throw error;
  }
}

export async function loginUser(payload: { email?: string; password?: string }) {
  const email = normalizeEmail(payload.email || "");
  const password = payload.password || "";

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please enter email and password.",
    });
  }

  const user = await findUserByEmail(email);

  if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    throw createError({
      statusCode: 401,
      statusMessage: "Login failed. Please check your credentials.",
    });
  }

  await deleteExpiredSessions();
  const token = await issueSession(user.id);

  return {
    token,
    userId: user.id,
    user: toPublicUser(user),
  };
}

export async function logoutUser(tokenHash: string) {
  await deleteSession(tokenHash);
}
