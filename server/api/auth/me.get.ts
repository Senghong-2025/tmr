import { requireAuth, toPublicUser } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const { user } = await requireAuth(event);

  return toPublicUser(user);
});
