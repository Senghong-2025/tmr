import { query } from "~/server/database/pool";

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string | null;
  username: string;
  phone: string;
  createdOn: string;
}

interface UserRow {
  id: string;
  email: string;
  password_hash: string | null;
  username: string;
  phone: string;
  created_on: Date;
}

function mapUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    username: row.username,
    phone: row.phone,
    createdOn: row.created_on.toISOString(),
  };
}

export async function createUser(payload: {
  email: string;
  passwordHash: string;
  username: string;
  phone: string;
}) {
  const result = await query<UserRow>(
    `
      INSERT INTO users (email, password_hash, username, phone)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, password_hash, username, phone, created_on
    `,
    [payload.email, payload.passwordHash, payload.username, payload.phone]
  );

  return mapUser(result.rows[0]);
}

export async function findUserByEmail(email: string) {
  const result = await query<UserRow>(
    `
      SELECT id, email, password_hash, username, phone, created_on
      FROM users
      WHERE lower(email) = lower($1)
      LIMIT 1
    `,
    [email]
  );

  return result.rows[0] ? mapUser(result.rows[0]) : null;
}

export async function findUserById(id: string) {
  const result = await query<UserRow>(
    `
      SELECT id, email, password_hash, username, phone, created_on
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  return result.rows[0] ? mapUser(result.rows[0]) : null;
}
