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
    username: "",
    phone: "",
    createdOn: "",
  });
  const register = async () => {
    loading.value = true;
    error.value = null;
    try {
      const request: IRegister = {
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

      loading.value = false;
    } catch (err: any) {
      error.value = err.message;
      loading.value = false;
      return null;
    }
  };

  const loginModel = ref<ILogin>({
    email: "",
    password: "",
  });
  const login = async () => {
    loading.value = true;
    try {
      const response = await signInWithEmailAndPassword(
        $auth,
        loginModel.value.email,
        loginModel.value.password
      );

      if (response.user) {
        console.log(response.user.uid);
        const uId = response.user.uid;
        const docRef = doc($db, "users", uId);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();
        const token = await response.user.getIdToken();
        localStorage.setItem("userId", response.user.uid)
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        window.location.replace(window.location.origin);
      }
    } catch (error) {
      console.error("err:", error);
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await $auth.signOut();
      localStorage.clear();
      navigateTo("/login");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      loading.value = false;
    }
  };

  const isAuth = computed(() => localStorage.getItem("token"));

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
