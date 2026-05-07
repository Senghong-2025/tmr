import type { ICategory, ICreateCategory } from "~/models/category";

export default function useCategory() {
  const categories = ref<ICategory[]>([]);
  const { isLoading, setLoading } = useLoading();
  const isEdit = ref(false);
  const id = ref("");
  const isShowModal = ref(false);

  const getCategory = async () => {
    setLoading("get", true);

    try {
      categories.value = await $fetch<ICategory[]>("/api/categories", {
        headers: getAuthHeaders(),
      });
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
    setLoading("add", true);

    try {
      const category = await $fetch<ICategory>("/api/categories", {
        method: "POST",
        headers: getAuthHeaders(),
        body: {
          name: model.name,
          type: model.type,
        },
      });

      categories.value.push(category);
    } catch (error) {
      console.error("Error adding category:", error);
      notify(getApiErrorMessage(error, "Error adding category."), "error");
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
      await $fetch(`/api/categories/${id.value}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      categories.value = categories.value.filter((category) => category.id !== id.value);
    } catch (error) {
      console.error("Error deleting category:", error);
      notify(getApiErrorMessage(error, "Error deleting category."), "error");
    } finally {
      setLoading("delete", false);
      isShowModal.value = false;
    }
  };

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
      await $fetch(`/api/categories/${id.value}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: {
          name: model.name,
          type: model.type,
        },
      });

      await getCategory();
      isEdit.value = false;
      model.name = "";
      model.type = "";
    } catch (error) {
      console.error("Error updating category:", error);
      notify(getApiErrorMessage(error, "Error updating category."), "error");
    } finally {
      setLoading("update", false);
    }
  };

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
