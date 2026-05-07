import { createCategory } from "~/server/services/categoryService";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const { userId } = await requireAuth(event);
  const body = await readBody(event);

  return createCategory(userId, body);
});
