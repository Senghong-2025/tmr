import { requireAuth } from "~/server/utils/auth";
import { logoutUser } from "~/server/services/authService";

export default defineEventHandler(async (event) => {
  const { tokenHash } = await requireAuth(event);
  await logoutUser(tokenHash);

  return { ok: true };
});
