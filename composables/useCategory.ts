import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import type { ICategory, ICreateCategory } from "~/models/category";

export default function useCategory() {
  const { $db } = useNuxtApp();
  const categories = ref<ICategory[]>([]);
  const isLoading = ref(false);
  const isEdit = ref(false);
  const getCategory = async () => {
    isLoading.value = true;
    try {
      const useId = localStorage.getItem("userId");
      const q = query(
        collection($db, "categories"),
        where("userId", "==", useId)
      );
      const querySnapshot = await getDocs(q);
      categories.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as ICategory),
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const model = reactive<ICreateCategory>({
    userId: "",
    name: "",
    type: "",
    createdOn: "",
  });
  const addCategory = async () => {
    isLoading.value = true;
    try {
      const useId = localStorage.getItem("userId");
      if (!useId) {
        console.error("User ID not found in local storage.");
        return;
      }
      model.userId = useId;
      model.createdOn = new Date().toISOString();
      await addDoc(collection($db, "categories"), {
        ...toRaw(model),
      });
      await getCategory();
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteCategory = async (id: string) => {
    isLoading.value = true;
    try {
      const categoryRef = doc($db, "categories", id);
      await deleteDoc(categoryRef);
      categories.value = categories.value.filter((category) => category.id !== id);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      isLoading.value = false;
    }
  }

  const id = ref("");
  const onClickEdit = (category: ICategory) => {
    isEdit.value = true;
    model.name = category.name;
    model.type = category.type;
    model.userId = category.userId;
    model.createdOn = category.createdOn;
    id.value = category.id ?? "";
  };

  const updateCategory = async () => {
    isLoading.value = true;
    try {
      const categoryRef = doc($db, "categories", id.value);
      await updateDoc(categoryRef, {
        name: model.name,
        type: model.type,
        userId: model.userId,
        createdOn: model.createdOn,
      });
      await getCategory();
      isEdit.value = false;
      model.name = '';
      model.type = '';
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    getCategory,
    categories,
    isLoading,
    addCategory,
    model,
    deleteCategory,
    isEdit,
    onClickEdit,
    updateCategory,
  };
}
