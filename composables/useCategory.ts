import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import type { ICategory, ICreateCategory } from "~/models/category";

export default function useCategory() {
  const { $db } = useNuxtApp();
  const categories = ref<ICategory[]>([]);
  const { isLoading, setLoading } = useLoading();
  const isEdit = ref(false);
  const id = ref("");
  const isShowModal = ref(false);

  const getCategory = async () => {
    setLoading("get", true);
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
      setLoading("get", false);
    }
  };

  const model = reactive<ICreateCategory>({
    userId: "",
    name: "",
    type: "",
    createdOn: "",
  });
  const addCategory = async () => {
    setLoading('add', true);
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
      model.name = "";
      model.type = "";
      setLoading("add", false);
    }
  };

  const onClickDelete = (categoryId: string) => {
    id.value = categoryId;
    isShowModal.value = true;
  };
  const deleteCategory = async () => {
    setLoading("delete", true);
    try {
      const categoryRef = doc($db, "categories", id.value);
      await deleteDoc(categoryRef);
      categories.value = categories.value.filter((category) => category.id !== id.value);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setLoading("delete", false);
      isShowModal.value = false;
    }
  }

  const onClickEdit = (category: ICategory) => {
    isEdit.value = true;
    model.name = category.name;
    model.type = category.type;
    model.userId = category.userId;
    model.createdOn = category.createdOn;
    id.value = category.id ?? "";
  };

  const updateCategory = async () => {
    setLoading("update", true);
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
      setLoading("update", false);
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
    onClickDelete,
    isShowModal,
  };
}
