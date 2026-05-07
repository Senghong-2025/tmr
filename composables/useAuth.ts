import { ref } from "vue";
import type { ILogin, IRegister, IUser } from "~/models/user";

export default function useAuth() {
  const error = ref<string | null>(null);
  const loading = ref(false);

  const registerModel = ref<IRegister>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    phone: "",
    createdOn: new Date().toISOString(),
  });

  const loginModel = ref<ILogin>({
    email: "",
    password: "",
  });

  const saveSession = (userId: string, token: string, user: IUser) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const isValidPassword = () => {
    const password = registerModel.value.password;
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasLowerCase && hasNumber && password.length >= 6;
  };

  const register = async () => {
    if (!isValidPassword()) {
      return notify(
        "Password must be at least 6 characters long and contain at least one lowercase letter and one number.",
        "error"
      );
    }

    if (registerModel.value.password !== registerModel.value.confirmPassword) {
      return notify("Password does not match.", "error");
    }

    const emptyFields = Object.entries(registerModel.value)
      .filter(([key, value]) => key !== "createdOn" && value === "")
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      return notify(`Please enter ${emptyFields.join(", ")}`, "error");
    }

    loading.value = true;

    try {
      await $fetch("/api/auth/register", {
        method: "POST",
        body: registerModel.value,
      });

      navigateTo("/login");
      notify("Success", "success");
    } catch (err: any) {
      const message = getApiErrorMessage(err, "Registration failed.");
      error.value = message;
      notify(message, "error");
    } finally {
      loading.value = false;
    }
  };

  const login = async () => {
    if (!loginModel.value.email || !loginModel.value.password) {
      return notify("Please enter email and password.", "error");
    }

    loading.value = true;

    try {
      const response = await $fetch<{
        token: string;
        userId: string;
        user: IUser;
      }>("/api/auth/login", {
        method: "POST",
        body: loginModel.value,
      });

      saveSession(response.userId, response.token, response.user);
      window.location.replace(window.location.origin);
      notify("Success", "success");
    } catch (err: any) {
      const message = getApiErrorMessage(
        err,
        "Login failed. Please check your credentials."
      );
      error.value = message;
      notify(message, "error");
    } finally {
      loading.value = false;
    }
  };

  const loginWithGoogle = async () => {
    notify("Google login is not configured for PostgreSQL auth yet.", "info");
  };

  const loginWithGoogleRedirectResult = async () => false;

  const beginGoogleRedirectLogin = async () => {
    notify("Google login is not configured for PostgreSQL auth yet.", "info");
  };

  const logout = async () => {
    loading.value = true;

    try {
      await $fetch("/api/auth/logout", {
        method: "POST",
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.clear();
      loading.value = false;
      navigateTo("/login");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const isAuth = computed(() =>
    process.client ? localStorage.getItem("token") : false
  );

  return {
    register,
    error,
    loading,
    registerModel,
    login,
    loginWithGoogle,
    loginWithGoogleRedirectResult,
    beginGoogleRedirectLogin,
    loginModel,
    logout,
    isAuth,
  };
}
