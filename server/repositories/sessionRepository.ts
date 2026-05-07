import { query } from "~/server/database/pool";

export async function createSession(payload: {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}) {
  await query(
    `
      INSERT INTO sessions (token_hash, user_id, expires_at)
      VALUES ($1, $2, $3)
    `,
    [payload.tokenHash, payload.userId, payload.expiresAt]
  );
}

export async function findSessionUserId(tokenHash: string) {
  const result = await query<{ user_id: string }>(
    `
      SELECT user_id
      FROM sessions
      WHERE token_hash = $1
        AND expires_at > now()
      LIMIT 1
    `,
    [tokenHash]
  );

  return result.rows[0]?.user_id ?? null;
}

export async function deleteSession(tokenHash: string) {
  await query(
    `
      DELETE FROM sessions
      WHERE token_hash = $1
    `,
    [tokenHash]
  );
}

export async function deleteExpiredSessions() {
  await query(
    `
      DELETE FROM sessions
      WHERE expires_at <= now()
    `
  );
}
