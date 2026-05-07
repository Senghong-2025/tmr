import { findSessionUserId } from "~/server/repositories/sessionRepository";
import { findUserById, type UserRecord } from "~/server/repositories/userRepository";
import { hashToken } from "~/server/utils/token";

export function toPublicUser(user: UserRecord) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    phone: user.phone,
    createdOn: user.createdOn,
  };
}

export async function requireAuth(event: any) {
  const authorization = getHeader(event, "authorization") || "";
  const [, token] = authorization.match(/^Bearer\s+(.+)$/i) || [];

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Missing authentication token.",
    });
  }

  const tokenHash = await hashToken(token);
  const userId = await findSessionUserId(tokenHash);

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired session.",
    });
  }

  const user = await findUserById(userId);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not found.",
    });
  }

  return {
    token,
    tokenHash,
    user,
    userId: user.id,
  };
}
