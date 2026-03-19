import { ref } from "vue";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { ILogin, IRegister, IUser } from "~/models/user";

export default function useAuth() {
  const error = ref<string | null>(null);
  const loading = ref(false);
  const { $db, $auth } = useNuxtApp();

  const registerModel = ref<IRegister>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    phone: "",
    createdOn: new Date().toISOString(),
  });

  const saveSession = async (userId: string, token: string) => {
    const docRef = doc($db, "users", userId);
    const docSnap = await getDoc(docRef);
    const userData = docSnap.data();

    localStorage.setItem("userId", userId);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const ensureUserProfile = async (payload: {
    uid: string;
    email: string;
    username: string;
    phone?: string;
  }) => {
    const docRef = doc($db, "users", payload.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        email: payload.email,
        username: payload.username,
        phone: payload.phone ?? "",
        createdOn: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      });
      return;
    }

    const currentData = docSnap.data();
    await setDoc(
      docRef,
      {
        email: payload.email,
        username: currentData.username || payload.username,
        phone: currentData.phone || payload.phone || "",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const isEmbeddedAuthContext = () => {
    if (!process.client) return false;

    const inIframe = (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();

    const isElectron =
      navigator.userAgent.toLowerCase().includes("electron") ||
      navigator.userAgent.toLowerCase().includes("wv");

    return inIframe || isElectron;
  };

  const finalizeGoogleLogin = async (user: { uid: string; email: string | null; displayName: string | null; getIdToken: () => Promise<string> }) => {
    const fallbackUsername =
      user.displayName || user.email?.split("@")[0] || "Google User";

    await ensureUserProfile({
      uid: user.uid,
      email: user.email || "",
      username: fallbackUsername,
    });

    const token = await user.getIdToken();
    await saveSession(user.uid, token);
    window.location.replace(window.location.origin);
    notify("Success", "success");
  };

  const beginGoogleRedirectLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    sessionStorage.setItem("google-auth-pending", "1");
    await signInWithRedirect($auth, provider);
  };

  const loginWithGoogleRedirectResult = async () => {
    if (!process.client || sessionStorage.getItem("google-auth-pending") !== "1") {
      return false;
    }

    loading.value = true;

    try {
      const result = await getRedirectResult($auth);

      if (!result?.user) {
        return false;
      }

      sessionStorage.removeItem("google-auth-pending");
      await finalizeGoogleLogin(result.user);
      return true;
    } catch (error: any) {
      sessionStorage.removeItem("google-auth-pending");
      console.error("Google redirect login error:", error);
      notify(error?.message || "Google login failed. Please try again.", "error");
      return false;
    } finally {
      loading.value = false;
    }
  };

  const isValidPassword = () => {
    const password = registerModel.value.password;
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLowerCase && hasNumber && password.length >= 6
  }
  const register = async () => {

    if (!isValidPassword()) {
      return notify("Password must be at least 6 characters long and contain at least one lowercase letter and one number.", "error")
    }

    if(registerModel.value.password !== registerModel.value.confirmPassword)
      return notify("Password does not match.", "error");

    const emptyFields = Object.entries(registerModel.value)
      .filter(([_, value]) => value === "")
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      return notify(`Please enter ${emptyFields.join(", ")}`, "error");
    }

    loading.value = true;
    try {
      const request: Omit<IRegister, "confirmPassword"> = {
        email: registerModel.value.email,
        password: registerModel.value.password,
        username: registerModel.value.username,
        phone: registerModel.value.phone,
        createdOn: registerModel.value.createdOn,
      };
      const userCredential = await createUserWithEmailAndPassword(
        $auth,
        request.email,
        request.password
      );
      const userId = userCredential.user.uid;

      await setDoc(doc($db, "users", userId), {
        email: userCredential.user.email,
        username: request.username,
        phone: request.phone,
        createdOn: new Date().toISOString(),
      });
      if(userId) {
        navigateTo("/login");
        notify("Success", "success");
      }
      loading.value = false;
    } catch (err: any) {
      loading.value = false;
    }
  };

  const loginModel = ref<ILogin>({
    email: "",
    password: "",
  });
  const login = async () => {
    if (!loginModel.value.email || !loginModel.value.password)
      return notify("Please enter email and password.", "error");

    loading.value = true;
    try {
      const response = await signInWithEmailAndPassword(
        $auth,
        loginModel.value.email,
        loginModel.value.password
      );

      if (response.user) {
        const uId = response.user.uid;
        const token = await response.user.getIdToken();
        await saveSession(uId, token);
        window.location.replace(window.location.origin);
        notify("Success", "success");
      }
    } catch (error) {
      console.error("err:", error);
      notify("Login failed. Please check your credentials.", "error");
    } finally {
      loading.value = false;
    }
  };

  const loginWithGoogle = async () => {
    loading.value = true;
    try {
      if (isEmbeddedAuthContext()) {
        loading.value = false;

        if (window.self !== window.top) {
          const loginUrl = new URL("/login", window.location.origin);
          loginUrl.searchParams.set("googleSignIn", "1");
          window.top?.location.assign(loginUrl.toString());
          return;
        }

        await beginGoogleRedirectLogin();
        return;
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const response = await signInWithPopup($auth, provider);
      await finalizeGoogleLogin(response.user);
    } catch (error: any) {
      console.error("Google login error:", error);
      notify(error?.message || "Google login failed. Please try again.", "error");
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await $auth.signOut();
      await localStorage.clear();
      navigateTo("/login");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      loading.value = false;
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
