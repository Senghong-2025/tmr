import { registerUser } from "~/server/services/authService";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return registerUser(body);
});
