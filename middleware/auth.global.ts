export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const token = localStorage.getItem("token");

    if (!token) {
      if (to.path !== "/login" && to.path !== "/register") {
        return navigateTo("/login");
      }
    } else {
      if (to.path === "/login" || to.path === "/register") {
        return navigateTo("/");
      }
    }
  }
});
