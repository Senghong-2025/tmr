export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) return;

  const token = localStorage.getItem("token");
  const isAuthPage = ["/login", "/register"].includes(to.path);

  if (!token && !isAuthPage) {
    return navigateTo("/login");
  }

  if (token && isAuthPage) {
    return navigateTo("/");
  }
});
