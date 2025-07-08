import { collection, getDocs, query, where } from "firebase/firestore";
import type { ICategory, ICreateCategory } from "~/models/category";

export default function useCategory () {
     const { $db } = useNuxtApp();
      const categories = ref<ICategory[]>([]);
      const getCurrency = async () => {
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
    
        console.log(categories.value);
      };

      const model = reactive<ICreateCategory>({
        userId: "",
        name: "",
        type: "",
        createdOn: ""
      });
      const addCategory = async () => {

      }
    
      return {
        getCurrency,
        categories
      };
}