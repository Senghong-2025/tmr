import { updateCategory } from "~/server/services/categoryService";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const { userId } = await requireAuth(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Category id is required.",
    });
  }

  const body = await readBody(event);

  return updateCategory(id, userId, body);
});
