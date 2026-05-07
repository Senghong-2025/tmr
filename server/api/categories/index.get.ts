import { listCategories } from "~/server/services/categoryService";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const { userId } = await requireAuth(event);

  return listCategories(userId);
});
