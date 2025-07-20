import { ref } from "vue";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
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

      const response = await setDoc(doc($db, "users", userId), {
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
        const docRef = doc($db, "users", uId);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();
        const token = await response.user.getIdToken();
        localStorage.setItem("userId", response.user.uid);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
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
    loginModel,
    logout,
    isAuth,
  };
}
