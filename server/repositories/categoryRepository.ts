import { query } from "~/server/database/pool";

export interface CategoryRecord {
  id: string;
  userId: string;
  name: string;
  type: string;
  createdOn: string;
}

interface CategoryRow {
  id: string;
  user_id: string;
  name: string;
  type: string;
  created_on: Date;
}

function mapCategory(row: CategoryRow): CategoryRecord {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type,
    createdOn: row.created_on.toISOString(),
  };
}

export async function listCategories(userId: string) {
  const result = await query<CategoryRow>(
    `
      SELECT id, user_id, name, type, created_on
      FROM categories
      WHERE user_id = $1
      ORDER BY name ASC
    `,
    [userId]
  );

  return result.rows.map(mapCategory);
}

export async function createCategory(payload: {
  userId: string;
  name: string;
  type: string;
}) {
  const result = await query<CategoryRow>(
    `
      INSERT INTO categories (user_id, name, type)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, name, type, created_on
    `,
    [payload.userId, payload.name, payload.type]
  );

  return mapCategory(result.rows[0]);
}

export async function updateCategory(
  id: string,
  userId: string,
  payload: {
    name: string;
    type: string;
  }
) {
  const result = await query<CategoryRow>(
    `
      UPDATE categories
      SET name = $3,
          type = $4
      WHERE id = $1
        AND user_id = $2
      RETURNING id, user_id, name, type, created_on
    `,
    [id, userId, payload.name, payload.type]
  );

  return result.rows[0] ? mapCategory(result.rows[0]) : null;
}

export async function deleteCategory(id: string, userId: string) {
  const result = await query<{ id: string }>(
    `
      DELETE FROM categories
      WHERE id = $1
        AND user_id = $2
      RETURNING id
    `,
    [id, userId]
  );

  return Boolean(result.rowCount);
}
