import { loginUser } from "~/server/services/authService";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return loginUser(body);
});
